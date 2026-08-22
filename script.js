/* EverydayGass — script.js */

const CONTACT_EMAIL = 'hello@everydaygass.com';
const BASE_WEEKS = 8;

function formatPrice(n) {
  const rounded = Math.round(n * 100) / 100;
  return rounded % 1 === 0 ? `${rounded}` : rounded.toFixed(2);
}

document.querySelectorAll('.pricing-toggle__btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const weeks = Number(btn.dataset.period);

    document.querySelectorAll('.pricing-toggle__btn').forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');

    document.querySelectorAll('.pricing-card__amount[data-p8]').forEach(amountEl => {
      const price = Number(amountEl.getAttribute(`data-p${weeks}`));
      amountEl.textContent = `€${formatPrice(price)}`;

      const card = amountEl.closest('.pricing-card');

      const labelEl = card.querySelector('[data-period-label]');
      if (labelEl) labelEl.textContent = `for ${weeks} weeks`;

      const weeklyEl = card.querySelector('[data-weekly]');
      if (weeklyEl) weeklyEl.textContent = `€${formatPrice(price / weeks)} / week`;

      const fullPrice = Number(amountEl.dataset.p8) * (weeks / BASE_WEEKS);
      const saving = fullPrice - price;
      const billedEl = card.querySelector('[data-billed]');
      if (saving > 0) {
        billedEl.innerHTML = `<s>€${formatPrice(fullPrice)}</s> you save €${formatPrice(saving)}`;
        billedEl.hidden = false;
      } else {
        billedEl.hidden = true;
      }
    });
  });
});

document.querySelectorAll('.faq-item__question').forEach(btn => {
  btn.addEventListener('click', () => {
    const answer = btn.nextElementSibling;
    const isOpen = btn.getAttribute('aria-expanded') === 'true';

    document.querySelectorAll('.faq-item__question').forEach(b => {
      b.setAttribute('aria-expanded', 'false');
      b.nextElementSibling.classList.remove('is-open');
    });

    if (!isOpen) {
      btn.setAttribute('aria-expanded', 'true');
      answer.classList.add('is-open');
    }
  });
});

const goalSelect = document.getElementById('goal');
const goalOther = document.getElementById('goal-other');
if (goalSelect) {
  goalSelect.addEventListener('change', () => {
    const show = goalSelect.value === 'other';
    goalOther.style.display = show ? 'block' : 'none';
    goalOther.required = show;
  });
}

const form = document.getElementById('qualForm');
const success = document.getElementById('formSuccess');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();

    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      field.classList.remove('is-error');
      if (!field.value.trim()) {
        field.classList.add('is-error');
        valid = false;
      }
    });
    if (!valid) return;

    const data = new FormData(form);
    const name = data.get('name') || '';
    const email = data.get('email') || '';
    const goal = data.get('goal-other') || data.get('goal') || '';
    const experience = data.get('experience') || '';
    const days = data.get('days') || '';

    const subject = encodeURIComponent(`EverydayGass call request — ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nGoal: ${goal}\nPrevious plan: ${experience}\nDays per week: ${days}\n`
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;

    form.hidden = true;
    success.hidden = false;
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

const stickyCta = document.getElementById('stickyCta');
const heroSection = document.getElementById('hero');
const formSection = document.getElementById('form');

if (stickyCta && heroSection && formSection) {
  const toggleSticky = () => {
    const heroBottom = heroSection.getBoundingClientRect().bottom;
    const formTop = formSection.getBoundingClientRect().top;
    const show = heroBottom < 0 && formTop > window.innerHeight;
    stickyCta.classList.toggle('is-visible', show);
  };
  window.addEventListener('scroll', toggleSticky, { passive: true });
}

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
