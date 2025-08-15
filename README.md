# Sodam (소담)

**손으로 전하는 소중한 이야기**

Sodam은 수화 통역 서비스의 사용자 경험을 시연하기 위한 React 기반 프로토타입 앱입니다. 음성과 텍스트를 수화로 변환하는 기능을 제공하여, 청각 장애인과의 소통을 돕는 대화 보조 도구입니다.

## 🌟 주요 기능

### 🎤 음성-수화 변환 (Speak 페이지)
- 실시간 음성 인식 및 수화 변환
- 상태별 시각적 피드백 (듣는 중, 분석 중, 준비 완료)
- 친근한 곰 캐릭터를 통한 직관적인 인터페이스
- 마이크 버튼을 통한 간편한 음성 입력

### ✏️ 텍스트-수화 변환 (Translate 페이지)
- 직접 텍스트 입력을 통한 수화 변환
- 자주 사용하는 문구 빠른 선택 기능 (12개 기본 문구 제공)
- 큰 글자로 메시지 표시
- TTS(Text-to-Speech) 기능으로 음성 출력 지원

### 🏠 홈 화면
- 주요 기능으로의 빠른 접근
- 사용자 친화적인 네비게이션
- 하단 네비게이션 바를 통한 쉬운 페이지 이동

## 🛠️ 기술 스택

- **Frontend**: React 18.2.0
- **Routing**: React Router DOM 6.20.0
- **Build Tool**: Vite 4.5.0
- **Deployment**: GitHub Pages
- **Language**: JavaScript (JSX)
- **Styling**: CSS3

## 📁 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── AvatarCard.jsx   # 아바타 카드 컴포넌트
│   ├── BigTextCard.jsx  # 큰 텍스트 표시 카드
│   ├── BottomNav.jsx    # 하단 네비게이션
│   ├── Header.jsx       # 헤더 컴포넌트
│   ├── MicButton.jsx    # 마이크 버튼
│   ├── QuickPhrases.jsx # 빠른 문구 선택
│   ├── SpeechBubble.jsx # 말풍선 컴포넌트
│   └── TurnLight.jsx    # 상태 표시등
├── pages/               # 페이지 컴포넌트
│   ├── Splash.jsx       # 스플래시 화면
│   ├── Home.jsx         # 홈 화면
│   ├── Speak.jsx        # 음성-수화 변환
│   ├── Translate.jsx    # 텍스트-수화 변환
│   └── About.jsx        # 정보 페이지
├── utils/               # 유틸리티 함수
│   └── tts.js          # TTS 서비스
├── data/                # 정적 데이터
│   └── phrases.json    # 기본 문구 목록
└── assets/              # 이미지 및 아이콘
```

## 🚀 시작하기

### 필수 요구사항
- Node.js 16.0.0 이상
- npm 또는 yarn

### 설치 및 실행

1. **저장소 클론**
   ```bash
   git clone [repository-url]
   cd Sodam
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **개발 서버 실행**
   ```bash
   npm run dev
   ```

4. **브라우저에서 확인**
   ```
   http://localhost:5173
   ```

### 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview

# GitHub Pages 배포
npm run deploy
```

## 📱 사용법

### 음성-수화 변환
1. 하단 네비게이션에서 🎤 버튼 클릭
2. 마이크 버튼을 눌러 음성 입력 시작
3. 말하기 완료 후 자동으로 수화 변환 결과 확인

### 텍스트-수화 변환
1. 하단 네비게이션에서 ✏️ 버튼 클릭
2. 텍스트 입력창에 원하는 문장 입력
3. 또는 빠른 문구 선택에서 미리 정의된 문구 클릭
4. 변환 버튼을 눌러 수화로 변환

## 🎨 디자인 특징

- **친근한 UI**: 곰 캐릭터를 활용한 따뜻한 인터페이스
- **직관적 네비게이션**: 하단 탭 바를 통한 쉬운 페이지 이동
- **접근성 고려**: 큰 글씨와 명확한 시각적 피드백
- **반응형 디자인**: 다양한 화면 크기에 대응

## 🔧 개발 가이드

### 컴포넌트 추가
새로운 컴포넌트는 `src/components/` 디렉토리에 추가하고, 필요한 경우 `src/pages/`에 페이지로 구성합니다.

### 스타일 수정
전역 스타일은 `src/styles.css`에서 관리하며, 컴포넌트별 스타일은 각 컴포넌트 파일 내에서 처리합니다.

### 문구 추가
`src/data/phrases.json` 파일에서 기본 제공 문구를 수정하거나 추가할 수 있습니다.

## 🌐 브라우저 지원

- Chrome 88+
- Safari 14+
- Firefox 85+
- Edge 88+

**참고**: TTS 기능은 브라우저의 Web Speech API 지원 여부에 따라 동작이 달라질 수 있습니다.

## 📄 라이선스

이 프로젝트는 교육 및 연구 목적으로 개발되었습니다.

---

**Sodam Team** | 2025년 1월

*더 나은 소통을 위한 첫걸음, Sodam과 함께하세요.*
