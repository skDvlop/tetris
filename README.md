# Tetris MVP

브라우저에서 바로 실행할 수 있는 간단한 테트리스 게임입니다.

## 프로젝트 위치

```
~/work/kosa-vibecoding-2026-5th/src/exercise/skDev/day02/tetris
```

## 기술 스택

- HTML / CSS / Vanilla JS
- HTML5 Canvas
- 빌드 도구 없음

## 실행 방법

```bash
cd ~/work/kosa-vibecoding-2026-5th/src/exercise/skDev/day02/tetris
python3 -m http.server 8080 --bind 0.0.0.0
```

브라우저에서 [http://localhost:8080](http://localhost:8080) 으로 접속합니다.

WSL에서 Windows 브라우저 접속이 안 되면 터미널의 IP 주소(`hostname -I`)로 `http://<IP>:8080` 에 접속합니다.

## 모바일·반응형 (터치 조작 제외)

- **세로(portrait)**: 보드와 패널 세로 배치, 점수·레벨·상태 2열 그리드
- **가로(landscape)**: 보드와 패널 좌우 배치, 컴팩트 헤더
- **Canvas**: 화면 크기·방향에 맞춰 블록 크기 자동 조절 (`resize` / `orientationchange`)
- **safe-area**: 노치·홈 인디케이터 영역 패딩
- 터치 조작 버튼은 없음 — **키보드(또는 Bluetooth 키보드)** 필요

## 조작

| 키 | 동작 |
|----|------|
| `←` `→` | 좌우 이동 |
| `↓` | 빠르게 내리기 (소프트 드롭) |
| `↑` | 블록 회전 |
| `Space` | 하드 드롭 (바닥까지 즉시 낙하) |
| `Enter` | 재시작 |
| `P` | 일시 정지 / 재개 |

게임 보드 위 **Start** 버튼을 누르면 시작합니다. 사이드 패널 **게임 일시정지** 버튼(또는 `P` 키)으로 멈추고, **게임 재개**로 다시 시작할 수 있습니다.

## MVP 기능

- 7가지 테트로미노 (I, O, T, S, Z, J, L)
- 블록 이동·회전·소프트/하드 드롭·자동 낙하
- 줄 삭제 및 점수 표시 (1줄 100 / 2줄 300 / 3줄 500 / 4줄 800)
- 게임 오버 및 재시작
- Web Audio API 코로베이니키(테트리스) BGM
- **레벨** 시스템: 30초마다 레벨 +1, 레벨이 오를수록 블록 낙하 속도 증가
- **Pause** 버튼(사이드 패널)으로 게임·BGM 일시 정지 / 재개

## 파일 구성

| 파일 | 설명 |
|------|------|
| `index.html` | 페이지 구조 |
| `style.css` | UI 스타일 |
| `game.js` | 게임 로직 |
| `music.js` | Web Audio API BGM (코로베이니키) |
| `PLAN.md` | 구현 계획 |
| `WORKFLOW.md` | 프롬프트·작업 기록 |
| `AGENTS.md` | Agent 작업 규칙 |
| `DEPLOY.md` | GitHub Pages 배포 가이드 (SSH) |

## 문제 해결

**connect failed / 페이지가 열리지 않음**

- HTTP 서버가 실행 중인지 확인합니다.
- 포트 8080이 사용 중이면 기존 프로세스를 종료한 뒤 다시 실행합니다.

```bash
ss -tlnp | grep ':8080'
```
