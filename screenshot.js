import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  const assetsDir = path.join(__dirname, 'assets');
  if (!fs.existsSync(assetsDir)){
      fs.mkdirSync(assetsDir);
  }

  console.log("Launching realistic browser session...");
  const browser = await puppeteer.launch({ 
    headless: false, 
    slowMo: 50, // Slow down to act like a real human
    defaultViewport: null,
    args: ['--start-maximized']
  });
  const page = await browser.newPage();
  
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('mock_user', 'true');
    localStorage.setItem('ethio_active_tab', 'home');
  });

  console.log("Navigating to portal...");
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle0' });
  await delay(3000); // Let user see the home page
  
  const clickTabAndCapture = async (tabName, filename) => {
    console.log(`Human navigating to ${tabName}...`);
    await page.evaluate((tab) => {
      const btns = Array.from(document.querySelectorAll('button'));
      let target = btns.find(b => b.textContent.includes(tab) || b.getAttribute('title') === tab);
      if(target) target.click();
    }, tabName);
    
    // Look at the page for a few seconds like a human
    await delay(3000);
    console.log(`Snapping ${filename}...`);
    await page.screenshot({ path: path.join(assetsDir, filename) });
  };

  await clickTabAndCapture('Vault', 'screenshot1.png');
  await clickTabAndCapture('Atlas', 'screenshot2.png');
  await delay(2000); // map takes extra time
  await clickTabAndCapture('Guide', 'screenshot3.png');
  await clickTabAndCapture('Zone', 'screenshot4.png');
  await clickTabAndCapture('Profile', 'screenshot6.png');

  // Auth Interface
  console.log("Logging out to see Auth...");
  await page.evaluate(() => {
    localStorage.removeItem('mock_user');
  });
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle0' });
  await delay(2000);
  
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const login = btns.find(b => b.textContent.includes('Login'));
    if(login) login.click();
  });
  await delay(2000);
  await page.screenshot({ path: path.join(assetsDir, 'screenshot5.png') });

  await delay(2000);
  await browser.close();
  console.log("Human-like session complete!");
})();
