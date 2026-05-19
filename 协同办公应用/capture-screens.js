const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const outDir = '/Users/xuyangfan/Documents/ai比赛/视频素材/screens';
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 2 });

  await page.goto('http://localhost:3001/', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(outDir, '01-home.png'), fullPage: true });

  const clickByText = async (text) => {
    const target = page.getByText(text, { exact: true }).first();
    await target.waitFor({ state: 'visible', timeout: 10000 });
    await target.click();
    await page.waitForTimeout(1200);
  };

  await clickByText('会议');
  await page.screenshot({ path: path.join(outDir, '02-meeting.png'), fullPage: true });

  await clickByText('审批');
  await page.screenshot({ path: path.join(outDir, '03-approval.png'), fullPage: true });

  await clickByText('文档');
  await page.screenshot({ path: path.join(outDir, '04-document.png'), fullPage: true });

  await clickByText('打卡');
  await page.screenshot({ path: path.join(outDir, '05-attendance.png'), fullPage: true });

  await clickByText('首页');
  await page.screenshot({ path: path.join(outDir, '06-home-end.png'), fullPage: true });

  await browser.close();
})();
