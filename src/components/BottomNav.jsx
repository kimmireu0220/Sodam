/**
 * BottomNav Component
 * 
 * 역할: 앱의 하단 네비게이션을 제공하며, 주요 기능 간 이동을 가능하게 합니다.
 * 
 * 입력:
 * - currentPath: 현재 경로를 나타내는 문자열
 * - onNavigate: 네비게이션 클릭 시 호출되는 콜백 함수
 * 
 * 출력:
 * - 홈, 수화 변환, 마이페이지 탭
 * - 현재 활성 탭 하이라이트
 * 
 * 향후 연동 지점:
 * - 각 탭별 권한 체크
 * - 마이페이지에서 사용자 정보 표시
 */
import { useNavigate } from 'react-router-dom';
import signLanguageIcon from '../assets/sign-language-icon.png';
import homeIcon from '../assets/home-icon.png';
import profileIcon from '../assets/profile-icon.png';

const BottomNav = ({ currentPath, onNavigate }) => {
  const navigate = useNavigate();

  const navItems = [
    { path: '/home', label: '홈', icon: 'image', imageSrc: homeIcon },
    { path: '/translate', label: '수화 변환', icon: 'image', imageSrc: signLanguageIcon },
    { path: '/mypage', label: '마이 페이지', icon: 'image', imageSrc: profileIcon }
  ];

  const handleNavClick = (path) => {
    navigate(path);
  };

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'var(--white)',
      borderTop: '1px solid #E0E0E0',
      padding: 'var(--spacing-sm) var(--spacing-md)',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
      zIndex: 100
    }}>
      {navItems.map((item) => {
        const isActive = currentPath === item.path;
        
        return (
          <button
            key={item.path}
            onClick={() => handleNavClick(item.path)}
            className="btn"
            style={{
              background: 'none',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--spacing-xs)',
              padding: 'var(--spacing-sm)',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: isActive ? '600' : '400'
            }}
            aria-label={`${item.label}로 이동`}
            aria-current={isActive ? 'page' : undefined}
          >
            {item.icon === 'image' ? (
              <img
                src={item.imageSrc}
                alt="수화 변환"
                style={{
                  width: '24px',
                  height: '24px',
                  filter: isActive ? 'none' : 'grayscale(50%)'
                }}
              />
            ) : (
              <span style={{
                fontSize: '24px',
                filter: isActive ? 'none' : 'grayscale(50%)'
              }}>
                {item.icon}
              </span>
            )}
            <span style={{
              fontSize: 'var(--font-size-sm)',
              textAlign: 'center'
            }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
