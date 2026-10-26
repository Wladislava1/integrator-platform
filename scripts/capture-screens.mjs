import { chromium } from "playwright";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "docs", "screenshots");
const base = "http://127.0.0.1:3000";
const email = `demo_${Date.now()}@example.com`;
const password = "DemoPass1";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

await page.goto(`${base}/login`);
await page.waitForTimeout(500);
await page.screenshot({ path: path.join(outDir, "01-login.png"), fullPage: true });

await page.goto(`${base}/register`);
await page.waitForTimeout(500);
await page.screenshot({ path: path.join(outDir, "02-register.png"), fullPage: true });

await page.fill('input[type="text"]', "Владислава Демо");
await page.fill('input[type="email"]', email);
const passwords = page.locator('input[type="password"]');
await passwords.nth(0).fill(password);
await passwords.nth(1).fill(password);
await page.click('button[type="submit"]');
await page.waitForURL("**/catalog");
await page.waitForTimeout(700);
await page.screenshot({ path: path.join(outDir, "03-catalog.png"), fullPage: true });

await page.goto(`${base}/profile`);
await page.waitForTimeout(500);
await page.screenshot({ path: path.join(outDir, "04-profile.png"), fullPage: true });

await page.goto(`${base}/settings`);
await page.waitForTimeout(500);
await page.screenshot({ path: path.join(outDir, "05-settings.png"), fullPage: true });

await browser.close();
console.log("Screenshots saved to docs/screenshots");
