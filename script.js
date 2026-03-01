// ── CONFIG ────────────────────────────────────────────────────────────────────
// After deploying your Google Apps Script, paste the Web App URL below:
const APPS_SCRIPT_URL = '';
// Example: const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_ID/exec';
// ─────────────────────────────────────────────────────────────────────────────

const DEMO_MODE = !APPS_SCRIPT_URL;
let currentUser = null;

// ── On Page Load ──────────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  // Show demo warning if no backend URL is set
  if (DEMO_MODE) {
    document.getElementById('offline-note').classList.add('show');
  }

  // Auto-login if user was previously saved
  const saved = localStorage.getItem('quizora_user');
  if (saved) {
    currentUser = JSON.parse(saved);
    showLessonsPage();
  }

  // Animate progress bar after short delay
  setTimeout(() => {
    document.getElementById('progress-fill').style.width = '15%';
  }, 600);
});

// ── Tab Toggle ────────────────────────────────────────────────────────────────
function switchTab(tab) {
  document.getElementById('register-form').style.display = tab === 'register' ? 'block' : 'none';
  document.getElementById('login-form').style.display    = tab === 'login'    ? 'block' : 'none';
  document.getElementById('tab-register').classList.toggle('active', tab === 'register');
  document.getElementById('tab-login').classList.toggle('active', tab === 'login');
  hideMsg();
}

// ── Message Helpers ───────────────────────────────────────────────────────────
function showMsg(text, type = 'error') {
  const el = document.getElementById('form-msg');
  el.textContent = text;
  el.className = 'msg ' + type + ' show';
}
function hideMsg() {
  document.getElementById('form-msg').className = 'msg';
}

// ── Validation ────────────────────────────────────────────────────────────────
function isValidEmail(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}
function isValidPhone(p) {
  return /^\+?[\d\s\-().]{7,15}$/.test(p);
}

// ── Register ──────────────────────────────────────────────────────────────────
async function handleRegister() {
  const name  = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const phone = document.getElementById('reg-phone').value.trim();

  if (!name)                return showMsg('Please enter your full name.');
  if (!isValidEmail(email)) return showMsg('Please enter a valid email address.');
  if (!isValidPhone(phone)) return showMsg('Please enter a valid phone number.');

  const btn = document.querySelector('#register-form .btn-primary');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span>';
  hideMsg();

  try {
    if (DEMO_MODE) {
      // Simulate network delay in demo mode
      await new Promise(r => setTimeout(r, 900));
      currentUser = { name, email, phone };
      localStorage.setItem('quizora_user', JSON.stringify(currentUser));
      showLessonsPage();
    } else {
      const res = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify({ action: 'register', name, email, phone }),
      });
      const data = await res.json();
      if (data.success) {
        currentUser = { name, email, phone };
        localStorage.setItem('quizora_user', JSON.stringify(currentUser));
        showLessonsPage();
      } else {
        showMsg(data.message || 'Registration failed. Try again.');
      }
    }
  } catch (err) {
    // Fallback to demo mode on network error
    showMsg('Connection error — running in demo mode.');
    currentUser = { name, email, phone };
    localStorage.setItem('quizora_user', JSON.stringify(currentUser));
    showLessonsPage();
  }

  btn.disabled = false;
  btn.innerHTML = 'Create Account →';
}

// ── Login ─────────────────────────────────────────────────────────────────────
async function handleLogin() {
  const email = document.getElementById('login-email').value.trim();
  const phone = document.getElementById('login-phone').value.trim();

  if (!isValidEmail(email)) return showMsg('Please enter a valid email address.');
  if (!isValidPhone(phone)) return showMsg('Please enter a valid phone number.');

  const btn = document.querySelector('#login-form .btn-primary');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span>';
  hideMsg();

  try {
    if (DEMO_MODE) {
      await new Promise(r => setTimeout(r, 900));
      // In demo mode, derive name from email prefix
      currentUser = { name: email.split('@')[0], email, phone };
      localStorage.setItem('quizora_user', JSON.stringify(currentUser));
      showLessonsPage();
    } else {
      const res = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify({ action: 'login', email, phone }),
      });
      const data = await res.json();
      if (data.success) {
        currentUser = data.user;
        localStorage.setItem('quizora_user', JSON.stringify(currentUser));
        showLessonsPage();
      } else {
        showMsg(data.message || 'User not found. Check your details or register.');
      }
    }
  } catch (err) {
    showMsg('Connection error. Please check your network.');
  }

  btn.disabled = false;
  btn.innerHTML = 'Sign In →';
}

// ── Show Lessons Page ─────────────────────────────────────────────────────────
function showLessonsPage() {
  document.getElementById('auth-page').classList.remove('active');
  document.getElementById('lessons-page').classList.add('active');

  const firstName = (currentUser.name || 'Learner').split(' ')[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  document.getElementById('welcome-greeting').textContent = greeting + ', ' + firstName;
  document.getElementById('user-pill-name').textContent = firstName;
  document.getElementById('user-avatar').textContent = firstName[0].toUpperCase();
}

// ── Logout ────────────────────────────────────────────────────────────────────
function logout() {
  localStorage.removeItem('quizora_user');
  currentUser = null;

  document.getElementById('lessons-page').classList.remove('active');
  document.getElementById('auth-page').classList.add('active');

  // Clear all form fields
  ['reg-name', 'reg-email', 'reg-phone', 'login-email', 'login-phone']
    .forEach(id => document.getElementById(id).value = '');

  hideMsg();
  switchTab('register');
}

// ── Open Course ───────────────────────────────────────────────────────────────
function openCourse(id) {
  // Replace this with your actual course page navigation
  alert('🚀 Course "' + id + '" coming soon!\nBuild your quiz pages and link them here.');
}
