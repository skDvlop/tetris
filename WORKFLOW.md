# Tetris — WORKFLOW

## 프로젝트 위치

```
~/work/kosa-vibecoding-2026-5th/src/exercise/skDev/day02/tetris
```

---

## 2026-08-21 — AGENTS.md 생성

### 프롬프트

```
src/exercise/skDev/day02/tetris 밑에 AGENTS.md 파일을 만들어줘.
```

### 결과 (요약)

- `src/exercise/skDev/day02/tetris/AGENTS.md` 파일을 생성했습니다.
- 상위 `../../AGENTS.md`와 연계한 작업 규칙(프롬프트·결과 기록, 범위, merge 방식 push, 서버 구동)을 반영했습니다.
- 프로젝트 개요·파일 구성·코드 규약 섹션을 두었으며, 구현 진행에 따라 갱신할 수 있도록 초기 템플릿 형태로 작성했습니다.

---

## 2026-08-21 — WORKFLOW.md 기록 규칙 반영

### 프롬프트

```
내용은 다음과 같아.
1) 입력하는 모든 프롬프트와 결과를 WORKFLOW.md 파일에 저장한다.
프롬프트는 원본을 그대로 입력하고 결과는 요약하여 저장한다>
```

### 결과 (요약)

- `AGENTS.md` **작업 규칙 1번**을 수정: 프롬프트·결과 기록 대상을 `WORKFLOW.md`로 변경, 프롬프트는 원본 그대로·결과는 요약하도록 명시.
- `AGENTS.md` 세션 로그 섹션을 제거하고 `WORKFLOW.md` 참조 안내로 대체.
- `WORKFLOW.md` 파일을 생성하고, 기존 AGENTS.md 생성 작업과 이번 작업을 누적 기록.

---

## 2026-08-21 — Git merge 규칙 추가

### 프롬프트

```
2)git 원격에 변경된 내용은 rebase하지 않고 merge 한다.
```

### 결과 (요약)

- `AGENTS.md` **작업 규칙 2번**으로 Git merge 규칙을 명시: 원격 변경은 rebase 없이 merge 처리.
- 기존 GitHub push 규칙(3번)을 2번으로 재번호하고, 작업 범위·서버 구동 규칙 번호를 3·4번으로 조정.

---

## 2026-08-21 — Tetris MVP 구현

### 프롬프트

```
누구나 브라우저에서 바로 실행할 수 있는 간단한 프론트엔드 웹사이트 디자인을 가진 테트리스 어플리케이션을 만들어줘. 고급 기능은 필요 없고 점수 표시, 블록 이동 기능 등 최소한의 기능만 갖춘 MVP 버전이면 충분해.
```

### 프롬프트

```
현재의 계획을 PLAN.md로 저장하고 빌드해줘
```

### 결과 (요약)

- `PLAN.md`에 구현 계획 저장.
- `index.html`, `style.css`, `game.js`로 Canvas 기반 테트리스 MVP 구현 (10×20 보드, 7종 블록, 이동/회전/낙하, 줄 삭제, 점수, 게임 오버/재시작).
- `README.md`에 실행 방법·조작키·MVP 기능 문서화.
- `AGENTS.md` 프로젝트 개요·파일 구성 갱신.
- HTTP 서버(8080)로 동작 확인.

---

## 2026-08-21 — 하드 드롭·BGM·Start 버튼

### 프롬프트

```
스페이스를 누르면 바로 블록이 떨어지는 하드드랍 기능이 없는데 이걸 추가해주고 배경음악이 없어서 허전하니 webaudio api를 사용해서 테트리스의 코로베이니키 테마를 연주하게 해줘. 바로 게임이 시작되는게 아니라 화면에 start 버튼이 있어서 이걸 누르면 시작하게 하자.
```

### 결과 (요약)

- `Space` 키 하드 드롭 추가, `↑` 회전 / `↓` 소프트 드롭으로 조작 분리.
- `music.js` 추가: Web Audio API square wave로 코로베이니키 멜로디 루프 재생 (Start/Restart 클릭 시 시작, 게임 오버 시 정지).
- 캔버스 위 HTML **Start** / **Restart** 오버레이 버튼 추가, idle 상태에서 자동 시작 제거.
- `index.html`, `style.css`, `game.js`, `README.md`, `AGENTS.md` 갱신.

---

## 2026-08-21 — BGM 속도·브루탈리즘 배경·Pause 버튼

### 프롬프트

```
bgm 속도가 너무 빠른데 좀 조정했으면 좋겠고 배경을 브래던스키로 바꿔보자.
멈추는 버튼도 추가해줘
```

### 결과 (요약)

- `music.js`에 `TEMPO_SCALE`(1.85) 적용해 BGM 재생 속도 완화.
- `style.css`를 네오 브루탈리즘 스타일로 변경 (대각 줄무늬 배경, 굵은 검은 테두리, 하드 섀도우, 노란 헤더).
- **Pause / Resume** 버튼 및 `P` 키로 게임·BGM 일시 정지/재개 추가.
- `index.html`, `game.js`, `README.md` 갱신.

---

## 2026-08-21 — 게임 보드 일시정지 버튼

### 프롬프트

```
게임에 대한 일시정지 버튼도 만들어줘
```

### 결과 (요약)

- 게임 보드 우측 상단 **Pause** 버튼 추가 (플레이 중 표시).
- 일시정지 시 보드 위 **Resume** 오버레이 버튼 표시.
- 사이드 패널 버튼 문구를 `게임 일시정지` / `게임 재개`로 명확화, 보드·패널·`P` 키 연동.

---

## 2026-08-21 — 보드 위 일시정지 버튼 제거

### 프롬프트

```
일시정지 버튼이 테트리스 판 위에 뜨는게 게임에 방해되는거 같아
```

### 결과 (요약)

- 게임 보드 위 Pause 버튼 및 Resume 오버레이 제거.
- 일시정지/재개는 사이드 패널 **게임 일시정지** 버튼과 `P` 키로만 조작.
- 일시정지 시 보드 오버레이 없이 상태 패널에 `일시 정지` 표시.

---

## 2026-08-21 — 레벨·속도 증가

### 프롬프트

```
시간이 흐르면서 점점 레벨이 오르고, 그에 따라 게임속도가 빨라지도록 해줘. 레벨도 게임 화면에 보여줘. 30초가 지날때마다 레벨이 하나가 오르는 걸로 해줘.
```

### 결과 (요약)

- 30초마다 레벨 +1 (일시정지 시간은 제외).
- 레벨에 따라 낙하 간격 단축 (Lv1 800ms → 레벨당 55ms 감소, 최소 120ms).
- 사이드 패널에 **레벨** 표시 추가.
- `game.js`, `index.html`, `style.css`, `README.md` 갱신.

---

## 2026-08-21 — 모바일 반응형 (터치 제외)

### 프롬프트

```
터치를 제외하고 나머지만 적용해줘
```

### 결과 (요약)

- Canvas 뷰포트 기반 동적 크기 조절 (`resizeCanvas`, `visualViewport` 대응).
- 세로: 2열 패널 그리드 / 가로: 좌우 배치·컴팩트 UI.
- safe-area 패딩, overflow 방지, 오버레이 글자 크기 스케일.
- 터치 조작 버튼은 추가하지 않음.

---

## 2026-08-21 — GitHub Pages 배포 가이드 (DEPLOY.md)

### 프롬프트

```
이 테트리스 게임을 github pages로 배포할 건데 github 계정은 가지고 있어. 아직 repo는 만들어지지 않았는데 repo 생성부터 배포까지 어떻게 해야하늕 정리해서 DEPLOY.md 파일로 저장해줘. 참고로 git 인증은 ssh로 하고 있으니 git 작업은 ssh 인증 기준으로 정리해줘
```

### 결과 (요약)

- `DEPLOY.md` 작성: SSH 기준 repo 생성 → 파일 복사 → init/commit/push → Pages 설정 → URL 확인 → 재배포·문제 해결.
- Pages 전용 repo 분리 방식 권장, `git@github.com:{github-id}/tetris.git` remote 예시 포함.
- `README.md` 파일 구성에 `DEPLOY.md` 링크 추가.

---

## 2026-08-21 — DEPLOY.md monorepo(skDvlop/tetris) 기준 정리

### 프롬프트

```
공용 repo 사용방법을 제거하고, 내 github 계정은 skDvlop이고 생성할 repo 이름은 tetris로 해서 DEPLOY.md 를 모노 repo 기준으로 정리해줘
```

### 결과 (요약)

- `DEPLOY.md`를 `skDvlop/tetris` 단일 repo(monorepo) + SSH + GitHub Pages 기준으로 재작성.
- 공용 실습 repo 복사·`tetris-pages` 분리 방식·`{github-id}` placeholder 제거.
- 로컬 작업 경로 `~/work/tetris`, Pages URL `https://skDvlop.github.io/tetris/` 명시.

---

## 2026-08-21 — GitHub Pages 배포 실행 (skDvlop/tetris)

### 프롬프트

```
지금 만든 테트리스 게임을 github 페이지에 올릴 수 있게 cmd agent에서 진행하고 싶어
```

### 결과 (요약)

- `~/work/tetris` 로컬 repo 생성, 게임 파일 9개 복사 후 `git@github.com:skDvlop/tetris.git`에 push 완료.
- GitHub Actions `deploy-pages.yml` 워크플로 추가·push (Pages 미활성화로 첫 실행 실패 — Settings에서 Pages 활성화 필요).
- **남은 1단계(수동)**: GitHub → skDvlop/tetris → Settings → Pages → `main` / root (또는 GitHub Actions) 활성화.

---

## 2026-08-21 — README Pages URL 및 commit/push

### 프롬프트

```
README.md 파일에 github pages 주소를 기록하고 commit log에도 github pages 주소를 넣어줘. 지금까지 수정된 모든 파일들을 commit & push해줘
```

### 결과 (요약)

- `README.md`에 GitHub Pages URL `https://skDvlop.github.io/tetris/` 추가.
- `DEPLOY.md`, `WORKFLOW.md` 등 미커밋 변경분을 `kosa-vibecoding-2026-5th`에 commit & push.
- 배포 repo(`~/work/tetris`) README·WORKFLOW 동기화 후 push.
