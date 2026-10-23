// Run with the local HTTP server on port 8000 and Playwright available.
const {chromium} = require('playwright');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox']});
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    let mode = 'valid', price = 222.22;
    await page.route('**/*', async route => {
      const url = route.request().url();
      if (url.startsWith('http://127.0.0.1:8000/')) return route.continue();
      if (url === 'https://skup-zlota-gorzow.angsm111.workers.dev/api/prices') {
        assert.equal(route.request().headers().cookie, undefined);
        if (mode === 'error') return route.abort();
        return route.fulfill({status:200, contentType:'application/json', headers:{'access-control-allow-origin':'*'}, body:JSON.stringify({
          status:'ok', provider:mode === 'fallback' ? 'Dane zapasowe' : 'Test fixture',
          fetchedAt:new Date(Date.now() - (mode === 'stale' ? 3600000 : 0)).toISOString(),
          metals:{gold:{purities:{585:{price},750:{price:267},999:{price:0}}}}
        })});
      }
      return route.abort();
    });
    await page.goto('http://127.0.0.1:8000/skup-zlota.html');
    await page.waitForFunction(() => document.querySelector('#gold-price').value === '222.22');
    assert.equal(await page.locator('#gold-price').getAttribute('readonly'), '');
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
      assert.equal(await page.inputValue('#gold-price'),'');
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
