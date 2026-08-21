# Tetris MVP 웹 앱 구현 계획

## 목표

`src/exercise/skDev/day02/tetris`에 **순수 HTML / CSS / Vanilla JS** 테트리스 MVP를 만듭니다. npm·빌드 단계 없이 `python3 -m http.server`로 열면 바로 플레이할 수 있게 합니다.

## 기술 선택

| 항목 | 결정 |
|------|------|
| 렌더링 | HTML5 **Canvas** (격자·블록 그리기에 적합) |
| 보드 | 10열 × 20행 (표준 테트리스) |
| 파일 구성 | `index.html`, `style.css`, `game.js` (MVP 규모는 단일 JS로 충분) |
| 실행 | day01 markdown_editor와 동일하게 포트 **8080** HTTP 서버 |

## MVP 기능 범위

**포함**

- 7가지 테트로미노(I, O, T, S, Z, J, L) 랜덤 생성
- 키보드 조작: ← → 이동, ↓ 소프트 드롭, ↑ 또는 Space 회전, Enter 또는 버튼으로 **시작/재시작**
- 자동 낙하(고정 간격 gravity)
- 바닥·벽·고정 블록 **충돌 검사**
- 가득 찬 줄 **삭제**
- **점수** 표시 (1줄 100점, 2줄 300점, 3줄 500점, 4줄 800점)
- **게임 오버** (새 블록 스폰 불가 시) 및 재시작
- 간단한 **웹사이트형 UI**: 헤더, 게임 보드, 점수 패널, 조작 안내

**제외 (고급 기능)**

- Hold, 고스트 피스, 레벨/속도 증가, 사운드, localStorage 최고 점수, 터치 조작

## UI 레이아웃

- `lang="ko"`, 헤더 + 메인 구조
- CSS 변수로 다크 톤 배경 + 블록별 색상, 카드형 사이드 패널
- 768px 이하에서는 세로 배치(반응형)

## 게임 로직 (`game.js`)

상태: Idle → Playing → GameOver → Playing(restart)

핵심 모듈(한 파일 내 섹션으로 구분):

1. **상수** — 보드 크기, 색상, 테트로미노 shape/색 정의
2. **Board** — 2D 배열, `isValid`, `lockPiece`, `clearLines`
3. **Piece** — 현재 블록 위치·회전 상태, `move`, `rotate`
4. **Game loop** — `requestAnimationFrame` + 낙하 타이머
5. **Render** — 격자, 고정 블록, 현재 블록, 게임 오버 오버레이
6. **Input** — `keydown` 리스너, Idle/Playing/GameOver 상태별 처리

## 생성·수정 파일

| 파일 | 내용 |
|------|------|
| `index.html` | 페이지 구조, canvas, 점수·상태·재시작 UI |
| `style.css` | 레이아웃, 타이포, 보드·패널 스타일 |
| `game.js` | 전체 게임 로직 |
| `README.md` | 실행 방법, 조작키, MVP 기능 설명 |
| `WORKFLOW.md` | 프롬프트 원본 + 결과 요약 |
| `AGENTS.md` | 프로젝트 개요·파일 구성 표 갱신 |

## 검증 방법

1. `cd src/exercise/skDev/day02/tetris && python3 -m http.server 8080 --bind 0.0.0.0`
2. `curl -s -o /dev/null -w '%{http_code}\n' http://localhost:8080/` → 200 확인
3. 브라우저에서: 시작 → 이동/회전/낙하 → 줄 삭제 시 점수 증가 → 게임 오버 → 재시작

## 커밋·push

사용자 요청 시에만 커밋/push. push 시 `git pull origin main --no-rebase` 후 merge 방식으로 동기화.
