const {chromium} = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const siteUrl = process.env.SITE_URL || 'http://127.0.0.1:8000';
(async () => {
  const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox']});
  try {
    const page = await browser.newPage({viewport:{width:390,height:844}});
    await page.route('**/*', route => route.request().url().startsWith(siteUrl + '/') ? route.continue() : route.abort());
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    for(const file of fs.readdirSync('.').filter(f=>f.endsWith('.html'))) {
      await page.goto(siteUrl+'/'+file);
      const toggle=page.locator('.menu-toggle'),nav=page.locator('#site-navigation');
      assert.equal(await toggle.isVisible(),true,file);
      assert.equal(await nav.isVisible(),false,file);
      assert.equal(await toggle.getAttribute('aria-expanded'),'false');
      await toggle.click();
      assert.equal(await nav.isVisible(),true);
      assert.equal(await toggle.getAttribute('aria-expanded'),'true');
      await page.keyboard.press('Escape');
      assert.equal(await nav.isVisible(),false);
      assert.equal(await toggle.evaluate(e=>e===document.activeElement),true);
    }
    for(const width of [320,390,768,1024]) {
      await page.setViewportSize({width,height:900});
      await page.locator('.menu-toggle').click();
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
      await page.locator('main h1').click();
      assert.equal(await page.locator('#site-navigation').isVisible(),false);
    }
    await page.setViewportSize({width:390,height:844});
    await page.locator('.menu-toggle').click();
    await page.locator('#site-navigation a[href="cennik.html"]').click();
    await page.waitForURL('**/cennik.html');
    assert.equal(await page.locator('#site-navigation').isVisible(),false);
    await page.setViewportSize({width:1440,height:1000});
    assert.equal(await page.locator('.menu-toggle').isVisible(),false);
    assert.equal(await page.locator('#site-navigation').isVisible(),true);
    assert.deepEqual(errors,[]);
    const noJs=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}});
    await noJs.route('**/*',route=>route.request().url().startsWith(siteUrl+'/')?route.continue():route.abort());
    await noJs.goto(siteUrl+'/index.html');
    assert.equal(await noJs.locator('#site-navigation').isVisible(),true);
    console.log('PASS mobile menu on all pages, toggle/Escape/focus/outside click, navigation, desktop, no-JS fallback, widths 320–1440');
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
