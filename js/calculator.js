(() => {
  const form = document.querySelector('#gold-calculator');
  if (!form) return;
  const amount = document.querySelector('#calc-amount');
  const status = document.querySelector('#calc-status');
  const feedStatus = document.querySelector('#price-feed-status');
  const refresh = document.querySelector('#price-refresh');
  const spotPrice = document.querySelector('#gold-spot-price');
  const spotTime = document.querySelector('#gold-spot-time');
  const priceGrid = document.querySelector('#buy-price-grid');
  const currency = new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' });
  const endpoint = 'https://skup-zlota-gorzow.angsm111.workers.dev/api/prices';
  const maxAge = 15 * 60 * 1000;
  let prices = null;
  let fetchedAt = 0;
  let loading = false;

  function update() {
    priceGrid.querySelectorAll('button[data-purity]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.purity === form.elements.purity.value));
    });
    const weight = form.elements.weight.valueAsNumber;
    const price = prices?.[form.elements.purity.value];
    const validPrice = prices && Date.now() - fetchedAt <= maxAge && Number.isFinite(price) && price > 0;
    form.elements.price.value = validPrice ? price.toFixed(2) : '';
    if (!validPrice) {
      amount.textContent = '—';
      status.textContent = loading ? 'Pobieramy aktualne ceny skupu…' : 'Brak aktualnej ceny. Odśwież cennik lub zadzwoń: 601 775 146.';
      return;
    }
    if (!form.elements.weight.checkValidity() || !Number.isFinite(weight) || weight <= 0 || !Number.isFinite(weight * price)) {
      amount.textContent = '—';
      status.textContent = 'Podaj wagę złota, aby zobaczyć orientacyjną wartość skupu.';
      return;
    }
    amount.textContent = currency.format(weight * price);
    status.textContent = `${weight.toLocaleString('pl-PL')} g × ${currency.format(price)}/g · próba ${form.elements.purity.value}`;
  }

  async function loadPrices() {
    if (loading) return;
    loading = true;
    refresh.disabled = true;
    feedStatus.textContent = 'Pobieramy aktualny cennik…';
    update();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(endpoint, { cache: 'no-store', credentials: 'omit', signal: controller.signal });
      if (!response.ok) throw new Error('Price feed unavailable');
      const data = await response.json();
      const timestamp = Date.parse(data.fetchedAt);
      if (data.status !== 'ok' || !Number.isFinite(timestamp) || Date.now() - timestamp > maxAge || timestamp > Date.now() + 60000 || data.provider === 'Dane zapasowe') throw new Error('Unverified or stale prices');
      const spot = data.metals?.gold?.spot;
      if (typeof spot !== 'number' || !Number.isFinite(spot) || spot <= 0) throw new Error('Invalid spot price');
      const entries = Object.entries(data.metals?.gold?.purities || {})
        .filter(([purity, entry]) => /^\d{3}$/.test(purity) && Number(purity) > 0 && typeof entry?.price === 'number' && Number.isFinite(entry.price) && entry.price > 0)
        .sort((a, b) => Number(a[0]) - Number(b[0]));
      if (!entries.length) throw new Error('No valid gold prices');
      const selected = form.elements.purity.value || '585';
      prices = Object.fromEntries(entries.map(([purity, entry]) => [purity, entry.price]));
      priceGrid.replaceChildren(...entries.map(([purity, entry]) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.dataset.purity = purity;
        const label = document.createElement('span');
        label.textContent = `Próba ${purity}`;
        const value = document.createElement('strong');
        value.textContent = currency.format(entry.price);
        button.append(label, value);
        return button;
      }));
      fetchedAt = timestamp;
      spotPrice.textContent = currency.format(spot);
      spotTime.textContent = `Notowanie z ${new Date(timestamp).toLocaleString('pl-PL', { timeZone: 'Europe/Warsaw' })}`;
      form.elements.purity.replaceChildren(...entries.map(([purity]) => new Option(`Próba ${purity}`, purity)));
      form.elements.purity.value = prices[selected] ? selected : entries[0][0];
      form.elements.purity.disabled = false;
      feedStatus.textContent = `Notowania z ${new Date(timestamp).toLocaleString('pl-PL', { timeZone: 'Europe/Warsaw' })}. Sprawdzamy ceny co minutę.`;
    } catch {
      priceGrid.textContent = 'Ceny chwilowo niedostępne. Odśwież lub zadzwoń: 601 775 146.';
      spotPrice.textContent = '—';
      spotTime.textContent = 'Notowania chwilowo niedostępne. Odśwież ceny.';
      prices = null;
      fetchedAt = 0;
      form.elements.purity.disabled = true;
      feedStatus.textContent = 'Nie udało się potwierdzić aktualnych cen. Spróbuj ponownie lub zadzwoń: 601 775 146.';
    } finally {
      clearTimeout(timeout);
      loading = false;
      refresh.disabled = false;
      update();
    }
  }
  priceGrid.addEventListener('click', event => {
    const button = event.target.closest('button[data-purity]');
    if (!button || !prices) return;
    form.elements.purity.value = button.dataset.purity;
    update();
  });
  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('input', update);
  form.elements.purity.addEventListener('change', update);
  refresh.addEventListener('click', loadPrices);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) loadPrices(); });
  setInterval(() => { if (!document.hidden) loadPrices(); }, 60000);
  loadPrices();
})();
