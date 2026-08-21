# AGENTS.md — tetris

이 폴더(`src/exercise/skDev/day02/tetris`)에서 작업하는 Cursor Agent를 위한 안내입니다.
범위는 **이 디렉터리 하나**이며, 다른 수강생 폴더·공용 파일(`doc/`, 루트 README 등)은 요청 없이 수정하지 않습니다.

상위 작업 규칙·GitHub 동기화·세션 로그 누적은 [`../../AGENTS.md`](../../AGENTS.md)를 함께 따릅니다.

---

## 작업 규칙

### 1. 프롬프트·결과 기록 (`WORKFLOW.md`)

- 입력하는 **모든** 프롬프트와 그 결과를 **`WORKFLOW.md`** 에 저장합니다.
- **프롬프트**: 사용자가 입력한 내용을 **원본 그대로** 기록합니다.
- **결과**: Agent가 수행한 작업을 **요약**하여 기록합니다 (생성·수정 파일, 핵심 결정, 테스트/커밋 여부 등).
- **설치·실행·게임 조작법** 등 프로젝트 상세는 `README.md`에 작성하고, AGENTS.md·WORKFLOW.md에서는 **README.md를 참고**하도록 안내합니다 (중복 기록하지 않음).

### 2. Git 원격 동기화 (merge, rebase 금지)

- Git 원격에 변경된 내용은 **rebase하지 않고 merge** 합니다.
- 원격과 동기화할 때 **rebase를 사용하지 않고 merge로 처리**합니다.

```bash
cd ~/work/kosa-vibecoding-2026-5th

# 1) 원격 최신 변경을 merge로 가져오기
git pull origin main --no-rebase

# 2) 충돌 없으면 push
git push origin main
```

**하지 않을 것**

```bash
git pull --rebase origin main   # ❌ rebase 금지
git pull --rebase               # ❌ rebase 금지
```

- 커밋·push는 사용자가 요청했을 때만 수행합니다.
- push 대상: `weable-kosa/kosa-vibecoding-2026-5th` 저장소 `main` 브랜치, 경로 `src/exercise/skDev/`.

### 3. 작업 범위

- 실습 파일은 `src/exercise/skDev/day02/tetris/` 안에서만 생성·수정합니다.
- 상위 `skDev/AGENTS.md`의 day02·다른 프로젝트 기록은 이 파일에서 중복하지 않습니다.

### 4. 서버 구동 규칙

정적 파일(HTML/CSS/JS)로 구현하는 경우, 실행이 필요할 때 아래 순서를 따릅니다.

1. **포트 점검** — 사용할 포트에 서버가 이미 떠 있는지 확인합니다.
   ```bash
   ss -tlnp | grep -E ':8080|:5500'
   ```
2. **기존 서버 종료** — 해당 포트가 사용 중이면 먼저 종료한 뒤 새로 실행합니다.
3. **서버 실행** — `README.md`의 실행 방법을 따릅니다.
4. **동작 확인** — `curl` 등으로 HTTP 응답(200 등)을 확인합니다.
5. **사용자 안내** — 접속 URL, 필요한 터미널 개수, 서버 종료 시 connection fail 발생 등을 알려줍니다.

> 서버를 임의로 실행하지 않습니다. 사용자가 요청했거나, 프로젝트 완료 후 실행·확인이 필요한 경우에만 구동합니다.

---

## 프로젝트 개요

**경로:** `src/exercise/skDev/day02/tetris`

| 항목 | 내용 |
|------|------|
| 프로젝트 | 테트리스 게임 (MVP) |
| 상태 | 구현 완료 |
| 기술 스택 | HTML / CSS / Vanilla JS, Canvas |
| 실행 방법 | [`README.md`](README.md) 참고 (포트 8080) |

---

## 파일 구성

| 파일 | 역할 |
|------|------|
| `index.html` | 페이지 구조, Canvas, 점수·상태 UI |
| `style.css` | 다크 톤 레이아웃·패널 스타일 |
| `game.js` | 보드, 블록, 입력, 렌더링, 게임 루프 |
| `music.js` | Web Audio API 코로베이니키 BGM |
| `README.md` | 설치·실행·조작법 |
| `PLAN.md` | 구현 계획 |
| `AGENTS.md` | Agent 작업 규칙 (이 파일) |
| `WORKFLOW.md` | **모든** 프롬프트(원본)와 결과(요약) 누적 기록 |

---

## 코드 규약

- **주석과 문서는 한국어**로 작성합니다.
- **빌드 도구·프레임워크 없이** 순수 HTML/CSS/Vanilla JS로 구현하는 것을 기본으로 합니다 (요구사항 변경 시 이 섹션 갱신).
- **작업 범위를 벗어난 리팩터링·과도한 추상화**는 하지 않습니다.
- 게임 로직(보드, 블록, 회전, 줄 삭제, 점수, 게임 오버)은 **역할별로 파일을 분리**하되, 불필요한 레이어는 추가하지 않습니다.

---

## 기록 위치

프롬프트·결과의 누적 기록은 [`WORKFLOW.md`](WORKFLOW.md)를 참고합니다.
