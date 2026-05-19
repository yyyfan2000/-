const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const outDir = '/Users/xuyangfan/Documents/ai比赛/视频素材/screens';
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });

  const titlePage = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await titlePage.setContent(`
    <html><body style="margin:0;background:linear-gradient(180deg,#0f172a,#111827,#0f766e);font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Arial,sans-serif;color:white;display:flex;align-items:center;justify-content:center;height:100vh;">
      <div style="padding:120px 90px;text-align:center;">
        <div style="font-size:48px;letter-spacing:6px;opacity:.85;margin-bottom:40px;">AI PRODUCT INTRODUCTION</div>
        <div style="font-size:96px;font-weight:800;line-height:1.15;margin-bottom:48px;">协同办公应用</div>
        <div style="font-size:42px;line-height:1.8;opacity:.95;">少点几步 · 少等几次 · 少切几个系统</div>
      </div>
    </body></html>
  `);
  await titlePage.screenshot({ path: path.join(outDir, '00-title.png') });

  const endPage = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await endPage.setContent(`
    <html><body style="margin:0;background:linear-gradient(180deg,#0f766e,#0f172a);font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Arial,sans-serif;color:white;display:flex;align-items:center;justify-content:center;height:100vh;">
      <div style="padding:120px 90px;text-align:center;">
        <div style="font-size:88px;font-weight:800;line-height:1.2;margin-bottom:48px;">协同办公应用</div>
        <div style="font-size:44px;line-height:1.8;opacity:.95;">让高频协同动作打开即用</div>
      </div>
    </body></html>
  `);
  await endPage.screenshot({ path: path.join(outDir, '07-end.png') });

  await browser.close();
})();
