import { ChatMessage } from "../types";

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
   OFFLINE HERITAGE SEARCH ENGINE
================================ */
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

  // 1. GREETINGS
  if (query.match(/\b(hi|hello|hey|greetings|hola|who are you|howdy)\b/)) {
    return selectModeResponse({
      guide: "Greetings, fellow explorer! I am your interactive Ethiopian Heritage Guide. Although I am currently operating on offline backup intelligence, I have complete access to the vault of Ethiopian history. What ancient empire or tradition shall we explore today?",
      storyteller: "Welcome, traveler! Draw close to the warm digital embers. I am the storyteller. Though my connection to the ether is currently asleep, my chest of tales is bursting with epic sagas of warriors, kings, and ancient wonders. Ask, and the chronicle shall unfold!",
      teacher: "Hello, seeker of knowledge! I am your cultural teacher. I am currently running on local backup storage, but we have everything we need to learn. Ask me about Ge'ez writing, the 13-month calendar, the democratic Gadaa system, or our vibrant festivals!",
      festival: "A spectacular welcome! I am your festival explainer. While my servers are taking a brief breath, I am fully ready to describe the dancing, the music, and the sacred dates of Timkat, Meskel, or Enkutatash. Ask away!",
      myth: "Greetings, brave soul. You have stepped into the realm of ancient mysteries and folklore. My live cosmic connection is resting, but the ancient legends of the Ark, the Queen of Sheba, and the angels of Lalibela never fade. Speak, and I shall unveil the mysteries."
    });
  }

  // 2. BATTLE OF ADWA
  if (query.includes("adwa") || query.includes("battle") || query.includes("menelik") || query.includes("taytu")) {
    return selectModeResponse({
      guide: "The Battle of Adwa in March 1896 stands as one of the most significant military victories in world history. Led by the brilliant Emperor Menelik II and the strategically fierce Empress Taytu Betul, Ethiopian forces decisively crushed the invading Italian colonial army. This victory preserved Ethiopia's sovereignty, completely shattered the myth of European military invincibility, and turned Ethiopia into a global beacon of black sovereignty and anti-colonial resistance.",
      storyteller: "Hark! The horns of Emperor Menelik II echo through the valleys of Tigray! It was March 1, 1896, when the Italian forces marched into the mountainous traps of Adwa. With unmatched tactical brilliance, Empress Taytu Betul ordered the securing of vital water sources, while over 100,000 unified Ethiopian patriots charged from the heights. Before the sun set, the invading armies lay completely routed. Ethiopia remained free, its green, yellow, and red flag flying high as a sacred symbol of eternal freedom!",
      teacher: "Class, the Battle of Adwa is a prime example of military planning and national unity. Emperor Menelik II utilized diplomatic delays to stockpile modern firearms, while Empress Taytu led her own regiment and managed intelligence. By uniting disparate regional leaders under a single cause, Ethiopia succeeded in defeating a major European power in 1896, keeping its borders uncolonized. Let us note that this battle is celebrated every year on Yekatit 23.",
      festival: "Adwa Victory Day on March 2 (Yekatit 23) is one of the most energetic and patriotic celebrations in Ethiopia! Across Addis Ababa and the historic hills of Adwa, citizens dress in beautiful white traditional clothing, veterans wear lion-mane headdresses, and military bands parade through the streets. The air is filled with triumphant songs, historical poetry, and absolute national pride!",
      myth: "Legend tells us that during the fateful battle of Adwa, St. George himself was seen riding on a white horse in the skies, guiding the Ethiopian warriors through the dense smoke of combat. Empress Taytu's tactical genius was said to be guided by ancestral visions, ensuring that the ancient land of the Queen of Sheba would never fall to foreign conquerors."
    });
  }

  // 3. LALIBELA
  if (query.includes("lalibela") || query.includes("church") || query.includes("rock")) {
    return selectModeResponse({
      guide: "The Rock-Hewn Churches of Lalibela in the Amhara region are absolute masterpieces of medieval engineering. Built in the 12th century under King Gebre Mesqel Lalibela of the Zagwe dynasty, these 11 monolithic churches were not constructed from the ground up. Instead, they were carved straight down into solid red volcanic tuff rock. They are fully functional structures complete with columns, arches, windows, and drainage systems, connected by a labyrinth of underground tunnels.",
      storyteller: "In the medieval highlands of Roha, King Lalibela looked upon the earth and envisioned a New Jerusalem carved from the very bones of the world. With heavy iron chisels, stonemasons cut deep into the solid volcanic earth. It is whispered that as the mortal workers rested under the cover of night, angels descended from the heavens to double the speed of the carving. The peak of this magic is Bete Giyorgis (Church of St. George), a pristine cross-shaped monolith standing proudly in its deep trench.",
      teacher: "Let us study the architecture of Lalibela. The 11 churches are split into three groups: the Northern, Eastern, and Western groups. They represent a pinnacle of rock-cut architecture. Because they are carved from a single piece of volcanic rock, any error would have been catastrophic—there was no way to add material back once carved. This required absolute mastery of geometry, stone carving, and hydraulic engineering.",
      festival: "Lalibela becomes a glorious ocean of white during Genna (Ethiopian Christmas) on January 7! Tens of thousands of white-robed Orthodox pilgrims gather around the deep trenches of the monolithic churches. The priests stand on the sheer cliff edges, chanting ancient liturgical songs accompanied by the deep rhythmic beat of the Kebero drums, transporting you back to the 12th century.",
      myth: "The legend of Lalibela says King Lalibela was poisoned by his brother, and during a three-day mystical sleep, he was transported to heaven where God commanded him to carve a New Jerusalem out of stone. Angels actively worked alongside the stonemasons, and King Lalibela's hands were said to be blessed with an unnatural strength that made hard volcanic rock feel like soft wax."
    });
  }

  // 4. AXUM / OBELISK / EZANA
  if (query.includes("axum") || query.includes("obelisk") || query.includes("stelae") || query.includes("ezana") || query.includes("aksum")) {
    return selectModeResponse({
      guide: "The Axumite Empire was one of the four global superpowers of the ancient world, alongside Rome, Persia, and China. Flourishing from the 1st to the 7th centuries AD, Axum controlled crucial trade routes between Rome, India, and Africa from its port of Adulis on the Red Sea. Axum is renowned for erecting massive monolithic stelae (obelisks) carved from single blocks of granite, some weighing over 500 tons, representing the graves of their royal rulers.",
      storyteller: "Long ago, the powerful kings of Axum ruled the seas and the highlands. They minted their own coins of pure gold, declaring their sovereignty to empires far and wide. Their crowning monuments were the colossal granite stelae—carved to look like multi-story skyscrapers, reaching upward to touch the heavens. Though the largest 500-ton stela collapsed during construction, the remaining obelisks stand as silent, towering witnesses of an empire that once commanded the horn of Africa.",
      teacher: "Historically, the conversion of King Ezana to Christianity around 330 AD by the Syrian scholar Frumentius (Abba Selama) was the turning point for Axum. It became one of the first empires in the world to adopt Christianity as its state religion. This is also where the Ge'ez script flourished, which we still use today. You can see this transition clearly on Axumite coins, where the pagan crescent moon symbol was replaced by the Christian cross.",
      festival: "In Axum, the festival of Tsion Mariam (St. Mary of Zion) on November 30 (Hidar 21) is a profound spiritual gathering. Thousands of white-clad Orthodox believers from across the nation converge on the historic cathedral, bringing colorful umbrellas, sacred chants, and rhythmic dances to honor the church that guards their most sacred relics.",
      myth: "According to deep Ethiopian tradition, Axum is the home of the legendary Queen of Sheba (Queen Makeda) and the final resting place of the Ark of the Covenant. It is said that Menelik I, the son of King Solomon and the Queen of Sheba, brought the Ark to Axum, where it has been guarded in absolute secrecy by a succession of consecrated monks who never leave its chapel."
    });
  }

  // 5. LUCY / DINKNESH
  if (query.includes("lucy") || query.includes("dinknesh") || query.includes("homin") || query.includes("afar") || query.includes("cradle")) {
    return selectModeResponse({
      guide: "Lucy, known locally in Ethiopia as 'Dinknesh' (meaning 'you are marvelous' in Amharic), is a 3.2-million-year-old hominin fossil discovered in the Hadar region of the Afar Depression in 1974. Belonging to the species Australopithecus afarensis, she is one of the most complete hominin skeletons ever found, providing the definitive proof that bipedalism (walking upright on two legs) evolved before large brains in human ancestors, making Ethiopia the cradle of humanity.",
      storyteller: "Deep in the sun-baked, ancient soil of the Afar desert, a marvelous treasure lay sleeping for three million years. In 1974, she was brought back into the light of the modern world. They named her Dinknesh—'You are marvelous.' She was small of stature, but she walked upright on two feet, just as we do today. She is the mother of us all, an ancient ancestor who walked the lush plains of Ethiopia when the world was young.",
      teacher: "Dinknesh represents a crucial link in human evolutionary biology. Discovered by Donald Johanson, her skeleton is roughly 40% complete. The pelvic and leg structure clearly show that she walked upright, which was a revolutionary discovery because it overturned the scientific consensus that brain size grew before bipedalism. Ethiopia has since yielded many other ancient hominin fossils, cementing its status as the cradle of human evolution.",
      festival: "While not a traditional religious festival, Dinknesh is celebrated with immense pride in Ethiopia's National Museum in Addis Ababa, where her replica is displayed. International students, tourists, and locals gather to view the cradle of humanity, celebrating the scientific heritage that unites all humans back to the fertile soil of Ethiopia.",
      myth: "Dinknesh is a symbol of our shared human ancestry. The local Afar people speak of the desert sands preserving the bones of the first humans as a sacred duty, guarding the maternal spark of humanity for millions of years until the world was mature enough to understand its own origin."
    });
  }

  // 6. GADAA SYSTEM
  if (query.includes("gadaa") || query.includes("oromo") || query.includes("egalitarian") || query.includes("governance")) {
    return selectModeResponse({
      guide: "The Gadaa System is an ancient, highly structured democratic system of social, political, and economic governance developed by the Oromo people of Ethiopia. Formalized around the 13th century (though practiced much earlier), the system organizes society into active classes (Luba) that rotate power every eight years. It regulates conflict resolution, environmental protection, land distribution, and human rights, recognized by UNESCO as an intangible cultural heritage.",
      storyteller: "Under the shade of the sacred Oda tree, the Oromo elders gather in peaceful assembly. This is the Gadaa, where power does not belong to a king, but flows democratically through the community. Every eight years, with solemn oaths and handovers of the Bokkuu (scepter), a new Luba class takes the responsibility of leading the people in peace, justice, and absolute harmony.",
      teacher: "Let us analyze the structure of the Gadaa system. It is a highly complex social calendar split into five distinct age-grades. Each grade goes through rigorous training in defense, law, diplomacy, and governance before a cohort can assume leadership. The Abbaa Gadaa acts as the president, but he governs alongside a council (Chaffee), ensuring checks and balances that prevent tyranny. It is an amazing example of indigenous African democracy.",
      festival: "The festival of Irreechaa is the majestic celebration of thanksgiving associated with the Oromo and the Gadaa calendar. Celebrated at the end of the rainy season in September, millions of Oromo people dress in stunning white cultural clothes and gather near sacred lakes and rivers, holding fresh green grass to thank Waaqayyo (God) for life, harvest, and peace.",
      myth: "The Gadaa system is said to be as balanced as the cycles of nature itself. The Oda tree under which the Gadaa councils meet is believed to represent the cosmic tree of life, whose leaves shade the righteous and whose deep roots bind the community to the laws of truth (Dugoomsa) and cosmic balance."
    });
  }

  // 7. COFFEE / BUNA
  if (query.includes("coffee") || query.includes("buna") || query.includes("ceremony") || query.includes("abol")) {
    return selectModeResponse({
      guide: "Ethiopia is the birthplace of Arabica coffee, which originated in the wild forests of the Kaffa region. The traditional Ethiopian Coffee Ceremony (Buna Ceremony) is a highly respected social and cultural ritual. It involves roasting green coffee beans over hot coals, grinding them manually in a mortar, and brewing the coffee three times in a black clay pot called a Jebena, symbolizing friendship, respect, and community.",
      storyteller: "Close your eyes and breathe in the rich, heavy aroma of roasting coffee beans, blending with the sweet scent of burning frankincense. The ceremony is a sacred dance of hospitality. The host roasts the green beans until they shine black with oils, presenting the smoking pan to each guest. From the tall neck of the dark clay Jebena, a rich dark nectar is poured, bringing warmth, conversation, and blessings to all who sit together.",
      teacher: "The Buna ceremony has a strict three-round structure that you must remember. The first round is called 'Abol' (the strongest, poured for guests to enjoy). The second round is 'Tona' (brewed with fresh water added to the grinds, lighter). The third round is 'Baraka' (the blessing round, representing peace and safety). Poured from a height into small cups called Cini, the ceremony is the cornerstone of Ethiopian social life.",
      festival: "Every day is a coffee festival in an Ethiopian household! But during holidays like Timkat or Genna, the Buna ceremony is elevated. Paved with fresh cut green grass on the floor, the coffee area is adorned with yellow flowers, and the host serves popcorn, roasted barley (Kolo), and traditional bread alongside the three sacred cups of Buna.",
      myth: "The discovery of coffee is told through the popular legend of Kaldi, a young Abyssinian goatherd who lived around the 9th century. Kaldi noticed his goats dancing energetically after eating small red berries from a wild shrub. Intrigued, he took the berries to a local monk, who threw them into a fire in disgust. The roasted beans released an aroma so heavenly that the monks quickly raked them from the coals, crushed them in hot water, and created the first cup of coffee to keep them awake during nightly prayers."
    });
  }

  // 8. ETHIOPIAN CALENDAR / TIME
  if (query.includes("calendar") || query.includes("13") || query.includes("month") || query.includes("pagume") || query.includes("time") || query.includes("hour")) {
    return selectModeResponse({
      guide: "The Ethiopian Calendar is a unique solar calendar that is roughly seven to eight years behind the Gregorian calendar. It consists of 13 months: 12 months of exactly 30 days each, and a 13th month called 'Pagumē' which has 5 days (or 6 days in a leap year). The calendar is aligned with the ancient Julian calendar, celebrating the New Year (Enkutatash) on September 11 or 12.",
      storyteller: "Welcome to a land where time flows differently! In Ethiopia, we are seven years younger, and our year has thirteen months of sunshine. The final month, Pagumē, is a magical bridge of five days where time stands still before the New Year dawns. Even our day begins not at midnight, but at the rising of the sun. When the sun shows its face at dawn, our clock strikes one.",
      teacher: "Let's learn how Ethiopian time works. The day is divided into two 12-hour cycles starting at dawn. What we call 7:00 AM in the West is 1:00 (Kese'at) in Ethiopian time, because it is the first hour after sunrise. Additionally, our calendar is based on the calculation of the Annunciation of Jesus, which differs from the Roman calculations, placing us 7 years and 8 months behind the Gregorian standard.",
      festival: "Enkutatash (the Ethiopian New Year) on September 11 is the ultimate calendar festival! The heavy summer rains end, the skies clear, and the highland meadows explode in a carpet of bright yellow daisies called Meskel flowers. Children sing traditional songs like 'Abebayehosh' door-to-door, and families feast on Doro Wat, celebrating the transition to the new year.",
      myth: "Pagumē, the short 13th month, is treated in folklore as a sacred, mystical time. Because it belongs to no standard month, it is believed that the waters of all rivers are blessed with holy purification during these five days. Many traditional people will bathe in the rivers at dawn during Pagumē to wash away the trials of the past year and enter the new year spiritually clean."
    });
  }

  // 9. TRADITIONAL FOOD / INJERA / CULINARY
  if (query.includes("food") || query.includes("injera") || query.includes("wat") || query.includes("doro") || query.includes("teff")) {
    return selectModeResponse({
      guide: "Ethiopian cuisine is highly distinctive, healthy, and communal, centered around Injera—a large, spongy, sourdough flatbread made from fermented teff grain (an ancient superfood rich in iron and gluten-free). Various spicy stews, known as Wat (such as Doro Wat chicken stew, or Misir Wat lentil stew), are served directly on top of the Injera. Diners eat communally using their right hands to tear off pieces of Injera to scoop up the stews.",
      storyteller: "Gather close around the colorful woven Mesob table. To eat in Ethiopia is to share a covenant of friendship. A large platter of Injera is spread out, topped with colorful mounds of rich, spicy red Doro Wat, simmered with berbere spices and boiled eggs. You tear a soft piece of Injera, scoop the savory sauce, and place it in the mouth of your companion. This is Gursha—an act of pure love and hospitality.",
      teacher: "Let's study the fermentation chemistry of Injera. The tiny teff seeds are ground into flour and mixed with water to ferment for three to four days, creating a natural yeast starter called Ersho. This fermentation gives Injera its unique sour taste and spongy texture with tiny holes called 'eyes' (Ayn). Eating is done strictly with the right hand. The most famous dish, Doro Wat, takes hours to prepare, slow-cooking onions until they form a deep, caramelized base.",
      festival: "During major religious holidays like Fasika (Easter) or Genna, the end of long fasting periods (where Orthodox Christians eat strictly vegan diets for 55 or 40 days) is marked by a massive culinary explosion. At midnight, families break the fast with freshly slaughtered sheep or chicken, preparing delicious raw meat (Kifto), Doro Wat, and home-brewed honey wine called Tej.",
      myth: "Teff is believed to have been cultivated in the Ethiopian highlands for over 6,000 years. Legend says that the ancient giants who built the stelae of Axum survived on a diet of teff and honey, giving them the strength to lift single blocks of granite that weighed hundreds of tons from quarries miles away."
    });
  }

  // 10. DEFAULTS & CATEGORIZED GUIDANCE IF KEYWORD NOT FOUND
  return `As your Ethiopian Heritage Guide, I am currently operating in **Offline Intelligence Mode** due to high global query volume. While my live connection is recharging, I have full offline access to our historical archives!

I detected your query: "${message}". Although I cannot access live neural systems right now, I can explain any of our rich cultural treasures in detail. 

Ask me about any of these fascinating subjects:
* 🏛️ **Battle of Adwa (1896)** — The iconic victory of African independence.
* 🧱 **Lalibela Rock-Hewn Churches** — Architectural wonders carved from solid rock.
* 🏺 **Kingdom of Axum** — The ancient powerhouse of trade, obelisks, and the Ark.
* 🦅 **Lucy (Dinknesh)** — The 3.2-million-year-old cradle of humanity in Afar.
* ⚖️ **Gadaa System & Irreechaa** — The ancient democratic system of the Oromo.
* ☕ **Buna (Coffee) Ceremony** — The spiritual and social heritage of Arabica.
* 📜 **Ge'ez Script & 13-Month Calendar** — Our unique writing system and solar calendar.
* 🍲 **Injera & Doro Wat** — The communal and scientific culinary arts of Ethiopia.

*Just type one of these topics (e.g., "Tell me about Adwa" or "How does the calendar work?") to unlock the offline archive!*`;
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