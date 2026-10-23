(() => {
  const form = document.querySelector('#gold-calculator');
  const amount = document.querySelector('#calc-amount');
  const status = document.querySelector('#calc-status');
  const currency = new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' });
  function update() {
    const weight = form.elements.weight.valueAsNumber;
    const price = form.elements.price.valueAsNumber;
    if (!form.checkValidity() || !Number.isFinite(weight) || !Number.isFinite(price) || weight <= 0 || price <= 0 || !Number.isFinite(weight * price)) {
      amount.textContent = '—';
      status.textContent = 'Wpisz wagę i cenę skupu za gram wybranej próby, aby zobaczyć wycenę.';
      return;
    }
    amount.textContent = currency.format(weight * price);
    status.textContent = `${weight.toLocaleString('pl-PL')} g × ${currency.format(price)}/g · próba ${form.elements.purity.value}`;
  }
  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('input', update);
  form.elements.purity.addEventListener('change', () => {
    form.elements.price.value = '';
    update();
    status.textContent = 'Próba została zmieniona. Wpisz cenę skupu za gram dla nowej próby.';
  });
  update();
})();
