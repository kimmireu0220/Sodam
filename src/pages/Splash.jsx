/**
 * Splash Page
 * 
 * 역할: 앱의 첫 화면으로 로고와 시작하기 버튼을 제공합니다.
 * 
 * 입력:
 * - onStart: 시작하기 버튼 클릭 시 호출되는 콜백 함수
 * 
 * 출력:
 * - 앱 로고
 * - 시작하기 버튼
 * - 자동 전환 (2초 후)
 * 
 * 향후 연동 지점:
 * - 사용자 인증 상태 확인
 * - 온보딩 플로우 연동
 * - 앱 초기화 로직
 */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/sodam-logo.png';

const Splash = ({ onStart }) => {
  const navigate = useNavigate();

  // 자동 전환 기능 제거 - 사용자가 직접 버튼을 눌러야만 이동
  // useEffect(() => {
  //   // 2초 후 자동으로 홈으로 이동
  //   const timer = setTimeout(() => {
  //     navigate('/home');
  //   }, 2000);

  //   return () => clearTimeout(timer);
  // }, [navigate]);

  const handleStartClick = () => {
    navigate('/home');
    if (onStart) onStart();
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--background)',
        padding: 'var(--spacing-xl)',
        gap: 'var(--spacing-xl)'
      }}
    >
      {/* 로고 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--spacing-lg)',
          animation: 'fadeInUp 1s ease'
        }}
      >
        <img
          src={logo}
          alt="소담 로고"
          style={{
            width: '280px',
            height: 'auto',
            filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))'
          }}
        />
        
        <p
          style={{
            fontSize: 'var(--font-size-lg)',
            color: 'var(--text-secondary)',
            textAlign: 'center',
            margin: 0,
            lineHeight: '1.6'
          }}
        >
          손으로 전하는 소중한 이야기
        </p>
      </div>

      {/* 시작하기 버튼 */}
      <button
        onClick={handleStartClick}
        className="btn btn-primary"
        style={{
          fontSize: 'var(--font-size-xl)',
          padding: 'var(--spacing-lg) var(--spacing-xl)',
          minWidth: '200px',
          animation: 'fadeInUp 1s ease 0.5s both'
        }}
        aria-label="앱 시작하기"
      >
        시작하기
      </button>

      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default Splash;
