// Run with the local HTTP server on port 8000 and Playwright available.
const {chromium} = require('playwright');
const assert = require('node:assert/strict');
const siteUrl = process.env.SITE_URL || 'http://127.0.0.1:8000';
(async () => {
  const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox']});
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    let mode = 'valid', price = 222.22;
    await page.route('**/*', async route => {
      const url = route.request().url();
      if (url.startsWith(siteUrl + '/')) return route.continue();
      if (url === 'https://skup-zlota-gorzow.angsm111.workers.dev/api/prices') {
        assert.equal(route.request().headers().cookie, undefined);
        if (mode === 'error') return route.abort();
        return route.fulfill({status:200, contentType:'application/json', headers:{'access-control-allow-origin':'*'}, body:JSON.stringify({
          status:'ok', provider:mode === 'fallback' ? 'Dane zapasowe' : 'Test fixture',
          fetchedAt:new Date(Date.now() - (mode === 'stale' ? 3600000 : 0)).toISOString(),
          metals:{gold:{spot:400,purities:{585:{price},750:{price:267},999:{price:0}}}}
        })});
      }
      return route.abort();
    });
    await page.goto(siteUrl + '/skup-zlota.html');
    await page.waitForFunction(() => document.querySelector('#gold-price').value === '222.22');
    assert.equal(await page.locator('#gold-price').getAttribute('readonly'), '');
    assert.match(await page.locator('#gold-spot-price').innerText(), /400,00/);
    assert.equal(await page.evaluate(() => {
      const sections = [...document.querySelector('main').children];
      return sections[1].id === 'kalkulator' && !!sections[2].querySelector('a[href="cennik.html"]');
    }), true);
    assert.equal(await page.locator('#buy-price-grid button').count(),2);
    await page.click('#buy-price-grid button[data-purity="750"]');
    assert.equal(await page.inputValue('#gold-purity'),'750');
    assert.equal(await page.locator('#buy-price-grid button[data-purity="750"]').getAttribute('aria-pressed'),'true');
    await page.click('#buy-price-grid button[data-purity="585"]');
    await page.fill('#gold-weight','10');
    assert.match(await page.locator('#calc-amount').innerText(), /2\s?222,20/);
    assert.equal(await page.locator('#gold-purity option[value="999"]').count(),0);
    await page.selectOption('#gold-purity','750');
    assert.equal(await page.inputValue('#gold-price'),'267.00');
    assert.match(await page.locator('#calc-amount').innerText(), /2\s?670,00/);
    await page.selectOption('#gold-purity','585');
    price=230;
    await page.click('#price-refresh');
    await page.waitForFunction(() => document.querySelector('#gold-price').value === '230.00');
    assert.match(await page.locator('#calc-amount').innerText(), /2\s?300,00/);
    for (const failure of ['error','stale','fallback']) {
      mode=failure;
      await page.click('#price-refresh');
      await page.waitForFunction(() => document.querySelector('#calc-amount').textContent === '—' && !document.querySelector('#price-refresh').disabled);
      assert.equal(await page.locator('#buy-price-grid button').count(),0);
      assert.equal(await page.inputValue('#gold-price'),'');
      assert.equal(await page.locator('#gold-spot-price').innerText(),'—');
      assert.equal(await page.locator('#gold-purity').isDisabled(),true);
      mode='valid';
      await page.click('#price-refresh');
      await page.waitForFunction(() => document.querySelector('#gold-price').value === '230.00');
    }
    await page.fill('#gold-weight','-1');
    assert.equal(await page.locator('#calc-amount').innerText(),'—');
    assert.deepEqual(errors,[]);
    console.log('PASS API prices, automatic/manual feed values, purity switch, refresh, zero-price exclusion, failure/stale/fallback rejection, recovery and invalid weight');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
