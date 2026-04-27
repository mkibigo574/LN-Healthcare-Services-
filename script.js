/* =========================================================
   1. SCROLL EFFECTS
========================================================= */
const nav = document.getElementById('nav');
const scrollTopBtn = document.getElementById('scrollTop');
if (nav || scrollTopBtn) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (nav) nav.classList.toggle('sc', y > 50);
    if (scrollTopBtn) scrollTopBtn.classList.toggle('show', y > 400);
  });
}

/* =========================================================
   2. REVEAL ANIMATIONS
========================================================= */
const revIO = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('on'), i * 55);
      revIO.unobserve(e.target);
    }
  });
}, { threshold: 0.09 });
document.querySelectorAll('.reveal').forEach(el => revIO.observe(el));

/* =========================================================
   3. ANIMATED STAT COUNTERS
========================================================= */
const animateCount = (el) => {
  const target = parseInt(el.dataset.target, 10);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const stepTime = 16;
  const steps = duration / stepTime;
  const inc = target / steps;
  let cur = 0;
  const t = setInterval(() => {
    cur += inc;
    if (cur >= target) { cur = target; clearInterval(t); }
    el.textContent = prefix + Math.floor(cur).toLocaleString() + suffix;
  }, stepTime);
};
const statIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('[data-target]').forEach(animateCount);
      statIO.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('.stats').forEach(el => statIO.observe(el));

/* =========================================================
   4. NDIS GUIDE TABS
========================================================= */
function showTab(id, btn) {
  document.querySelectorAll('.tab-pan').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected','false'); });
  document.getElementById(id).classList.add('active');
  btn.classList.add('active');
  btn.setAttribute('aria-selected','true');
}

/* =========================================================
   5. ELIGIBILITY QUIZ
========================================================= */
const qBar = document.getElementById('qBar');
function nextQ(nextId, btn, val) {
  const cur = btn.closest('.quiz-q');
  cur.classList.remove('active');
  document.getElementById(nextId).classList.add('active');
  const stepNum = parseInt(nextId.replace('q','')) * 25;
  qBar.style.width = stepNum + '%';
}
function showResult(id) {
  document.querySelectorAll('.quiz-q').forEach(q => q.classList.remove('active'));
  document.querySelectorAll('.quiz-res').forEach(r => r.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  qBar.style.width = '100%';
}
function yesResult() { showResult('rYes'); }
function noResult() { showResult('rNo'); }
function earlyQ() { showResult('rEarly'); }

/* =========================================================
   6. SERVICE FILTER
========================================================= */
function filterSvc(cat, btn) {
  document.querySelectorAll('.svc-filter button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.svc-card').forEach(card => {
    const show = (cat === 'all' || card.dataset.cat === cat);
    card.style.display = show ? '' : 'none';
  });
}

/* =========================================================
   7. ACCORDION FAQ
========================================================= */
function toggleAcc(head) {
  const item = head.closest('.acc');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.acc').forEach(a => {
    a.classList.remove('open');
    a.querySelector('.acc-head').setAttribute('aria-expanded','false');
  });
  if (!isOpen) {
    item.classList.add('open');
    head.setAttribute('aria-expanded','true');
  }
}
document.querySelectorAll('.acc-head').forEach(h => {
  h.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleAcc(h); }
  });
});

/* =========================================================
   8. MOBILE NAVIGATION
========================================================= */
const hamb = document.getElementById('hamb');
const mobNav = document.getElementById('mobNav');
const mobCl = document.getElementById('mobCl');
if (hamb && mobNav && mobCl) {
  hamb.addEventListener('click', () => {
    mobNav.classList.add('open');
    hamb.setAttribute('aria-expanded','true');
    document.body.style.overflow = 'hidden';
  });
  mobCl.addEventListener('click', closeMob);
}
function closeMob() {
  if (!mobNav || !hamb) return;
  mobNav.classList.remove('open');
  hamb.setAttribute('aria-expanded','false');
  document.body.style.overflow = '';
}

/* =========================================================
   8b. REFERRAL MODAL
========================================================= */
function openReferralModal() {
  const m = document.getElementById('referralModal');
  if (!m) return;
  m.classList.add('open');
  document.body.classList.add('modal-open');
  // focus the first input for accessibility
  setTimeout(() => {
    const first = m.querySelector('input, select, textarea, button');
    if (first) first.focus();
  }, 50);
}
function closeReferralModal() {
  const m = document.getElementById('referralModal');
  if (!m) return;
  m.classList.remove('open');
  document.body.classList.remove('modal-open');
}
// click-outside to close
document.addEventListener('click', (e) => {
  const m = document.getElementById('referralModal');
  if (m && m.classList.contains('open') && e.target === m) closeReferralModal();
});

/* =========================================================
   9. FORM VALIDATION & SUBMISSION
========================================================= */
const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isValidPhone = (v) => {
  const cleaned = v.replace(/[\s\-()]/g, '');
  return /^(\+?61|0)[0-9]{8,10}$/.test(cleaned) || /^1[38]00[0-9]{6}$/.test(cleaned);
};

function clearErrors(form) {
  form.querySelectorAll('.field-error').forEach(el => el.classList.remove('field-error'));
  form.querySelectorAll('.field-error-msg').forEach(el => el.remove());
}
function setError(el, msg) {
  el.classList.add('field-error');
  if (!el.parentElement.querySelector('.field-error-msg')) {
    const m = document.createElement('span');
    m.className = 'field-error-msg';
    m.textContent = msg;
    el.parentElement.appendChild(m);
  }
}
function setGroupError(grp, msg) {
  grp.classList.add('field-error');
  if (!grp.parentElement.querySelector('.field-error-msg')) {
    const m = document.createElement('span');
    m.className = 'field-error-msg';
    m.textContent = msg;
    grp.parentElement.appendChild(m);
  }
}

function validateForm(form) {
  clearErrors(form);
  let ok = true;
  let firstBad = null;

  form.querySelectorAll('[data-req="1"]').forEach(el => {
    const tag = el.tagName.toLowerCase();
    const type = (el.type || '').toLowerCase();
    if (type === 'checkbox') {
      if (!el.checked) {
        el.parentElement.classList.add('field-error');
        ok = false;
        if (!firstBad) firstBad = el;
      }
    } else if (!el.value || !el.value.trim()) {
      setError(el, 'This field is required');
      ok = false;
      if (!firstBad) firstBad = el;
    } else {
      if (el.dataset.type === 'email' && !isValidEmail(el.value.trim())) {
        setError(el, 'Please enter a valid email address');
        ok = false;
        if (!firstBad) firstBad = el;
      }
      if (el.dataset.type === 'phone' && !isValidPhone(el.value.trim())) {
        setError(el, 'Please enter a valid Australian phone number');
        ok = false;
        if (!firstBad) firstBad = el;
      }
      if (el.dataset.file === '1' && el.files && el.files[0]) {
        if (el.files[0].size > 5 * 1024 * 1024) {
          setError(el, 'File must be 5MB or smaller');
          ok = false;
          if (!firstBad) firstBad = el;
        }
      }
    }
  });

  form.querySelectorAll('[data-type="email-opt"]').forEach(el => {
    if (el.value.trim() && !isValidEmail(el.value.trim())) {
      setError(el, 'Please enter a valid email address');
      ok = false;
      if (!firstBad) firstBad = el;
    }
  });

  form.querySelectorAll('[data-req-radio]').forEach(grp => {
    const name = grp.dataset.reqRadio;
    const checked = form.querySelector(`input[name="${name}"]:checked`);
    if (!checked) {
      setGroupError(grp, 'Please select an option');
      ok = false;
      if (!firstBad) firstBad = grp;
    }
  });

  form.querySelectorAll('[data-req-check]').forEach(grp => {
    const name = grp.dataset.reqCheck;
    const checked = form.querySelectorAll(`input[name="${name}"]:checked`);
    if (checked.length === 0) {
      setGroupError(grp, 'Please select at least one option');
      ok = false;
      if (!firstBad) firstBad = grp;
    }
  });

  if (!ok && firstBad) {
    firstBad.scrollIntoView({behavior:'smooth', block:'center'});
    if (firstBad.focus) firstBad.focus({preventScroll:true});
  }
  return ok;
}

function makeRef(prefix) {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${n}`;
}

function buildMailto(form, subject) {
  const fd = new FormData(form);
  let body = '';
  fd.forEach((v, k) => {
    if (k.startsWith('_')) return;
    if (v instanceof File) {
      if (v.name) body += `${k}: [Attached file: ${v.name}]\n`;
    } else {
      body += `${k}: ${v}\n`;
    }
  });
  return `mailto:admin@lnhealthcareservices.com.au?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function submitReferral(e) {
  e.preventDefault();
  const form = document.getElementById('referralForm');
  if (!validateForm(form)) return false;

  document.getElementById('rRefEmail').value = document.getElementById('referrerEmailInput').value;

  const action = form.getAttribute('action');
  const useFormspree = action.includes('formspree.io');

  if (useFormspree) {
    fetch(action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    }).then(r => {
      if (r.ok) showSuccess('referral');
      else fallbackMailto(form);
    }).catch(() => fallbackMailto(form));
  } else {
    const link = buildMailto(form, 'New Participant Referral — LN Health Care Services');
    window.location.href = link;
    setTimeout(() => showSuccess('referral'), 500);
  }
  return false;
}

function submitApplication(e) {
  e.preventDefault();
  const form = document.getElementById('applicationForm');
  if (!validateForm(form)) return false;

  document.getElementById('aRefEmail').value = document.getElementById('applicantEmailInput').value;

  const action = form.getAttribute('action');
  const useFormspree = action.includes('formspree.io');

  if (useFormspree) {
    fetch(action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    }).then(r => {
      if (r.ok) showSuccess('application');
      else fallbackMailto(form, 'application');
    }).catch(() => fallbackMailto(form, 'application'));
  } else {
    const link = buildMailto(form, 'New Job Application — LN Health Care Services');
    window.location.href = link;
    setTimeout(() => showSuccess('application'), 500);
  }
  return false;
}

function fallbackMailto(form, kind) {
  const subject = kind === 'application'
    ? 'New Job Application — LN Health Care Services'
    : 'New Participant Referral — LN Health Care Services';
  window.location.href = buildMailto(form, subject);
  setTimeout(() => showSuccess(kind || 'referral'), 500);
}

function showSuccess(which) {
  if (which === 'referral') {
    document.getElementById('referralForm').style.display = 'none';
    const msg = document.getElementById('referralSuccess');
    document.getElementById('refRef').textContent = 'Reference: ' + makeRef('LN-REF');
    msg.classList.add('show');
    msg.scrollIntoView({behavior:'smooth', block:'center'});
  } else {
    document.getElementById('applicationForm').style.display = 'none';
    const msg = document.getElementById('applicationSuccess');
    document.getElementById('appRef').textContent = 'Application Reference: ' + makeRef('LN-APP');
    msg.classList.add('show');
    msg.scrollIntoView({behavior:'smooth', block:'center'});
  }
}

/* =========================================================
   10. CHAT BUBBLE
========================================================= */
function toggleChat() {
  const pop = document.getElementById('chatPop');
  if (pop) pop.classList.toggle('show');
}
document.addEventListener('click', (e) => {
  const pop = document.getElementById('chatPop');
  const btn = document.getElementById('chatBtn');
  if (pop && btn && !pop.contains(e.target) && !btn.contains(e.target)) {
    pop.classList.remove('show');
  }
});

/* =========================================================
   11. KEYBOARD ACCESSIBILITY
========================================================= */
document.querySelectorAll('[tabindex="0"]').forEach(el => {
  el.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      el.click();
    }
  });
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (mobNav && mobNav.classList.contains('open')) closeMob();
    const chatPop = document.getElementById('chatPop');
    if (chatPop) chatPop.classList.remove('show');
    const refModal = document.getElementById('referralModal');
    if (refModal && refModal.classList.contains('open')) closeReferralModal();
  }
});

/* =========================================================
   12. SMOOTH SCROLL (anchor links)
========================================================= */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const id = this.getAttribute('href');
    if (id === '#' || id.length < 2) return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({behavior:'smooth', block:'start'});
    }
  });
});
