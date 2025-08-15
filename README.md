# Sodam (소담)

**손으로 전하는 소중한 이야기**

Sodam은 수화 통역 서비스의 사용자 경험을 시연하기 위한 React 기반 프로토타입 앱입니다. 음성과 텍스트를 수화로 변환하는 기능을 제공하여, 청각 장애인과의 소통을 돕는 대화 보조 도구입니다.

## 🌟 주요 기능

### 🎤 음성-수화 변환 (Translate 페이지)
- **실시간 음성 인식**: react-speech-recognition을 활용한 정확한 STT
- 상태별 시각적 피드백 (듣는 중, 분석 중, 준비 완료)
- 친근한 곰 캐릭터를 통한 직관적인 인터페이스
- 마이크 버튼을 통한 간편한 음성 입력
- 자동 텍스트 변환 및 수화 표시

### ✏️ 텍스트 입력 및 음성 출력 (Speak 페이지)
- 직접 텍스트 입력을 통한 메시지 작성
- 자주 사용하는 문구 빠른 선택 기능 (12개 기본 문구 제공)
- 큰 글자로 메시지 표시 (BigTextCard 모달)
- **TTS(Text-to-Speech)**: 한국어 음성 합성 지원
- Enter 키 또는 전송 버튼으로 간편한 입력

### 👤 마이페이지 (MyPage)
- **사용 통계**: 앱 사용 빈도 및 패턴 분석
- **맞춤 상용구 관리**: 개인화된 문구 추가/수정/삭제
- **사용자 데이터**: 로컬 스토리지 기반 데이터 관리
- 앱 사용 내역 및 선호도 추적

### 🏠 홈 화면
- 주요 기능으로의 빠른 접근
- 사용자 친화적인 네비게이션
- 하단 네비게이션 바를 통한 쉬운 페이지 이동
- 앱 소개 및 기능 안내

## 🛠️ 기술 스택

- **Frontend**: React 18.2.0
- **Routing**: React Router DOM 6.20.0 (HashRouter)
- **Speech Recognition**: react-speech-recognition 4.0.1
- **Runtime**: regenerator-runtime 0.14.1
- **Build Tool**: Vite 4.5.0
- **Deployment**: GitHub Pages (gh-pages)
- **Language**: JavaScript (JSX)
- **Styling**: CSS3
- **Browser APIs**: Web Speech API (STT/TTS)

## 📁 프로젝트 구조

```
src/
├── components/              # 재사용 가능한 컴포넌트
│   ├── AvatarCard.jsx       # 아바타 카드 컴포넌트
│   ├── BigTextCard.jsx      # 큰 텍스트 표시 모달 카드
│   ├── BottomNav.jsx        # 하단 네비게이션 바
│   ├── CustomPhrasesSection.jsx # 맞춤 상용구 관리 섹션
│   ├── Header.jsx           # 헤더 컴포넌트
│   ├── MicButton.jsx        # 마이크 버튼 (음성 인식)
│   ├── QuickPhrases.jsx     # 빠른 문구 선택 컴포넌트
│   ├── SpeechBubble.jsx     # 말풍선 컴포넌트
│   ├── StatisticsSection.jsx # 사용 통계 표시 섹션
│   └── TurnLight.jsx        # 음성 인식 상태 표시등
├── pages/                   # 페이지 컴포넌트
│   ├── Splash.jsx           # 스플래시/시작 화면
│   ├── Home.jsx             # 홈 화면
│   ├── Speak.jsx            # 텍스트 입력 및 음성 출력
│   ├── Translate.jsx        # 음성 인식 및 수화 변환
│   ├── MyPage.jsx           # 마이페이지 (통계, 맞춤 상용구)
│   └── About.jsx            # 앱 정보 페이지
├── utils/                   # 유틸리티 서비스
│   ├── tts.js              # TTS (Text-to-Speech) 서비스
│   ├── stt.js              # STT (Speech-to-Text) 서비스
│   ├── statistics.js       # 사용 통계 관리 서비스
│   └── storage.js          # 로컬 스토리지 관리 서비스
├── data/                    # 정적 데이터
│   └── phrases.json        # 기본 상용구 목록 (12개)
└── assets/                  # 이미지 및 아이콘
    ├── bear-*.png          # 곰 캐릭터 상태별 이미지
    ├── *-icon.png          # 네비게이션 아이콘들
    └── sodam-logo.png      # 앱 로고
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

### 🎤 음성 인식 및 수화 변환 (Translate 페이지)
1. 하단 네비게이션에서 🌐 버튼 클릭
2. 마이크 버튼을 눌러 음성 입력 시작
3. 말하기 완료 후 자동으로 텍스트 변환
4. 변환된 텍스트가 수화 형태로 표시

### ✏️ 텍스트 입력 및 음성 출력 (Speak 페이지)
1. 하단 네비게이션에서 🎤 버튼 클릭
2. 텍스트 입력창에 원하는 문장 입력 또는 Enter 키 사용
3. 빠른 문구 선택에서 미리 정의된 문구 클릭
4. 전송 버튼으로 큰 화면에 텍스트 표시
5. TTS 기능으로 음성 출력 가능

### 👤 마이페이지 사용
1. 하단 네비게이션에서 👤 버튼 클릭
2. 사용 통계 확인 (앱 사용 빈도, 자주 사용하는 문구)
3. 맞춤 상용구 추가/수정/삭제
4. 개인화된 설정 관리

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

### 상용구 관리
- **기본 상용구**: `src/data/phrases.json` 파일에서 기본 제공 문구를 수정하거나 추가
- **맞춤 상용구**: `CustomPhrasesSection` 컴포넌트와 `storage.js`를 통한 사용자별 관리

### 유틸리티 서비스 확장
- **TTS 설정**: `src/utils/tts.js`에서 음성 옵션 및 언어 설정 수정
- **STT 설정**: `src/utils/stt.js`에서 음성 인식 옵션 조정
- **통계 추가**: `src/utils/statistics.js`에서 새로운 통계 항목 추가
- **데이터 저장**: `src/utils/storage.js`에서 로컬 스토리지 관리 확장

### 라우팅 추가
HashRouter를 사용하므로 GitHub Pages 배포에 적합하며, 새 페이지는 `App.jsx`에서 Route 추가가 필요합니다.

## 🌐 브라우저 지원

### 기본 기능 지원
- **Chrome 88+** (권장): 완전한 Web Speech API 지원
- **Safari 14+**: TTS 지원, STT 제한적 지원
- **Firefox 85+**: TTS 지원, STT 미지원
- **Edge 88+**: Chrome과 동일한 수준 지원

### Web Speech API 기능별 지원
- **TTS (Text-to-Speech)**: 모든 지원 브라우저에서 사용 가능
- **STT (Speech-to-Text)**: Chrome, Edge에서 완전 지원
- **한국어 음성**: 브라우저별 음성팩 설치 상태에 따라 다름

**권장사항**: 최적의 경험을 위해 Chrome 브라우저 사용을 권장합니다.

## 📄 라이선스

이 프로젝트는 교육 및 연구 목적으로 개발되었습니다.

---

**Sodam Team** | 2025년 8월

*더 나은 소통을 위한 첫걸음, Sodam과 함께하세요.*
