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
    const data = await this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.saveSession(data.access_token, data.email);
    return data;
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
const authForm = document.getElementById('auth-form');
const authEmailInput = document.getElementById('auth-email');
const authPasswordInput = document.getElementById('auth-password');
const authSubmitBtn = document.getElementById('auth-submit');
const authToggleBtn = document.getElementById('auth-toggle-mode');
const authMessageEl = document.getElementById('auth-message');
const authLoggedInEl = document.getElementById('auth-logged-in');
const authUserEmailEl = document.getElementById('auth-user-email');
const logoutBtn = document.getElementById('logout-btn');
const highScoreEl = document.getElementById('high-score');
const highScoreMetaEl = document.getElementById('high-score-meta');

let authMode = 'login';

function setAuthMessage(text, isError = false) {
  if (!authMessageEl) return;
  authMessageEl.textContent = text;
  authMessageEl.classList.toggle('auth-message--error', isError);
}

function updateAuthUI() {
  const backend = TetrisAPI.isBackendMode();
  if (!authSection) return;

  authSection.hidden = !backend;

  if (!backend) return;

  const loggedIn = TetrisAPI.isLoggedIn();
  authForm.hidden = loggedIn;
  authLoggedInEl.hidden = !loggedIn;

  if (loggedIn) {
    authUserEmailEl.textContent = TetrisAPI.email || '';
  } else {
    authSubmitBtn.textContent = authMode === 'login' ? '로그인' : '회원가입';
    authToggleBtn.textContent = authMode === 'login' ? '회원가입' : '로그인';
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

authToggleBtn?.addEventListener('click', () => {
  authMode = authMode === 'login' ? 'register' : 'login';
  setAuthMessage('');
  updateAuthUI();
});

authForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  setAuthMessage('');

  const email = authEmailInput.value.trim();
  const password = authPasswordInput.value;

  if (!email || !password) {
    setAuthMessage('이메일과 비밀번호를 입력하세요.', true);
    return;
  }

  authSubmitBtn.disabled = true;

  try {
    if (authMode === 'register') {
      await TetrisAPI.register(email, password);
      setAuthMessage('회원가입 완료!');
    } else {
      await TetrisAPI.login(email, password);
      setAuthMessage('로그인 완료!');
    }
    authPasswordInput.value = '';
    updateAuthUI();
    await refreshHighScore();
  } catch (error) {
    setAuthMessage(error.message, true);
  } finally {
    authSubmitBtn.disabled = false;
  }
});

logoutBtn?.addEventListener('click', () => {
  TetrisAPI.logout();
  setAuthMessage('');
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
