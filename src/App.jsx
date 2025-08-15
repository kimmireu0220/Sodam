/**
 * App Component
 * 
 * 역할: 앱의 메인 컴포넌트로 라우팅과 전역 상태를 관리합니다.
 * 
 * 입력:
 * - 없음
 * 
 * 출력:
 * - 라우팅 설정
 * - 토스트 메시지
 * - 전역 스타일
 * 
 * 향후 연동 지점:
 * - 전역 상태 관리 (Redux/Zustand)
 * - 사용자 인증 상태
 * - 테마 설정
 */
import { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Splash from './pages/Splash';
import Home from './pages/Home';
import Translate from './pages/Translate';
import Speak from './pages/Speak';
import About from './pages/About';
import MyPage from './pages/MyPage';
import './styles.css';

const App = () => {
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Splash onStart={() => showToast('소담에 오신 것을 환영합니다!')} />} />
          <Route path="/home" element={<Home onNavigate={showToast} />} />
          <Route path="/translate" element={<Translate onNavigate={showToast} />} />
          <Route path="/speak" element={<Speak onNavigate={showToast} />} />
          <Route path="/about" element={<About onNavigate={showToast} />} />
          <Route path="/mypage" element={<MyPage onNavigate={showToast} />} />
        </Routes>

        {/* 토스트 메시지 */}
        {toast && (
          <div className="toast">
            {toast}
          </div>
        )}
      </div>
    </Router>
  );
};

export default App;
