document.documentElement.classList.add('js');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const header = document.querySelector('.site-header');
const rollingText = document.querySelector('.rolling-label div');
let scrollFrame = 0;

function updateScrollDetails() {
  header.classList.toggle('is-scrolled', window.scrollY > 30);
  if (!prefersReducedMotion) {
    const shift = Math.max(-235, Math.min(0, -window.scrollY * 0.16));
    rollingText.style.setProperty('--roll', `${shift}px`);
  }
  scrollFrame = 0;
}

window.addEventListener('scroll', () => {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollDetails);
}, { passive: true });
updateScrollDetails();

const animatedElements = document.querySelectorAll('.ink-in, .impact-row, .contact__line, .study-flow');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        if (entry.target.classList.contains('study-flow')) entry.target.closest('.feature').classList.add('is-active');
        currentObserver.unobserve(entry.target);
      }
    }
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  animatedElements.forEach(element => observer.observe(element));
} else {
  animatedElements.forEach(element => {
    element.classList.add('is-visible');
    if (element.classList.contains('study-flow')) element.closest('.feature').classList.add('is-active');
  });
}

const blueprint = document.querySelector('.hero__blueprint');
const replayButton = document.querySelector('.blueprint__replay');
replayButton.addEventListener('click', () => {
  if (prefersReducedMotion) return;
  blueprint.classList.remove('is-replaying');
  void blueprint.offsetWidth;
  blueprint.classList.add('is-replaying');
});

document.querySelector('#year').textContent = new Date().getFullYear();
