# Tetris — GitHub Pages 배포 가이드

`skDvlop/tetris` **단일 저장소(monorepo)** 에 테트리스 프로젝트를 두고 **GitHub Pages**로 배포하는 방법입니다.  
Git 인증은 **SSH** 기준입니다.

| 항목 | 값 |
|------|-----|
| GitHub 계정 | `skDvlop` |
| 저장소 이름 | `tetris` |
| SSH remote | `git@github.com:skDvlop/tetris.git` |
| Pages URL | `https://skDvlop.github.io/tetris/` |

정적 파일(`index.html`, `style.css`, `game.js`, `music.js`)만 repo **루트**에 있으면 빌드 없이 배포됩니다.

---

## 1. 사전 준비

### SSH 키 등록 확인

```bash
ssh -T git@github.com
```

성공 예시:

```text
Hi skDvlop! You've successfully authenticated, but GitHub does not provide shell access.
```

등록이 안 되어 있다면 GitHub → **Settings → SSH and GPG keys**에서 공개키를 추가합니다.

### (선택) GitHub CLI

```bash
gh auth status
```

---

## 2. GitHub 저장소 생성

아직 `skDvlop/tetris` repo가 없다면 생성합니다.

### 방법 A — GitHub 웹 UI

1. [https://github.com/new](https://github.com/new) 접속
2. **Repository name**: `tetris`
3. **Public** 선택
4. **Add a README file** 등은 **체크하지 않음**
5. **Create repository**

### 방법 B — GitHub CLI

```bash
gh repo create skDvlop/tetris --public --description "Tetris MVP - GitHub Pages"
```

---

## 3. 로컬 monorepo 준비

로컬 작업 디렉터리 = 배포 repo 루트입니다. 별도 복사용 폴더는 두지 않습니다.

```bash
mkdir -p ~/work/tetris
cd ~/work/tetris
```

프로젝트 파일 구조 (repo root):

```text
tetris/
├── index.html      # 필수 — Pages 진입점
├── style.css       # 필수
├── game.js         # 필수
├── music.js        # 필수
├── README.md       # 선택
├── DEPLOY.md       # 이 문서
├── WORKFLOW.md     # 선택
├── AGENTS.md       # 선택
└── PLAN.md         # 선택
```

GitHub Pages 동작에 **필수**인 파일은 `index.html`, `style.css`, `game.js`, `music.js` 네 개입니다.

---

## 4. Git 초기화 및 SSH remote

```bash
cd ~/work/tetris

git init
git branch -M main
git remote add origin git@github.com:skDvlop/tetris.git

git add index.html style.css game.js music.js README.md DEPLOY.md
git commit -m "Initial commit: Tetris MVP for GitHub Pages"
```

이미 clone한 repo라면 remote만 SSH로 맞춥니다.

```bash
git remote set-url origin git@github.com:skDvlop/tetris.git
git remote -v
```

---

## 5. push

```bash
git push -u origin main
```

원격에 새 커밋이 있으면 **rebase 없이 merge**:

```bash
git pull origin main --no-rebase
git push origin main
```

---

## 6. GitHub Pages 활성화

### 웹 UI

1. [https://github.com/skDvlop/tetris](https://github.com/skDvlop/tetris) → **Settings → Pages**
2. **Build and deployment**
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` / **`/ (root)`**
3. **Save**

1~2분 후 배포 URL이 표시됩니다.

> **Agent 배포 시 참고:** 코드 push만으로는 Pages가 켜지지 않습니다. 최초 1회 아래 설정을 GitHub 웹에서 직접 저장해야 합니다.  
> [https://github.com/skDvlop/tetris/settings/pages](https://github.com/skDvlop/tetris/settings/pages)

### GitHub CLI

```bash
gh api repos/skDvlop/tetris/pages \
  -X POST \
  -f source[branch]=main \
  -f source[path]=/
```

---

## 7. 접속 URL

```text
https://skDvlop.github.io/tetris/
```

배포 확인:

```bash
curl -s -o /dev/null -w '%{http_code}\n' https://skDvlop.github.io/tetris/
```

`200`이면 정상입니다.

---

## 8. 수정 후 재배포

같은 repo(`~/work/tetris`)에서 수정 → commit → push:

```bash
cd ~/work/tetris
git add .
git commit -m "Update game"
git pull origin main --no-rebase   # 필요 시
git push origin main
```

`main` 브랜치 root에 push하면 GitHub Pages가 자동 재배포됩니다. (보통 1~3분)

---

## 9. 문제 해결

### `Permission denied (publickey)`

- SSH 키 미등록 또는 ssh-agent 미적용 → `ssh -T git@github.com` 재확인

### `Repository not found`

- remote URL: `git@github.com:skDvlop/tetris.git` 확인
- repo가 `skDvlop` 계정에 생성되었는지 확인

### Pages 404

- Settings → Pages: branch `main`, folder `/ (root)`
- repo root에 `index.html` 존재 여부
- 첫 배포 후 1~3분 대기

### BGM이 안 나올 때

- Web Audio API는 **Start** 버튼 클릭(사용자 제스처) 후 재생됩니다.

---

## 10. 체크리스트

- [ ] `skDvlop/tetris` repo 생성 (Public)
- [ ] `~/work/tetris`에 게임 파일 배치 (repo root)
- [ ] `git@github.com:skDvlop/tetris.git` SSH remote 설정
- [ ] `main` 브랜치 push
- [ ] Settings → Pages → `main` / root
- [ ] [https://skDvlop.github.io/tetris/](https://skDvlop.github.io/tetris/) 접속 확인

---

## 참고

- 로컬 실행: [`README.md`](README.md)
- 작업 기록: [`WORKFLOW.md`](WORKFLOW.md)
