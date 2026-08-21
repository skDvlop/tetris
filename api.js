'use strict';

const TOKEN_KEY = 'tetris_token';
const EMAIL_KEY = 'tetris_email';

const TetrisAPI = {
  IS_PAGES: location.hostname.endsWith('github.io'),
  BASE: 'http://localhost:8000',
  token: localStorage.getItem(TOKEN_KEY),
  email: localStorage.getItem(EMAIL_KEY),
  backendAvailable: false,

  isBackendMode() {
    return !this.IS_PAGES && this.backendAvailable;
  },

  isLoggedIn() {
    return !!this.token;
  },

  authHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    return headers;
  },

  saveSession(accessToken, email) {
    this.token = accessToken;
    this.email = email;
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(EMAIL_KEY, email);
  },

  clearSession() {
    this.token = null;
    this.email = null;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EMAIL_KEY);
  },

  async request(path, options = {}) {
    const response = await fetch(`${this.BASE}${path}`, {
      ...options,
      headers: {
        ...this.authHeaders(),
        ...(options.headers || {}),
      },
    });

    let data = null;
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      data = await response.json();
    }

    if (!response.ok) {
      const message = data?.detail || '요청에 실패했습니다.';
      throw new Error(typeof message === 'string' ? message : '요청에 실패했습니다.');
    }

    return data;
  },

  async checkBackend() {
    if (this.IS_PAGES) {
      this.backendAvailable = false;
      return false;
    }

    try {
      const response = await fetch(`${this.BASE}/api/health`, { method: 'GET' });
      this.backendAvailable = response.ok;
    } catch (_) {
      this.backendAvailable = false;
    }
    return this.backendAvailable;
  },

  async register(email, password) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async login(email, password) {
    const data = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.saveSession(data.access_token, data.email);
    return data;
  },

  logout() {
    this.clearSession();
  },

  async submitPlay(score, level) {
    if (!this.isBackendMode() || !this.isLoggedIn()) return null;
    return this.request('/api/plays', {
      method: 'POST',
      body: JSON.stringify({ score, level }),
    });
  },

  async fetchHighScore() {
    if (!this.isBackendMode()) return null;
    return this.request('/api/scores/high');
  },
};

const authSection = document.getElementById('auth-section');
const authGuest = document.getElementById('auth-guest');
const authLoggedInEl = document.getElementById('auth-logged-in');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginEmailInput = document.getElementById('login-email');
const loginPasswordInput = document.getElementById('login-password');
const registerEmailInput = document.getElementById('register-email');
const registerPasswordInput = document.getElementById('register-password');
const loginSubmitBtn = document.getElementById('login-submit');
const registerSubmitBtn = document.getElementById('register-submit');
const loginMessageEl = document.getElementById('login-message');
const registerMessageEl = document.getElementById('register-message');
const authUserEmailEl = document.getElementById('auth-user-email');
const logoutBtn = document.getElementById('logout-btn');
const highScoreEl = document.getElementById('high-score');
const highScoreMetaEl = document.getElementById('high-score-meta');

function setMessage(el, text, isError = false) {
  if (!el) return;
  el.textContent = text;
  el.classList.toggle('auth-message--error', isError);
}

function clearGuestForms() {
  loginForm?.reset();
  registerForm?.reset();
  setMessage(loginMessageEl, '');
  setMessage(registerMessageEl, '');
}

function updateAuthUI() {
  const backend = TetrisAPI.isBackendMode();
  if (!authSection) return;

  authSection.hidden = !backend;
  if (!backend) return;

  const loggedIn = TetrisAPI.isLoggedIn();
  authGuest.hidden = loggedIn;
  authLoggedInEl.hidden = !loggedIn;

  if (loggedIn) {
    authUserEmailEl.textContent = TetrisAPI.email || '';
  }

  if (typeof window.updateGameAuthState === 'function') {
    window.updateGameAuthState();
  }
}

function updateHighScoreUI(data) {
  if (!highScoreEl || !highScoreMetaEl) return;

  if (!TetrisAPI.isBackendMode()) {
    highScoreEl.textContent = '—';
    highScoreMetaEl.textContent = '백엔드 미연결';
    return;
  }

  if (!data) {
    highScoreEl.textContent = '0';
    highScoreMetaEl.textContent = '아직 기록 없음';
    return;
  }

  highScoreEl.textContent = String(data.score);
  highScoreMetaEl.textContent = `${data.email} · Lv.${data.level}`;
}

async function refreshHighScore() {
  if (!TetrisAPI.isBackendMode()) {
    updateHighScoreUI(null);
    return;
  }

  try {
    const data = await TetrisAPI.fetchHighScore();
    updateHighScoreUI(data);
  } catch (_) {
    highScoreEl.textContent = '—';
    highScoreMetaEl.textContent = '불러오기 실패';
  }
}

loginForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  setMessage(loginMessageEl, '');

  const email = loginEmailInput.value.trim();
  const password = loginPasswordInput.value;

  if (!email || !password) {
    setMessage(loginMessageEl, '이메일과 비밀번호를 입력하세요.', true);
    return;
  }

  loginSubmitBtn.disabled = true;

  try {
    await TetrisAPI.login(email, password);
    clearGuestForms();
    updateAuthUI();
    await refreshHighScore();
  } catch (error) {
    setMessage(loginMessageEl, error.message, true);
  } finally {
    loginSubmitBtn.disabled = false;
  }
});

registerForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  setMessage(registerMessageEl, '');

  const email = registerEmailInput.value.trim();
  const password = registerPasswordInput.value;

  if (!email || !password) {
    setMessage(registerMessageEl, '이메일과 비밀번호를 입력하세요.', true);
    return;
  }

  registerSubmitBtn.disabled = true;

  try {
    await TetrisAPI.register(email, password);
    registerForm.reset();
    setMessage(registerMessageEl, '가입 완료! 아래 로그인 폼에서 로그인하세요.');
  } catch (error) {
    setMessage(registerMessageEl, error.message, true);
  } finally {
    registerSubmitBtn.disabled = false;
  }
});

logoutBtn?.addEventListener('click', () => {
  TetrisAPI.logout();
  clearGuestForms();
  updateAuthUI();
  refreshHighScore();
});

async function initAPI() {
  await TetrisAPI.checkBackend();
  updateAuthUI();
  await refreshHighScore();
}

initAPI();

window.TetrisAPI = TetrisAPI;
window.refreshHighScore = refreshHighScore;
