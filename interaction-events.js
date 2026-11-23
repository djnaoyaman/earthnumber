/* Explicit interaction events; initial rendering and search text are never measured. */
(function () {
  'use strict';
  if (window.EarthNumberInteractionEvents) return;
  window.EarthNumberInteractionEvents = true;
  const destination = 'G-BRYWJ6L872';
  const exhibits = new Set(["distance","motion","atmosphere","inside","elements","time","water","cycles","light","stars","solar","lightning","quake","airmass","dna","mammals","species","humanmass","plastic","cloud","dust","rotation","seafloor","gold","ridge","plates","coreheat","fungus","ants","bacteria","minerals","moon-recession","rain-volume","ocean-pressure"]);
  const discoveries = new Set(["moon-recession","rain-volume","ocean-pressure"]);
  const genres = new Set(["all","space","air","water","geology","matter","physics","life","environment"]);
  const interacted = new Set();
  const selected = {
    level: document.querySelector('button[data-level][aria-pressed="true"]')?.dataset.level || 'all',
    genre: document.querySelector('button[data-genre][aria-pressed="true"]')?.dataset.genre || 'all'
  };
  function emit(name, values) {
    try {
      if (location.hostname !== 'djnaoyaman.github.io' || !location.pathname.startsWith('/earthnumber/') ||
          typeof window.gtag !== 'function' || window['ga-disable-' + destination]) return;
      window.gtag('event', name, {...values, send_to: destination,
        page_location: location.origin + location.pathname,
        page_referrer: (document.referrer || '').split(/[?#]/)[0]});
    } catch (_) { /* A measurement must never interrupt an exhibit. */ }
  }
  function interaction(control, type) {
    const id = control.closest('.exhibit[id]')?.id;
    if (!exhibits.has(id) || interacted.has(id) || control.disabled) return;
    interacted.add(id);
    emit('simulation_interact', {item_id: id, control_type: type});
  }
  window.addEventListener('popstate', () => {
    selected.level = document.querySelector('button[data-level][aria-pressed="true"]')?.dataset.level || 'all';
    selected.genre = document.querySelector('button[data-genre][aria-pressed="true"]')?.dataset.genre || 'all';
  });
  document.addEventListener('click', event => {
    if (!event.isTrusted) return;
    const link = event.target.closest?.('a[href]');
    if (link && !event.defaultPrevented) {
      try {
        const url = new URL(link.href, location.href);
        const id = url.hash.slice(1);
        const path = url.pathname === '/earthnumber/' ? '/earthnumber/index.html' : url.pathname;
        const target = discoveries.has(id) ? '/earthnumber/discoveries.html' : '/earthnumber/index.html';
        if (url.origin === location.origin && path === target && exhibits.has(id))
          emit('select_content', {content_type: 'exhibit', item_id: id});
      } catch (_) {}
    }
    const button = event.target.closest?.('button');
    if (!button || button.disabled) return;
    if (button.closest('#catalogFilters')) {
      const type = button.dataset.level ? 'level' : button.dataset.genre ? 'genre' : null;
      const value = type && button.dataset[type];
      if (type && (type === 'level' ? ['all','basic','advanced'].includes(value) : genres.has(value)) && selected[type] !== value) {
        selected[type] = value;
        emit('content_filter', {filter_type: type, filter_value: value});
      } else if (button.id === 'resetFilters' && (selected.level !== 'all' || selected.genre !== 'all')) {
        selected.level = selected.genre = 'all';
        emit('content_filter', {filter_type: 'reset', filter_value: 'all'});
      }
      return;
    }
    interaction(button, 'button');
  });
  document.addEventListener('change', event => {
    if (!event.isTrusted) return;
    const control = event.target;
    if (control.matches?.('input[type="range"]')) interaction(control, 'range');
    else if (control.matches?.('select')) interaction(control, 'select');
  });
})();
