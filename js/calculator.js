(() => {
  const form = document.querySelector('#gold-calculator');
  if (!form) return;
  const amount = document.querySelector('#calc-amount');
  const status = document.querySelector('#calc-status');
  const feedStatus = document.querySelector('#price-feed-status');
  const refresh = document.querySelector('#price-refresh');
  const spotPrice = document.querySelector('#gold-spot-price');
  const spotTime = document.querySelector('#gold-spot-time');
  const spotTitle = document.querySelector('#gold-spot-title');
  const priceRows = document.querySelector('#buy-price-rows');
  const priceCaption = document.querySelector('#buy-price-caption');
  const metalPicker = document.querySelector('#buy-metal');
  const metals = {
    gold: { name: 'Złoto', spot: 'Złoto 999,9', preferred: '585' },
    silver: { name: 'Srebro', spot: 'Srebro', preferred: '925' },
    palladium: { name: 'Pallad', spot: 'Pallad', preferred: '999' },
    platinum: { name: 'Platyna', spot: 'Platyna', preferred: '950' }
  };
  const currency = new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' });
  const endpoint = 'https://skup-zlota-gorzow.angsm111.workers.dev/api/prices';
  const maxAge = 15 * 60 * 1000;
  const selections = {};
  let catalog = null;
  let prices = null;
  let fetchedAt = 0;
  let loading = false;

  function unavailableRow(message) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 2;
    cell.textContent = message;
    row.append(cell);
    priceRows.replaceChildren(row);
  }

  function update() {
    const weight = form.elements.weight.valueAsNumber;
    const price = prices?.[form.elements.purity.value];
    const validPrice = prices && Date.now() - fetchedAt <= maxAge && Number.isFinite(price) && price > 0;
    form.elements.price.value = validPrice ? price.toFixed(2) : '';
    if (!validPrice) {
      amount.textContent = '—';
      status.textContent = loading ? 'Pobieramy aktualne ceny skupu…' : 'Brak aktualnej ceny wybranego metalu. Odśwież cennik lub zadzwoń: 601 775 146.';
      return;
    }
    if (!form.elements.weight.checkValidity() || !Number.isFinite(weight) || weight <= 0 || !Number.isFinite(weight * price)) {
      amount.textContent = '—';
      status.textContent = 'Podaj wagę metalu, aby zobaczyć orientacyjną wartość skupu.';
      return;
    }
    amount.textContent = currency.format(weight * price);
    status.textContent = `${metals[metalPicker.value].name} · ${weight.toLocaleString('pl-PL')} g × ${currency.format(price)}/g · próba ${form.elements.purity.value}`;
  }

  function renderMetal() {
    const key = metalPicker.value;
    const meta = metals[key];
    const data = catalog?.[key];
    spotTitle.textContent = `${meta.spot} · cena giełdowa`;
    priceCaption.textContent = `${meta.name} — ceny skupu za 1 gram według próby`;
    prices = null;
    if (!data || Date.now() - fetchedAt > maxAge) {
      unavailableRow(loading ? 'Pobieramy aktualne ceny…' : 'Ceny tego metalu chwilowo niedostępne. Odśwież lub zadzwoń: 601 775 146.');
      spotPrice.textContent = '—';
      spotTime.textContent = loading ? 'Pobieramy aktualne notowania…' : 'Notowania chwilowo niedostępne.';
      form.elements.purity.replaceChildren(new Option('Brak aktualnych prób i cen', ''));
      form.elements.purity.disabled = true;
      update();
      return;
    }
    prices = Object.fromEntries(data.entries.map(([purity, entry]) => [purity, entry.price]));
    priceRows.replaceChildren(...data.entries.map(([purity, entry]) => {
      const row = document.createElement('tr');
      const label = document.createElement('th');
      label.scope = 'row';
      label.textContent = purity;
      const value = document.createElement('td');
      value.textContent = currency.format(entry.price);
      row.append(label, value);
      return row;
    }));
    spotPrice.textContent = currency.format(data.spot);
    spotTime.textContent = `Notowanie z ${new Date(fetchedAt).toLocaleString('pl-PL', { timeZone: 'Europe/Warsaw' })}`;
    const selected = selections[key] || meta.preferred;
    form.elements.purity.replaceChildren(...data.entries.map(([purity]) => new Option(`Próba ${purity}`, purity)));
    form.elements.purity.value = prices[selected] ? selected : data.entries[0][0];
    form.elements.purity.disabled = false;
    update();
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
      const next = {};
      for (const key of Object.keys(metals)) {
        const metal = data.metals?.[key];
        const entries = Object.entries(metal?.purities || {})
          .filter(([purity, entry]) => /^\d{3}$/.test(purity) && Number(purity) > 0 && typeof entry?.price === 'number' && Number.isFinite(entry.price) && entry.price > 0)
          .sort((a, b) => Number(a[0]) - Number(b[0]));
        if (typeof metal?.spot === 'number' && Number.isFinite(metal.spot) && metal.spot > 0 && entries.length) {
          next[key] = { spot: metal.spot, entries };
        }
      }
      if (!Object.keys(next).length) throw new Error('No valid metal prices');
      catalog = next;
      fetchedAt = timestamp;
      feedStatus.textContent = `Notowania z ${new Date(timestamp).toLocaleString('pl-PL', { timeZone: 'Europe/Warsaw' })}. Sprawdzamy ceny co minutę.`;
    } catch {
      catalog = null;
      fetchedAt = 0;
      feedStatus.textContent = 'Nie udało się potwierdzić aktualnych cen. Spróbuj ponownie lub zadzwoń: 601 775 146.';
    } finally {
      clearTimeout(timeout);
      loading = false;
      refresh.disabled = false;
      renderMetal();
    }
  }
  metalPicker.addEventListener('change', renderMetal);
  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('input', update);
  form.elements.purity.addEventListener('change', () => {
    selections[metalPicker.value] = form.elements.purity.value;
    update();
  });
  refresh.addEventListener('click', loadPrices);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) loadPrices(); });
  setInterval(() => { if (!document.hidden) loadPrices(); }, 60000);
  loadPrices();
})();
