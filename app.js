(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const toast = (message) => {
    const el = $('.toast');
    if (!el) return;
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(window.__morrowToast);
    window.__morrowToast = setTimeout(() => el.classList.remove('show'), 2600);
  };

  // Mobile navigation
  const toggle = $('.menu-toggle');
  const nav = $('.main-nav');
  if (toggle && nav) toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? '×' : '☰';
  });

  // Demo bag: stored only in this browser, with no checkout or payment.
  const BAG_KEY = 'morrow_demo_bag';
  const getBag = () => {
    try { return JSON.parse(localStorage.getItem(BAG_KEY) || '[]'); } catch { return []; }
  };
  const saveBag = (bag) => {
    localStorage.setItem(BAG_KEY, JSON.stringify(bag));
    renderBag();
  };
  function renderBag() {
    const bag = getBag();
    $$('.bag-count').forEach(el => el.textContent = bag.length);
    const target = $('#bag-items');
    if (!target) return;
    if (!bag.length) { target.textContent = 'Your bag is waiting for something lovely.'; return; }
    target.innerHTML = '';
    bag.forEach((name, index) => {
      const row = document.createElement('div');
      row.className = 'bag-item';
      const label = document.createElement('span');
      label.textContent = name;
      const remove = document.createElement('button');
      remove.textContent = 'Remove';
      remove.className = 'text-link';
      remove.type = 'button';
      remove.addEventListener('click', () => {
        const updated = getBag();
        updated.splice(index, 1);
        saveBag(updated);
      });
      row.append(label, remove);
      target.append(row);
    });
  }
  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-add]');
    if (!button) return;
    const bag = getBag();
    bag.push(button.dataset.add);
    saveBag(bag);
    toast('Added to your demo bag.');
  });
  $('#clear-bag')?.addEventListener('click', () => { saveBag([]); toast('Demo bag cleared.'); });
  renderBag();

  // Shop filters
  const filterButtons = $$('.filter');
  if (filterButtons.length) {
    const params = new URLSearchParams(location.search);
    const initial = params.get('category') || 'All';
    const applyFilter = (category) => {
      let visible = 0;
      $$('.product-card').forEach(card => {
        const show = category === 'All' || card.dataset.category === category;
        card.hidden = !show;
        if (show) visible++;
      });
      filterButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.filter === category));
      const count = $('#result-count');
      if (count) count.textContent = `${String(visible).padStart(2,'0')} thoughtfully made things`;
    };
    filterButtons.forEach(btn => btn.addEventListener('click', () => applyFilter(btn.dataset.filter)));
    applyFilter(filterButtons.some(b => b.dataset.filter === initial) ? initial : 'All');
  }

  // Demo forms do not transmit or store user data.
  $$('.newsletter-form, .contact-form').forEach(form => form.addEventListener('submit', event => {
    event.preventDefault();
    form.reset();
    toast('Thank you! This demo form is not connected yet.');
  }));
})();