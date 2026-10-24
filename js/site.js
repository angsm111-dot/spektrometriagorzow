document.querySelectorAll('.reveal').forEach(el => el.classList.add('on'));
const dashboard = document.querySelector('.dashboard');
if (dashboard) dashboard.classList.add('in-view');

const header = document.querySelector('.nav');
const menuToggle = header?.querySelector('.menu-toggle');
const navigation = header?.querySelector('#site-navigation');
if (menuToggle && navigation) {
  const mobileLayout = window.matchMedia('(max-width: 1100px)');
  function setMenu(open, restoreFocus = false) {
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Zamknij menu' : 'Otwórz menu');
    navigation.classList.toggle('is-open', open);
    if (restoreFocus) menuToggle.focus();
  }
  menuToggle.addEventListener('click', () => {
    setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
  });
  navigation.addEventListener('click', event => {
    if (event.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
      setMenu(false, true);
    }
  });
  document.addEventListener('click', event => {
    if (!header.contains(event.target)) setMenu(false);
  });
  mobileLayout.addEventListener('change', () => setMenu(false));
  header.classList.add('menu-ready');
}
