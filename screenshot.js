import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  const assetsDir = path.join(__dirname, 'assets');
  if (!fs.existsSync(assetsDir)){
      fs.mkdirSync(assetsDir);
  }

  console.log("Launching browser...");
  const browser = await puppeteer.launch({ 
    headless: false, 
    defaultViewport: null,
    args: ['--start-maximized']
  });
  const page = await browser.newPage();
  
  // Wait for fonts to load
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('mock_user', 'true');
    localStorage.setItem('ethio_active_tab', 'home');
  });

  console.log("Navigating to app...");
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 4000)); // wait for initial load and animations
  
  const takeShot = async (name, tabName) => {
    console.log(`Navigating to ${tabName}...`);
    await page.evaluate((tab) => {
      // Find the button with this text or icon
      const btns = Array.from(document.querySelectorAll('button'));
      let target = btns.find(b => b.textContent.includes(tab) || b.getAttribute('title') === tab);
      if(target) target.click();
    }, tabName);
    
    // Give enough time for animations and map tiles to render
    await new Promise(r => setTimeout(r, 4000));
    console.log(`Capturing ${name}...`);
    await page.screenshot({ path: path.join(assetsDir, name) });
  };

  await takeShot('screenshot1.png', 'Vault');
  await takeShot('screenshot2.png', 'Atlas');
  await takeShot('screenshot3.png', 'Guide');
  await takeShot('screenshot4.png', 'Zone');
  await takeShot('screenshot6.png', 'Profile');

  // Auth Interface
  console.log("Navigating to Auth...");
  await page.evaluate(() => {
    localStorage.removeItem('mock_user');
  });
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 3000));
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const login = btns.find(b => b.textContent.includes('Login'));
    if(login) login.click();
  });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(assetsDir, 'screenshot5.png') });

  await browser.close();
  console.log("Done!");
})();
