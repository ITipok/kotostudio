// ──────────────────────────────────────────────────────────
// 1. НАВИГАЦИЯ — фон при прокрутке
// ──────────────────────────────────────────────────────────
const nav = document.getElementById('mainNav');

function handleNavScroll() {
  if (window.scrollY > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll();

// ──────────────────────────────────────────────────────────
// 2. ПЛАВНАЯ ПРОКРУТКА для ссылок меню + закрытие бургера
// ──────────────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const targetId = link.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    const navCollapse = document.getElementById('navMenu');
    if (navCollapse && navCollapse.classList.contains('show')) {
      const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
      bsCollapse && bsCollapse.hide();
    }

    const offset = nav.offsetHeight + 16;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ──────────────────────────────────────────────────────────
// 3. АКТИВНЫЙ ПУНКТ МЕНЮ при скролле (Scrollspy вручную)
// ──────────────────────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

function updateActiveLink() {
  let current = '';
  sections.forEach(section => {
    const sTop = section.offsetTop - nav.offsetHeight - 40;
    if (window.scrollY >= sTop) current = section.id;
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveLink, { passive: true });

// ──────────────────────────────────────────────────────────
// 4. АНИМАЦИЯ ПОЯВЛЕНИЯ ЭЛЕМЕНТОВ при прокрутке
// ──────────────────────────────────────────────────────────
const revealEls = document.querySelectorAll(
  '.about__grid, .gallery__item, .booking__wrapper, .feature-item, .stat'
);

revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealEls.forEach(el => revealObserver.observe(el));

// ──────────────────────────────────────────────────────────
// 5. ВАЛИДАЦИЯ ФОРМЫ
// ──────────────────────────────────────────────────────────
const form    = document.getElementById('bookingForm');
const success = document.getElementById('bookingSuccess');

/**
 * Показать ошибку поля
 */
function setInvalid(input, msg) {
  input.classList.add('is-invalid');
  input.classList.remove('is-valid');
  const feedback = input.closest('.form-group')?.querySelector('.invalid-feedback');
  if (feedback && msg) feedback.textContent = msg;
}

/**
 * Показать успех поля
 */
function setValid(input) {
  input.classList.remove('is-invalid');
  input.classList.add('is-valid');
}

/**
 * Проверка одного поля
 * @returns {boolean}
 */
function validateField(input) {
  const value = input.value.trim();
  const type  = input.type;
  const name  = input.name;

  if (input.required && !value) {
    setInvalid(input, 'Это поле обязательно для заполнения.');
    return false;
  }

  if (type === 'email' && value) {
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRe.test(value)) {
      setInvalid(input, 'Введите корректный адрес электронной почты.');
      return false;
    }
  }

  if (type === 'tel' && value) {
    const phoneRe = /[\+\d\s\(\)\-]{7,20}/;
    if (!phoneRe.test(value)) {
      setInvalid(input, 'Введите корректный номер телефона.');
      return false;
    }
  }

  if (input.minLength > 0 && value.length < input.minLength) {
    setInvalid(input, `Минимальная длина — ${input.minLength} символа.`);
    return false;
  }

  setValid(input);
  return true;
}

// Валидация в реальном времени (на blur)
if (form) {
  form.querySelectorAll('.custom-input').forEach(input => {
    input.addEventListener('blur', () => {
      if (input.value.trim()) validateField(input);
    });

    input.addEventListener('input', () => {
      if (input.classList.contains('is-invalid')) validateField(input);
    });
  });

  // Отправка формы
  form.addEventListener('submit', e => {
    e.preventDefault();

    const inputs  = form.querySelectorAll('.custom-input');
    let   isValid = true;

    inputs.forEach(input => {
      if (!validateField(input)) isValid = false;
    });

    if (!isValid) {
      // Прокрутить к первому невалидному полю
      const firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) {
        firstInvalid.focus();
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Имитация отправки
    const submitBtn = form.querySelector('.btn-submit');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i>Отправляем…';

    setTimeout(() => {
      form.style.display = 'none';
      success.style.display = 'block';
    }, 1400);
  });
}

// ──────────────────────────────────────────────────────────
// 6. МАСКА ТЕЛЕФОНА (простая)
// ──────────────────────────────────────────────────────────
const phoneInput = document.getElementById('phone');
if (phoneInput) {
  phoneInput.addEventListener('input', function () {
    let val = this.value.replace(/\D/g, '');
    if (val.startsWith('7') || val.startsWith('8')) {
      val = '+7' + val.slice(1);
    } else if (val && !val.startsWith('+')) {
      val = '+' + val;
    }
    this.value = val.slice(0, 12);
  });
}
