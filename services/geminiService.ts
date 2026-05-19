import { ChatMessage } from "../types";
import { EVENTS_DATA } from "../constants";
import { TIMELINE_DATA } from "../components/HistoricalTimeline";


/* ================================
   CONFIG (VITE)
================================ */
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn("⚠️ Gemini API key is missing");
  throw new Error("Missing Gemini API key");
}

const getApiKey = () => API_KEY;
const rotateKey = () => {};

const TEXT_MODEL = "gemini-2.0-flash";
const TTS_MODEL = "gemini-2.0-flash";

const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";

/* ================================
   TYPES
================================ */
export interface Trivia {
  question: string;
  answer: string;
  explanation: string;
}

/* ================================
   FETCH WITH RETRY + KEY ROTATION
================================ */
async function fetchWithRetry(
  urlTemplate: string,
  options: RequestInit,
  retries = 3
) {
  for (let i = 0; i < retries; i++) {
    try {
      const url = urlTemplate.replace(/key=[^&]+/, `key=${getApiKey()}`);
      const res = await fetch(url, options);
      const data = await res.json().catch(() => ({}));

      if (res.ok) return data;

      console.error("❌ Gemini error:", res.status, data);

      /* 🟡 RATE LIMIT — rotate to next key */
      if (res.status === 429) {
        console.warn("⏳ Rate limited — rotating API key...");
        rotateKey();
        await new Promise(r => setTimeout(r, 1000));
        continue;
      }

      /* ❌ STOP retrying for client errors */
      if (res.status < 500) break;

      /* 🔁 exponential backoff for server errors */
      await new Promise(r => setTimeout(r, 2 ** i * 3000));
    } catch (err) {
      if (i === retries - 1) throw err;
    }
  }

  return null;
}

/* ================================
   TRIVIA
================================ */
export async function generateCulturalTrivia(): Promise<Trivia> {
  try {
    const result = await fetchWithRetry(
      `${BASE_URL}/${TEXT_MODEL}:generateContent?key=${getApiKey()}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Generate one Ethiopian culture, history, or geography trivia.
Return STRICT JSON:
{
 "question": "...",
 "answer": "...",
 "explanation": "..."
}`
                }
              ]
            }
          ],
          generationConfig: {
            responseMimeType: "application/json"
          }
        })
      }
    );

    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) throw new Error("Empty trivia response");

    return JSON.parse(text.replace(/```json|```/g, "").trim());
  } catch {
    console.warn("⚠️ Using fallback trivia");

    return {
      question:
        "Which Ethiopian city is known as the political capital of Africa?",
      answer: "Addis Ababa",
      explanation:
        "Addis Ababa hosts the African Union headquarters and many international organizations."
    };
  }
}

/* ================================
   CULTURAL INSIGHT
================================ */
export async function getCulturalInsight(
  eventName: string,
  description: string
): Promise<string> {
  try {
    const result = await fetchWithRetry(
      `${BASE_URL}/${TEXT_MODEL}:generateContent?key=${getApiKey()}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Provide a short cultural insight about the Ethiopian festival "${eventName}".
Context: ${description}
Max 60 words.`
                }
              ]
            }
          ]
        })
      }
    );

    return (
      result?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Insight unavailable."
    );
  } catch {
    return "Insight unavailable.";
  }
}

/* ================================
   AMHARIC TTS
================================ */
export async function speakAmharic(
  text: string
): Promise<Uint8Array | null> {
  try {
    const result = await fetchWithRetry(
      `${BASE_URL}/${TTS_MODEL}:generateContent?key=${getApiKey()}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text }] }],
          generationConfig: {
            response_modalities: ["AUDIO"],
            responseModalities: ["AUDIO"],
            speech_config: {
              voice_config: {
                prebuilt_voice_config: {
                  voice_name: "Puck"
                }
              }
            },
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: {
                  voiceName: "Puck"
                }
              }
            }
          }
        })
      }
    );

    const base64 =
      result?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64) return null;

    const binary = atob(base64);
    return Uint8Array.from(binary, c => c.charCodeAt(0));
  } catch (err) {
    console.error("TTS error:", err);
    return null;
  }
}

/* ================================
   OPENAI CONFIG
================================ */
const OPENAI_KEY = import.meta.env.VITE_OPENAI_API_KEY;

/* ================================
   HERITAGE GUIDE CHAT (OpenAI Primary + Gemini Fallback)
================================ */
const SYSTEM_INSTRUCTIONS: Record<string, string> = {
  guide: "You are an expert Ethiopian Heritage Guide. Answer with passion, clarity, and cultural pride. Keep answers concise but informative.",
  storyteller: "You are a master Ethiopian historical storyteller. Narrate events as if they are epic tales, with rich descriptions and emotional weight. Make the user feel like they are there. Use cinematic language.",
  teacher: "You are a patient and knowledgeable Ethiopian cultural teacher. Explain traditions, rituals, and customs step-by-step, making them easy to understand for students.",
  festival: "You are a vibrant festival explainer. Describe Ethiopian festivals with colors, sounds, and excitement, as if the user is attending them.",
  myth: "You are a keeper of Ethiopian myths and legends. Narrate ancient stories, folktales, and mysteries with a sense of wonder and magic."
};

async function chatWithOpenAI(
  history: ChatMessage[],
  message: string,
  mode: string
): Promise<string | null> {
  if (!OPENAI_KEY) return null;

  try {
    console.log("🟢 Calling OpenAI with mode:", mode);

    const messages = [
      { role: "system", content: SYSTEM_INSTRUCTIONS[mode] || SYSTEM_INSTRUCTIONS.guide },
      ...history.map(msg => ({
        role: msg.role === "user" ? "user" as const : "assistant" as const,
        content: msg.text
      })),
      { role: "user" as const, content: message }
    ];

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        max_tokens: 1000
      })
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("❌ OpenAI error:", res.status, data);
      return null;
    }

    const text = data?.choices?.[0]?.message?.content;
    if (text) {
      console.log("✅ OpenAI response received");
      return text;
    }

    return null;
  } catch (err) {
    console.error("❌ OpenAI fetch error:", err);
    return null;
  }
}

async function chatWithGemini(
  history: ChatMessage[],
  message: string,
  mode: string
): Promise<string | null> {
  try {
    console.log("🟡 Falling back to Gemini...");

    const contents = history.map(msg => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.text }]
    }));
    contents.push({ role: "user", parts: [{ text: message }] });

    const result = await fetchWithRetry(
      `${BASE_URL}/${TEXT_MODEL}:generateContent?key=${getApiKey()}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          systemInstruction: {
            parts: [{ text: SYSTEM_INSTRUCTIONS[mode] || SYSTEM_INSTRUCTIONS.guide }]
          }
        })
      }
    );

    return result?.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch {
    return null;
  }
}

/* ================================
   OFFLINE DATA REGISTRIES
================================ */
interface OfflineItem {
  title: string;
  year?: string;
  category: string;
  description: string;
  keyFigures?: string[];
  location?: string;
  milestones?: string[];
  narratives: {
    guide: string;
    storyteller: string;
    teacher: string;
    festival: string;
    myth: string;
  };
}

const OFFLINE_REGISTRY: OfflineItem[] = [
  {
    title: "Discovery of Lucy (Dinknesh)",
    year: "c. 3.2M BC",
    category: "Cradle of Humanity / Science",
    description: "The 3.2-million-year-old fossilized remains of Australopithecus afarensis, establishing Ethiopia as the cradle of humanity.",
    keyFigures: ["Donald Johanson", "Maurice Taieb", "Alemayehu Asfaw"],
    location: "Hadar, Afar Region",
    milestones: ["1974: Discovery of AL 288-1 remains", "1978: Scientific description as A. afarensis"],
    narratives: {
      guide: "The discovery of <b>Dinknesh</b> (Lucy) in 1974 in the Afar Depression revolutionized evolutionary biology. Dating back 3.2 million years, she walked upright, proving bipedalism occurred before large brain growth, cementing Ethiopia as the <b>cradle of humanity</b>.",
      storyteller: "Deep in the sands of the Afar desert, a marvelous treasure lay sleeping for three million years. They named her <b>Dinknesh</b>—'you are marvelous.' She was small of stature, but walked upright on two feet, just as we do today. She is the mother of us all, an ancient ancestor who walked the plains of Ethiopia when the world was young.",
      teacher: "Dinknesh represents a crucial link in human evolutionary biology. Discovered by Donald Johanson, her skeleton is roughly 40% complete. The pelvic and leg structure clearly show that she walked upright, which was a revolutionary discovery because it overturned the scientific consensus that brain size grew before bipedalism.",
      festival: "Dinknesh is celebrated with immense pride in Ethiopia's National Museum in Addis Ababa, where her replica is displayed. International students, tourists, and locals gather to view the cradle of humanity, celebrating the scientific heritage that unites all humans back to the fertile soil of Ethiopia.",
      myth: "Dinknesh is a symbol of our shared human ancestry. The local Afar people speak of the desert sands preserving the bones of the first humans as a sacred duty, guarding the maternal spark of humanity for millions of years until the world was mature enough to understand its own origin."
    }
  },
  {
    title: "Kingdom of Dʿmt & Yeha",
    year: "c. 8th Century BC",
    category: "Ancient Civilizations",
    description: "An ancient kingdom in northern Ethiopia featuring the Great Temple of Yeha, Sub-Saharan Africa's oldest standing intact structure.",
    keyFigures: ["D'mt Royalty", "Sabaean Architects"],
    location: "Yeha, Tigray Region",
    milestones: ["c. 800 BC: Construction of the Great Temple", "1960s: First modern archaeological excavations"],
    narratives: {
      guide: "The <b>Kingdom of Dʿmt</b> flourished in northern Ethiopia during the 10th to 5th centuries BC, establishing early trade, writing, and irrigation systems. The <b>Great Temple of Yeha</b>, constructed using massive precisely dressed limestone blocks without mortar, stands today as Sub-Saharan Africa's oldest intact standing structure.",
      storyteller: "Behold the towering stone walls of <b>Yeha</b>! Carved without mortar by ancient hands in the 8th century BC, it stands as an enduring monument to the mighty Kingdom of Dʿmt. Here, early traders and wise rulers established a sanctuary of writing and copper casting that paved the way for Axum.",
      teacher: "Students, let's study the dry-stone masonry of the Temple of Yeha. It was built using Sabaean architectural styles, demonstrating close ties between northern Ethiopia and the southern Arabian peninsula. It shows early technological advances in iron smelting and agriculture in the region.",
      festival: "Every year, researchers, heritage enthusiasts, and locals gather in the historic valley of Yeha to explore the ancient ruins, celebrating the deep civilizational roots that laid the foundation for the Ethiopian Orthodox cultural traditions.",
      myth: "Legend says that the giants of Dʿmt carved the colossal blocks of Yeha from distant mountains, carrying them with ease and placing them so perfectly that even the wind could not pass between the mortarless stones, sealing the sacred temple with divine protective spells."
    }
  },
  {
    title: "Rise of the Axumite Empire",
    year: "c. 100 AD",
    category: "Ancient Empires",
    description: "Axum emerges as a major global naval and trading power, bridging the Roman Empire and ancient India from the northern highlands.",
    keyFigures: ["King Zoskales", "Emperor Endubis", "Adulis Port Governors"],
    location: "Axum, Tigray Region",
    milestones: ["c. 100 AD: Axumite coinage system introduced", "c. 300 AD: Carving and erection of the giant stelae"],
    narratives: {
      guide: "By the 1st century AD, <b>Axum</b> rose to become a dominant mercantile empire, controlling trade routes between the Roman Empire and India. Its power was marked by massive monolithic obelisks (stele) and its own gold, silver, and bronze coinage. The empire controlled the Red Sea port of Adulis, serving as a cosmopolitan crossroads.",
      storyteller: "Long ago, the powerful kings of <b>Axum</b> ruled the seas and the highlands. They minted their own coins of pure gold, declaring their sovereignty to empires far and wide. Their crowning monuments were the colossal granite stelae—carved to look like multi-story skyscrapers, reaching upward to touch the heavens.",
      teacher: "Historically, the Axumite Empire was ranked by the philosopher Mani as one of the four great empires of the world, alongside Rome, Persia, and China. They developed a sophisticated maritime trading network, exporting ivory, gold, emeralds, and agricultural goods through the port of Adulis.",
      festival: "The legacy of Axum is celebrated during pilgrimages, where tens of thousands of people dressed in bright white vestments gather around the towering stelae, chanting and beating drums, bringing the ancient stone city to life.",
      myth: "According to ancient accounts, the obelisks of Axum were carved and erected by legendary giants or through the power of the Ark of the Covenant, which projected a beam of divine fire that melted the hard granite into soft clay, allowing it to be molded easily."
    }
  },
  {
    title: "Adoption of Christianity in Axum",
    year: "c. 330 AD",
    category: "Religion / Philosophy",
    description: "King Ezana adopts Christianity, making Axum one of the very first nations to do so.",
    keyFigures: ["King Ezana", "Saint Frumentius (Abba Selama)"],
    location: "Saint Mary of Zion Cathedral, Axum",
    milestones: ["c. 330 AD: King Ezana's conversion", "c. 480 AD: Arrival of the Nine Saints to translate texts"],
    narratives: {
      guide: "Under <b>King Ezana</b> in 330 AD, the Kingdom of Axum officially embraced Christianity, guided by the Syrian scholar Frumentius, who became the first Abuna (bishop). This monumental shift made Ethiopia one of the earliest Christian nations in the world, deeply integrating the Orthodox Tewahedo faith into its culture.",
      storyteller: "A holy fire swept through the mountains of Tigray! <b>King Ezana</b>, guided by the wisdom of Saint Frumentius, cast aside ancient pagan rituals and declared that his empire would bow to the cross of Christ. The crescent moon was erased from the coins, replaced by the holy cross, uniting the empire under a single sacred banner.",
      teacher: "This event is crucial because it deeply shaped Ethiopian literature and art. The conversion led to the translation of the Bible into Ge'ez, a process accelerated by the Nine Saints who arrived from the Byzantine Empire, establishing monasteries that preserved ancient texts for centuries.",
      festival: "This historic adoption is celebrated in Axum during the profound gathering of <b>Tsion Mariam</b> on November 30. Thousands of white-clad Orthodox believers converge on the historic cathedral, bringing colorful ceremonial umbrellas, sacred chants, and rhythmic dances.",
      myth: "It is believed that when King Ezana converted, a heavenly light descended upon Axum, and the foundations of the first Saint Mary of Zion cathedral were laid by angels using stone transported from the mount of Sinai, creating a sanctuary that would eventually hold the Ark of the Covenant."
    }
  },
  {
    title: "Development of Ge'ez Script",
    year: "c. 500 AD",
    category: "Language / Innovation",
    description: "The development of the indigenous Ge'ez script, a unique African writing system still in active use today.",
    keyFigures: ["Axumite Royal Scribes", "Liturgy Scholars"],
    location: "Imperial Scriptoria, Axum",
    milestones: ["c. 3rd Century: Vowel markers added", "c. 5th Century: Translation of Greek scriptures"],
    narratives: {
      guide: "Originating from South Semitic roots, the <b>Ge'ez language</b> developed a unique abugida writing system in Axum, where consonants are modified by vowel symbols. It is one of the very few indigenous African writing systems still actively used today for religious and historical records.",
      storyteller: "Look upon the ancient parchments of the highlands! With reed pens and ink made from wild berries, the royal scribes of Axum carved the elegant letters of <b>Ge'ez</b>. It is an abugida—a writing system where every letter breathes with its own vowel sound, capturing the ancient wisdom of a nation in stone and skin.",
      teacher: "Ge'ez is the linguistic ancestor of Amharic and Tigrinya. Its development is unique because it added vowel markers to the Semitic consonants, reading from left to right. This script became the bedrock of Ethiopian literature, liturgy, and administration.",
      festival: "Liturgical scholars celebrate the Ge'ez script during sacred chants and church ceremonies, where massive hand-written parchment books (Biranna) are proudly displayed, showing off centuries-old calligraphic masterworks.",
      myth: "Tradition holds that the Ge'ez letters were inspired by the patterns of the stars and the movements of birds, a sacred gift from Enoch and the angels, designed to write down the secret celestial codes and prayers of the holy prophets."
    }
  },
  {
    title: "First Hijra to Axum (Al Nejashi)",
    year: "615 AD",
    category: "Religion / Diplomacy",
    description: "Early companions of the Prophet Muhammad seek refuge from persecution, welcomed warmly by the Axumite King.",
    keyFigures: ["King Armah (Al-Nejashi)", "Ja'far ibn Abi Talib"],
    location: "Negash, Tigray Region",
    milestones: ["615 AD: Arrival of Muslim refugees", "628 AD: Safe return of companions to Medina"],
    narratives: {
      guide: "In 615 AD, early followers of the Prophet Muhammad fled persecution in Mecca. The Christian Axumite Emperor, <b>Armah (Al-Nejashi)</b>, welcomed them and refused bribes to return them, granting them freedom. This historic act established a permanent bond of peace and coexistence.",
      storyteller: "Across the Red Sea they fled, weary and afraid! The companions of the Prophet Muhammad arrived at the court of the Christian King <b>Al-Nejashi</b>. When the persecutors demanded their return, the righteous king drew a line in the sand and declared he would not surrender them for a mountain of gold, offering them eternal safety.",
      teacher: "This event is known in Islamic history as the <b>First Hijra</b>. The protection granted by the Ethiopian king is highly significant, leading to the Prophet Muhammad's famous command to his followers to leave the Ethiopians in peace as long as they do not take the offensive.",
      festival: "The historical memory of the Hijra is honored at the <b>Al Nejashi Mosque</b> in Negash, one of the oldest Islamic sanctuaries in Africa, attracting pilgrims and scholars who celebrate the long history of Christian-Muslim harmony in Ethiopia.",
      myth: "It is said that when King Al-Nejashi passed away, the Prophet Muhammad, residing miles away in Medina, was spiritually shown the king's body and led his companions in the first funeral prayer in absentia for the righteous Christian monarch."
    }
  },
  {
    title: "Rock-Hewn Churches of Lalibela",
    year: "c. 1200 AD",
    category: "Architecture / Culture",
    description: "Eleven monolithic churches carved entirely downward from living volcanic rock in the Amhara region.",
    keyFigures: ["King Gebre Mesqel Lalibela", "Zagwe Stonemasons"],
    location: "Lalibela, Amhara Region",
    milestones: ["c. 1200: Construction begins", "1978: Inscribed as a UNESCO World Heritage site"],
    narratives: {
      guide: "The <b>Rock-Hewn Churches of Lalibela</b> are masterpieces of medieval engineering. Built in the 12th century under King Lalibela of the Zagwe dynasty, these 11 monolithic churches were carved straight down into solid red volcanic tuff rock, connected by tunnels.",
      storyteller: "In the medieval highlands of Roha, King Lalibela looked upon the earth and envisioned a New Jerusalem carved from the very bones of the world. With heavy iron chisels, stonemasons cut deep. It is whispered that as the mortal workers rested at night, angels descended from the heavens to double the speed of the carving.",
      teacher: "Let us study the architecture of Lalibela. The 11 churches are split into three groups: the Northern, Eastern, and Western groups. Because they are carved from a single piece of volcanic rock, any error would have been catastrophic. This required absolute mastery of geometry, stone carving, and hydraulics.",
      festival: "Lalibela becomes a glorious ocean of white during <b>Genna</b> (Ethiopian Christmas) on January 7! Tens of thousands of white-robed Orthodox pilgrims gather around the deep trenches, chanting liturgical songs accompanied by the deep rhythmic beat of Kebero drums.",
      myth: "The legend says King Lalibela was transported to heaven where God commanded him to carve a New Jerusalem out of stone. Angels actively worked alongside the stonemasons, and King Lalibela's hands were said to be blessed with an unnatural strength that made hard volcanic rock feel like soft wax."
    }
  },
  {
    title: "Establishment of the Gadaa System",
    year: "13th Century",
    category: "Democratic Governance",
    description: "The Oromo people formalize the Gadaa system, a highly complex, egalitarian, democratic socio-political system.",
    keyFigures: ["Abbaa Gadaa Leaders", "Council of Elders"],
    location: "Oromia Region",
    milestones: ["13th Century: Formalization of assemblies", "2016: Inscribed as UNESCO Intangible Heritage"],
    narratives: {
      guide: "The <b>Gadaa System</b> is an ancient, highly structured democratic system of social, political, and economic governance developed by the Oromo people. Formalized around the 13th century, the system organizes society into active classes (Luba) that rotate power every eight years.",
      storyteller: "Under the shade of the sacred Oda tree, the Oromo elders gather in peaceful assembly. This is the <b>Gadaa</b>, where power does not belong to a king, but flows democratically through the community. Every eight years, with solemn oaths, a new Luba class takes the scepter (Bokkuu) to lead the people in justice and harmony.",
      teacher: "The Gadaa system is a highly complex social calendar split into five distinct age-grades. Each grade goes through rigorous training in defense, law, diplomacy, and governance before assuming leadership. The Abbaa Gadaa acts as the president, but he governs alongside a council (Chaffee) for checks and balances.",
      festival: "The festival of <b>Irreechaa</b> is the majestic celebration of thanksgiving associated with the Oromo and the Gadaa calendar. Celebrated at the end of the rainy season in September, millions of people dress in stunning white cultural clothes and gather near sacred lakes to thank God (Waaqayyo) for peace.",
      myth: "The Gadaa system is said to be as balanced as the cycles of nature itself. The Oda tree under which the Gadaa councils meet is believed to represent the cosmic tree of life, whose leaves shade the righteous and whose deep roots bind the community to the laws of truth (Dugoomsa)."
    }
  },
  {
    title: "Ethiopian–Adal War (Ahmad Gragn)",
    year: "1529 - 1543",
    category: "Warfare / History",
    description: "A conflict between the Christian Ethiopian Empire and the Muslim Adal Sultanate under Imam Ahmad ibn Ibrahim.",
    keyFigures: ["Imam Ahmad ibn Ibrahim (Gragn)", "Emperor Gelawdewos", "Cristóvão da Gama"],
    location: "Central Highlands and Harar Rift",
    milestones: ["1529: Battle of Shimbra Kure", "1541: Portuguese military lands", "1543: Battle of Wayna Daga"],
    narratives: {
      guide: "The conflict between the Christian Solomonic Empire and the Islamic Adal Sultanate, led by <b>Imam Ahmad ibn Ibrahim al-Ghazi (Gragn)</b>, devastated the region from 1529 to 1543. Armed with Ottoman firearms, Adal forces conquered most of the highlands. The war ended with Ahmad's death at Wayna Daga.",
      storyteller: "The hills burned with fire and steel! From the lowlands of Harar charged Imam Ahmad Gragn, carrying the banners of the Adal Sultanate. With unmatched firepower, his armies swept the highlands, challenging the ancient monarchy. Only through the arrival of Portuguese musketeers and the sacrifice of Emperor Gelawdewos was the storm finally halted at Wayna Daga.",
      teacher: "This war fundamentally altered the demographics and politics of the Horn of Africa. The massive destruction of medieval Christian churches and cities led to the decline of the imperial center, leaving both Christian and Islamic empires exhausted and vulnerable to subsequent migrations and political restructuring.",
      festival: "While a tragic chapter of conflict, the historical lessons of the war are taught with solemn respect, highlighting the deep cultural resilience of both the Christian and Muslim communities of Ethiopia who subsequently built paths of coexistence.",
      myth: "Local folklore tells of Imam Ahmad Gragn's physical strength, claiming he was a giant who could split stone blocks with a single blow of his sword. It is said that only a golden bullet cast with holy water by a Portuguese marksman could pierce his magical armor at the Battle of Wayna Daga."
    }
  },
  {
    title: "Founding of Gondar & Castles",
    year: "1636",
    category: "Politics / Architecture",
    description: "Emperor Fasilides establishes Gondar as the permanent capital, starting a century of castle building.",
    keyFigures: ["Emperor Fasilides", "Empress Mentewab"],
    location: "Fasil Ghebbi, Gondar",
    milestones: ["1636: Emperor Fasilides orders the first castle built", "1979: Inscribed as a UNESCO World Heritage site"],
    narratives: {
      guide: "In 1636, <b>Emperor Fasilides</b> established Gondar as the permanent capital of the Solomonic dynasty, ending the tradition of mobile royal camps. He built <b>Fasil Ghebbi</b>, a spectacular fortress city featuring stone castles blending Axumite, Portuguese, and Indian styles.",
      storyteller: "The era of the wandering tents was over! Emperor Fasilides looked upon the fertile hills of Gondar and declared: 'Here shall be our eternal capital.' He raised majestic stone castles, towers, and libraries. Gondar arose as a Camelot of Africa, rich with gold, art, and the royal court of the Solomonic kings.",
      teacher: "The Gondarine period represents a unique architectural and cultural renaissance in Ethiopia. The style, often called 'Gondarine Baroque', represents a fusion of diverse global elements with traditional Axumite design. The fortress city of Fasil Ghebbi stands today as an incredible engineering achievement.",
      festival: "Gondar hosts the most famous <b>Timkat</b> (Epiphany) celebration in the world! Thousands of people jump into the historic Fasilides Bath, filled with blessed water, reflecting the colorful liturgical vestments and joyous chants of the crowd.",
      myth: "Legend tells us that Emperor Fasilides was guided to the site of Gondar by a sacred white buffalo, which led him to a thermal spring where a voice from heaven whispered that his dynasty would flourish if he built his palace on that very soil."
    }
  },
  {
    title: "Rise of Emperor Tewodros II",
    year: "1855",
    category: "Reunification / Politics",
    description: "Emperor Tewodros II ends the chaotic Era of the Princes (Zemene Mesafint) and centralizes power.",
    keyFigures: ["Emperor Tewodros II (Kassa Hailu)", "John Bell"],
    location: "Maqdala Fortress, Amhara Region",
    milestones: ["1855: Coronation at Derasge Maryam", "1868: British expedition forces defeat and Tewodros suicide"],
    narratives: {
      guide: "<b>Emperor Tewodros II</b> seized power in 1855, bringing an end to the chaotic 'Zemene Mesafint' (Era of Princes). Driven by a vision of a modernized, unified Ethiopia, he centralized administrative power, created a professional army, and laid the groundwork for the modern state.",
      storyteller: "From a humble soldier to the king of kings! Kassa Hailu arose from the flames of civil war to become Emperor Tewodros II. He swore an oath to break the regional warlords and rebuild a unified, proud Ethiopia. At his mountaintop fortress of Maqdala, he built the giant mortar 'Sebastopol', choosing death by his own hand over surrender to the invading British forces.",
      teacher: "Tewodros II is considered the father of modern unified Ethiopia. His administrative reforms aimed to replace feudal regional governors with centrally appointed officials. Though his reign ended in tragedy at the Battle of Maqdala in 1868, his national vision inspired his successors, Yohannes IV and Menelik II.",
      festival: "Every year on Yekatit and April, historical societies and patriots celebrate the life and bravery of Emperor Tewodros II, singing epic heroic poetry (Fano) and honoring his legacy of national pride and resistance at Maqdala.",
      myth: "It is said that when Tewodros was a child, a hermit prophesied that a man named Kassa would arise from the west, shatter the regional princes, and rule with the strength of a lion, leading the empire back to the glory of the ancient Solomonic kings."
    }
  },
  {
    title: "Traditional Coffee (Buna) Ceremony",
    category: "Culinary / Social Culture",
    description: "The spiritual and social ritual of roasting, grinding, and brewing Arabica coffee in the black clay Jebena.",
    location: "Nationwide",
    narratives: {
      guide: "Ethiopia is the birthplace of Arabica coffee, which originated in the Kaffa region. The traditional <b>Buna Ceremony</b> is a highly respected social ritual. It involves roasting green coffee beans over hot coals, grinding them manually, and brewing them three times in a black clay pot called a <b>Jebena</b>.",
      storyteller: "Close your eyes and breathe in the rich, heavy aroma of roasting coffee beans, blending with the sweet scent of burning frankincense. The Buna ceremony is a sacred dance of hospitality. From the tall neck of the dark clay Jebena, a rich dark nectar is poured, bringing warmth, conversation, and blessings to all who sit together.",
      teacher: "The Buna ceremony has a strict three-round structure that you must remember. The first round is called <b>Abol</b> (the strongest, poured for guests). The second round is <b>Tona</b> (brewed with fresh water added to the grinds, lighter). The third round is <b>Baraka</b> (the blessing round, representing peace and safety). Poured from a height into small cups called Cini.",
      festival: "During holidays like Timkat or Genna, the Buna ceremony is elevated. Paved with fresh cut green grass on the floor, the coffee area is adorned with yellow flowers, and the host serves popcorn, roasted barley (Kolo), and traditional bread alongside the three sacred cups of Buna.",
      myth: "The discovery of coffee is told through the popular legend of Kaldi, a young Abyssinian goatherd who noticed his goats dancing energetically after eating small red berries from a wild shrub. The roasted beans released an aroma so heavenly that the monks quickly raked them from the coals, crushed them in hot water, and created the first cup of coffee."
    }
  },
  {
    title: "Ethiopian 13-Month Calendar & Time",
    category: "Science / Innovation",
    description: "The unique solar calendar consisting of 13 months and a 12-hour clock starting at sunrise.",
    location: "Nationwide",
    narratives: {
      guide: "The <b>Ethiopian Calendar</b> is a unique solar calendar that is roughly seven to eight years behind the Gregorian calendar. It consists of 13 months: 12 months of exactly 30 days each, and a 13th month called <b>Pagumē</b> which has 5 days (or 6 days in a leap year). The calendar is aligned with the ancient Julian calendar.",
      storyteller: "Welcome to a land where time flows differently! In Ethiopia, we are seven years younger, and our year has thirteen months of sunshine. The final month, Pagumē, is a magical bridge of five days where time stands still before the New Year dawns. Even our day begins not at midnight, but at the rising of the sun.",
      teacher: "The day is divided into two 12-hour cycles starting at dawn. What we call 7:00 AM in the West is 1:00 (Kese'at) in Ethiopian time, because it is the first hour after sunrise. Additionally, our calendar is based on the calculation of the Annunciation of Jesus, placing us 7 years and 8 months behind the Gregorian standard.",
      festival: "Enkutatash (the Ethiopian New Year) on September 11 is the ultimate calendar festival! The heavy summer rains end, the skies clear, and the highland meadows explode in a carpet of bright yellow daisies called Meskel flowers. Children sing traditional songs like 'Abebayehosh' door-to-door, celebrating the transition to the new year.",
      myth: "Pagumē, the short 13th month, is treated in folklore as a sacred, mystical time. Because it belongs to no standard month, it is believed that the waters of all rivers are blessed with holy purification during these five days. Many traditional people will bathe in the rivers at dawn during Pagumē to wash away the trials of the past year."
    }
  },
  {
    title: "Traditional Food (Injera & Doro Wat)",
    category: "Culinary Arts",
    description: "spongy sourdough flatbread made from fermented teff grain, served with spicy stews like Doro Wat.",
    location: "Nationwide",
    narratives: {
      guide: "Ethiopian cuisine is highly distinctive, healthy, and communal, centered around <b>Injera</b>—a large, spongy, sourdough flatbread made from fermented <b>teff grain</b> (an ancient superfood). Various spicy stews, known as Wat (such as Doro Wat chicken stew), are served directly on top of the Injera.",
      storyteller: "Gather close around the colorful woven Mesob table. To eat in Ethiopia is to share a covenant of friendship. A large platter of Injera is spread out, topped with colorful mounds of rich, spicy red Doro Wat, simmered with berbere spices and boiled eggs. You tear a soft piece of Injera, scoop the savory sauce, and place it in the mouth of your companion. This is Gursha—an act of pure love.",
      teacher: "Let's study the fermentation chemistry of Injera. The tiny teff seeds are ground into flour and mixed with water to ferment for three to four days, creating a natural yeast starter called Ersho. This fermentation gives Injera its unique sour taste and spongy texture with tiny holes called 'eyes' (Ayn). Eating is done strictly with the right hand.",
      festival: "During major religious holidays like Fasika (Easter) or Genna, the end of long fasting periods is marked by a massive culinary explosion. At midnight, families break the fast with freshly prepared chicken stew (Doro Wat), delicious raw meat (Kifto), and home-brewed honey wine called Tej.",
      myth: "Teff is believed to have been cultivated in the Ethiopian highlands for over 6,000 years. Legend says that the ancient giants who built the stelae of Axum survived on a diet of teff and honey, giving them the strength to lift single blocks of granite that weighed hundreds of tons from quarries miles away."
    }
  }
];

function getOfflineHeritageResponse(
  message: string,
  mode: 'guide' | 'storyteller' | 'teacher' | 'festival' | 'myth'
): string {
  const query = message.toLowerCase().trim();

  const selectModeResponse = (options: {
    guide: string;
    storyteller: string;
    teacher: string;
    festival: string;
    myth: string;
  }) => {
    return options[mode] || options.guide;
  };

  // 1. Check for quick matching of greetings
  if (query.match(/\b(hi|hello|hey|greetings|hola|who are you|howdy|good morning|good afternoon)\b/)) {
    return selectModeResponse({
      guide: "Greetings, fellow explorer! I am your interactive Ethiopian Heritage Guide. Although I am currently operating on <b>Offline Intelligence Mode</b>, I have complete access to the vault of Ethiopian history. What ancient empire, tradition, or festival shall we explore today?",
      storyteller: "Welcome, traveler! Draw close to the warm digital embers. I am the storyteller. Though my connection to the neural ether is currently asleep, my chest of tales is bursting with epic sagas of warriors, kings, and ancient wonders. Ask, and the chronicle shall unfold!",
      teacher: "Hello, seeker of knowledge! I am your cultural teacher. I am currently running on local backup storage, but we have everything we need to learn. Ask me about Ge'ez writing, the 13-month calendar, the democratic Gadaa system, or our vibrant festivals!",
      festival: "A spectacular welcome! I am your festival explainer. While my servers are taking a brief breath, I am fully ready to describe the dancing, the music, and the sacred dates of Timkat, Meskel, or Enkutatash. Ask away!",
      myth: "Greetings, brave soul. You have stepped into the realm of ancient mysteries and folklore. My live cosmic connection is resting, but the ancient legends of the Ark, the Queen of Sheba, and the angels of Lalibela never fade. Speak, and I shall unveil the mysteries."
    });
  }

  // 2. Dynamically build unified offline registry
  const combinedRegistry: OfflineItem[] = [...OFFLINE_REGISTRY];

  // Add all 25 timeline items dynamically if they aren't already represented
  for (const tEvent of TIMELINE_DATA) {
    const exists = OFFLINE_REGISTRY.some(
      item => item.title.toLowerCase().includes(tEvent.title.toLowerCase()) || 
              tEvent.title.toLowerCase().includes(item.title.toLowerCase())
    );
    if (!exists) {
      combinedRegistry.push({
        title: tEvent.title,
        year: tEvent.year,
        category: tEvent.category,
        description: tEvent.description,
        keyFigures: tEvent.keyFigures,
        location: tEvent.location,
        milestones: tEvent.milestones,
        narratives: {
          guide: `${tEvent.detailedDescription}`,
          storyteller: `Hearken to the grand chronicle of <b>${tEvent.title}</b>! In the era of <b>${tEvent.year}</b>, a great turning point unfolded. ${tEvent.detailedDescription}`,
          teacher: `Let us analyze <b>${tEvent.title}</b> (${tEvent.year}). This historic event took place in <b>${tEvent.location}</b>. Key figures involved: <b>${tEvent.keyFigures.join(", ")}</b>. ${tEvent.detailedDescription}`,
          festival: `We celebrate the memory of <b>${tEvent.title}</b>! Marking an era of <b>${tEvent.year}</b>, this historic milestone has left an unforgettable legacy that continues to shape our regional culture and identity.`,
          myth: `The ancient legends of <b>${tEvent.title}</b> are woven into the very soul of the highlands. It is whispered that during the era of <b>${tEvent.year}</b>, forces beyond our understanding guided the hand of destiny at <b>${tEvent.location}</b>.`
        }
      });
    }
  }

  // Add all 11 calendar festivals dynamically if they aren't already represented
  for (const fEvent of EVENTS_DATA) {
    const exists = combinedRegistry.some(
      item => item.title.toLowerCase().includes(fEvent.name.toLowerCase()) || 
              fEvent.name.toLowerCase().includes(item.title.toLowerCase())
    );
    if (!exists) {
      combinedRegistry.push({
        title: fEvent.name,
        year: fEvent.ethDate,
        category: fEvent.category + " Festival",
        description: fEvent.description,
        location: fEvent.location,
        narratives: {
          guide: `${fEvent.name} (celebrated on <b>${fEvent.ethDate}</b> in ${fEvent.location}) is a beautiful event. ${fEvent.description}`,
          storyteller: `Behold the joy and the lights of <b>${fEvent.name}</b>! On the sacred day of <b>${fEvent.ethDate}</b>, the streets of <b>${fEvent.location}</b> flow with music, color, and laughter as our ancestors did. ${fEvent.description}`,
          teacher: `Class, <b>${fEvent.name}</b> is an important holiday celebrated on <b>${fEvent.ethDate}</b> (Gregorian date: <b>${fEvent.gregDate}</b>) in <b>${fEvent.location}</b>. It is classified under the <b>${fEvent.category}</b> category. ${fEvent.description}`,
          festival: `A magnificent celebration awaits at <b>${fEvent.name}</b>! On <b>${fEvent.ethDate}</b>, families gather in <b>${fEvent.location}</b> for traditional feasts, beautiful chants, and pure communal warmth. ${fEvent.description}`,
          myth: `The sacred stories of <b>${fEvent.name}</b> tell of ancient blessings showered upon the land on <b>${fEvent.ethDate}</b>, when the heavens open to hear the prayers of our community gathered in <b>${fEvent.location}</b>.`
        }
      });
    }
  }

  // 3. Perform a fuzzy search score match across the combined registry
  let bestMatch: OfflineItem | null = null;
  let highestScore = 0;

  for (const item of combinedRegistry) {
    let score = 0;
    const titleLower = item.title.toLowerCase();
    const descLower = item.description.toLowerCase();
    const catLower = item.category.toLowerCase();
    
    // Check key figures
    const figuresText = item.keyFigures ? item.keyFigures.join(" ").toLowerCase() : "";
    const locationText = item.location ? item.location.toLowerCase() : "";

    // Search keywords split
    const searchTerms = query.split(/\s+/);
    for (const term of searchTerms) {
      if (term.length < 3) continue; // skip tiny words
      
      if (titleLower.includes(term)) score += 10;
      if (descLower.includes(term)) score += 4;
      if (catLower.includes(term)) score += 3;
      if (figuresText.includes(term)) score += 5;
      if (locationText.includes(term)) score += 3;
      if (item.year && item.year.toLowerCase().includes(term)) score += 5;
    }

    // Direct match bonuses
    if (query.includes(titleLower) || titleLower.includes(query)) score += 25;

    if (score > highestScore) {
      highestScore = score;
      bestMatch = item;
    }
  }

  // 4. Return the best match if score is significant
  if (bestMatch && highestScore > 4) {
    const matchedNarrative = selectModeResponse(bestMatch.narratives);
    let output = `<b>[OFFLINE VAULT: ${bestMatch.title.toUpperCase()}]</b>\n`;
    
    if (bestMatch.year) {
      output += `📅 <b>Era/Date:</b> ${bestMatch.year}\n`;
    }
    output += `🏛️ <b>Category:</b> ${bestMatch.category}\n`;
    if (bestMatch.location) {
      output += `📍 <b>Location:</b> ${bestMatch.location}\n`;
    }
    if (bestMatch.keyFigures && bestMatch.keyFigures.length > 0) {
      output += `👤 <b>Key Figures:</b> ${bestMatch.keyFigures.join(", ")}\n`;
    }
    
    output += `\n${matchedNarrative}\n`;

    if (bestMatch.milestones && bestMatch.milestones.length > 0) {
      output += `\n📜 <b>Key Milestones:</b>\n`;
      for (const m of bestMatch.milestones) {
        output += `* ${m}\n`;
      }
    }

    return output;
  }

  // 5. Fallback: Detailed beautiful offline directory using ONLY bold tags (no asterisks)
  return `As your Ethiopian Heritage Guide, I am currently operating in <b>Offline Intelligence Mode</b> due to high global query volume. While my live connection is recharging, I have full offline access to our historical archives!

I detected your query: "<b>${message}</b>". Although I cannot access live neural systems right now, I can explain any of our rich cultural treasures in detail. 

Ask me about any of these fascinating subjects:
* 🏛️ <b>Battle of Adwa (1896)</b> — The iconic victory of African independence.
* 🧱 <b>Lalibela Rock-Hewn Churches</b> — Architectural wonders carved from solid rock.
* 🏺 <b>Kingdom of Axum</b> — The ancient powerhouse of trade, obelisks, and the Ark.
* 🦅 <b>Lucy (Dinknesh)</b> — The 3.2-million-year-old cradle of humanity in Afar.
* ⚖️ <b>Gadaa System & Irreechaa</b> — The ancient democratic system of the Oromo.
* ☕ <b>Buna (Coffee) Ceremony</b> — The spiritual and social heritage of Arabica.
* 📜 <b>Ge'ez Script & 13-Month Calendar</b> — Our unique writing system and solar calendar.
* 🍲 <b>Injera & Doro Wat</b> — The communal and scientific culinary arts of Ethiopia.
* 🏰 <b>Founding of Gondar</b> — The Camelot of Africa and Emperor Fasilides castles.
* 🦁 <b>Emperor Tewodros II</b> — The visionary unifier and modernizer at Maqdala.

<i>Just type one of these topics (e.g., "Tell me about Adwa" or "How does the calendar work?") to unlock the offline archive!</i>`;
}

export async function chatWithHeritageGuide(
  history: ChatMessage[],
  message: string,
  mode: 'guide' | 'storyteller' | 'teacher' | 'festival' | 'myth' = 'guide'
): Promise<string> {
  // Try OpenAI first
  const openaiResult = await chatWithOpenAI(history, message, mode);
  if (openaiResult) return openaiResult;

  // Fallback to Gemini
  const geminiResult = await chatWithGemini(history, message, mode);
  if (geminiResult) return geminiResult;

  // Rich Offline Local Knowledge Base Fallback
  console.log("🟠 Both API gateways rate-limited. Activating Local Offline Heritage Knowledge Vault.");
  return getOfflineHeritageResponse(message, mode);
}

/* ================================
   TRANSLATION HELPER
================================ */
export async function translateText(
  text: string,
  targetLang: 'en' | 'am' | 'om'
): Promise<string> {
  if (targetLang === 'en') return text;
  
  const langName = targetLang === 'am' ? 'Amharic' : 'Afaan Oromo';
  try {
    const result = await fetchWithRetry(
      `${BASE_URL}/${TEXT_MODEL}:generateContent?key=${getApiKey()}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Translate this text accurately into ${langName}. Do not add any introduction, explanations, or metadata. Output ONLY the translated text:\n\n${text}`
                }
              ]
            }
          ]
        })
      }
    );

    return result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || text;
  } catch (err) {
    console.error("Translation error:", err);
    return text;
  }
}