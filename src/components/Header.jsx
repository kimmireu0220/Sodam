/**
 * Header Component
 * 
 * 역할: 앱의 상단 헤더를 표시하며, 로고와 네비게이션 메뉴를 제공합니다.
 * 
 * 입력:
 * - onMenuClick: 햄버거 메뉴 클릭 시 호출되는 콜백 함수
 * 
 * 출력:
 * - 로고 표시
 * - 햄버거 메뉴 버튼
 * 
 * 향후 연동 지점:
 * - 로고 클릭 시 홈으로 이동
 * - 햄버거 메뉴에서 설정, 프로필 등 추가 메뉴
 */
import { useNavigate } from 'react-router-dom';
import logo from '../assets/sodam-logo.png';

const Header = ({ onMenuClick }) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/home');
  };

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 'var(--spacing-md)',
      backgroundColor: 'var(--white)',
      boxShadow: 'var(--shadow)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* 로고 */}
      <button
        onClick={handleLogoClick}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 'var(--spacing-xs)',
          borderRadius: 'var(--radius)',
          transition: 'transform 0.2s ease'
        }}

        aria-label="홈으로 이동"
      >
        <img 
          src={logo} 
          alt="소담 로고" 
          style={{ height: '55px', width: 'auto' }}
        />
      </button>

      {/* 햄버거 메뉴 */}
      <button
        onClick={onMenuClick}
        className="btn"
        style={{
          background: 'none',
          border: 'none',
          padding: 'var(--spacing-sm)',
          borderRadius: 'var(--radius)',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        aria-label="메뉴 열기"
      >
        <div style={{
          width: '24px',
          height: '3px',
          backgroundColor: 'var(--text-primary)',
          borderRadius: '2px',
          transition: 'all 0.2s ease'
        }}></div>
        <div style={{
          width: '24px',
          height: '3px',
          backgroundColor: 'var(--text-primary)',
          borderRadius: '2px',
          transition: 'all 0.2s ease'
        }}></div>
        <div style={{
          width: '24px',
          height: '3px',
          backgroundColor: 'var(--text-primary)',
          borderRadius: '2px',
          transition: 'all 0.2s ease'
        }}></div>
      </button>
    </header>
  );
};

export default Header;
