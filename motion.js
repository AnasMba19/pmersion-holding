// Presentation only: no workshop state, calculation or storage ownership.
const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
const scene = document.getElementById('signature-scene');
const toggle = document.getElementById('motion-toggle');
const revealed = new WeakSet();
const running = new Set();
let reduced = preference.matches;
let observer;
let frame = 0;
let active = false;
let lastProgress = -1;
let lastStep = -1;

const clamp = (value, low, high) => Math.min(high, Math.max(low, value));

function stopAnimations() {
  for (const animation of running) animation.cancel();
  running.clear();
}

function updateScene() {
  frame = 0;
  if (!scene || !active || document.hidden) return;
  const box = scene.getBoundingClientRect();
  const viewport = window.innerHeight;
  const progress = reduced ? 1 : clamp((viewport * .8 - box.top) / Math.max(1, box.height - viewport * .2), 0, 1);
  const step = Math.min(2, Math.floor(progress * 3));
  // No continuous render loop. At most one read/write pass per scroll frame.
  if (Math.abs(progress - lastProgress) > .0005) {
    scene.style.setProperty('--scene-progress', progress.toFixed(4));
    lastProgress = progress;
  }
  if (step !== lastStep) {
    scene.dataset.sceneStep = String(step);
    lastStep = step;
  }
}

function scheduleScene() {
  if (!active || document.hidden || frame) return;
  frame = window.requestAnimationFrame(updateScene);
}

function reveal(element) {
  if (revealed.has(element)) return;
  revealed.add(element);
  if (reduced || typeof element.animate !== 'function') return;
  const delay = clamp(Number(element.dataset.revealDelay) || 0, 0, 240);
  const animation = element.animate(
    [{ opacity: .35, transform: 'translateY(20px)' }, { opacity: 1, transform: 'translateY(0)' }],
    { duration: 620, delay, easing: 'cubic-bezier(.16,1,.3,1)' },
  );
  running.add(animation);
  const remove = () => running.delete(animation);
  animation.addEventListener('finish', remove, { once: true });
  animation.addEventListener('cancel', remove, { once: true });
}

function observeReveals() {
  observer?.disconnect();
  if (reduced || !('IntersectionObserver' in window)) return;
  observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      reveal(entry.target);
      observer.unobserve(entry.target);
    }
  }, { threshold: .08, rootMargin: '0px 0px -24px 0px' });
  for (const element of document.querySelectorAll('[data-reveal]')) {
    if (!revealed.has(element)) observer.observe(element);
  }
}

function applyPreference() {
  document.documentElement.dataset.motion = reduced ? 'reduced' : 'full';
  if (toggle) {
    toggle.disabled = false;
    toggle.setAttribute('aria-pressed', String(reduced));
    toggle.textContent = reduced ? 'Activer les animations' : 'Réduire les animations';
  }
  stopAnimations();
  if (reduced) for (const animation of document.getAnimations()) animation.cancel();
  observeReveals();
  scheduleScene();
}

function changePreference(event) {
  reduced = event.matches;
  applyPreference();
}

function togglePreference() {
  reduced = !reduced;
  applyPreference();
}

function changeVisibility() {
  if (document.hidden) {
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
    stopAnimations();
  } else {
    scheduleScene();
  }
}

function start() {
  if (active) return;
  active = true;
  window.addEventListener('scroll', scheduleScene, { passive: true });
  window.addEventListener('resize', scheduleScene, { passive: true });
  document.addEventListener('visibilitychange', changeVisibility);
  preference.addEventListener('change', changePreference);
  toggle?.addEventListener('click', togglePreference);
  applyPreference();
}

function stop() {
  active = false;
  observer?.disconnect();
  stopAnimations();
  if (frame) window.cancelAnimationFrame(frame);
  frame = 0;
  window.removeEventListener('scroll', scheduleScene);
  window.removeEventListener('resize', scheduleScene);
  document.removeEventListener('visibilitychange', changeVisibility);
  preference.removeEventListener('change', changePreference);
  toggle?.removeEventListener('click', togglePreference);
}

window.addEventListener('pagehide', stop);
window.addEventListener('pageshow', event => { if (event.persisted) start(); });
start();
