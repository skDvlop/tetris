# Tetris MVP

브라우저에서 실행하는 테트리스 게임입니다. 로컬에서는 FastAPI 백엔드와 연동해 **이메일 회원가입·로그인**, **플레이 기록 저장**, **전체 최고 점수** 표시를 지원합니다.

## GitHub Pages (정적 전용)

**배포 URL:** [https://skDvlop.github.io/tetris/](https://skDvlop.github.io/tetris/)

- 저장소: [skDvlop/tetris](https://github.com/skDvlop/tetris)
- Pages에는 **정적 파일만** 배포됩니다 (`backend/` 제외).
- Pages에서는 로그인·점수 기록 없이 오프라인 게임만 가능합니다.

## 프로젝트 위치

```
~/work/kosa-vibecoding-2026-5th/src/exercise/skDev/day02/tetris
```

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프론트 | HTML / CSS / Vanilla JS, Canvas |
| 백엔드 | FastAPI, SQLite, JWT |
| Pages | 정적 호스팅 (백엔드 미포함) |

## 실행 방법 (프론트 + 백엔드)

### 1. 백엔드

```bash
cd ~/work/kosa-vibecoding-2026-5th/src/exercise/skDev/day02/tetris/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

API 문서: [http://localhost:8000/docs](http://localhost:8000/docs)

### 2. 프론트

```bash
cd ~/work/kosa-vibecoding-2026-5th/src/exercise/skDev/day02/tetris
python3 -m http.server 8080 --bind 0.0.0.0
```

브라우저: [http://localhost:8080](http://localhost:8080)

백엔드(8000)가 실행 중이면 자동으로 연동됩니다. **이메일 회원가입 후 로그인**해야 게임을 시작할 수 있습니다.

## API 요약

| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | `/api/auth/register` | 이메일 회원가입 |
| POST | `/api/auth/login` | 로그인 (JWT 발급) |
| GET | `/api/auth/me` | 현재 사용자 |
| POST | `/api/plays` | 플레이 기록 저장 (로그인 필요) |
| GET | `/api/scores/high` | 전체 사용자 최고 점수 |

## MVP 기능

- 7가지 테트로미노, 이동·회전·소프트/하드 드롭
- 줄 삭제 및 점수, 30초마다 레벨 상승
- Web Audio BGM, 일시정지, 음악 on/off
- **백엔드 연동**: 이메일 가입·로그인, 게임 오버 시 기록 저장, 전체 최고 점수 표시

## 파일 구성

| 파일 | 설명 |
|------|------|
| `index.html` | 페이지 구조 |
| `style.css` | UI 스타일 |
| `game.js` | 게임 로직 |
| `music.js` | BGM |
| `api.js` | 백엔드 API·인증 |
| `backend/app.py` | FastAPI 서버 |
| `backend/requirements.txt` | Python 의존성 |
| `DEPLOY.md` | GitHub Pages 배포 (백엔드 제외) |
| `WORKFLOW.md` | 프롬프트·작업 기록 |

## 문제 해결

**로그인 패널이 안 보임**

- GitHub Pages에서는 백엔드가 없어 로그인 UI가 숨겨집니다. 로컬에서 백엔드를 8000 포트로 실행하세요.

**CORS / API 연결 실패**

- 프론트는 8080, 백엔드는 8000에서 실행해야 합니다.
