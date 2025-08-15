/**
 * Home Page
 * 
 * 역할: 앱의 메인 대시보드로 주요 기능들에 대한 접근을 제공합니다.
 * 
 * 입력:
 * - onNavigate: 네비게이션 클릭 시 호출되는 콜백 함수
 * 
 * 출력:
 * - 헤더 (로고 + 햄버거 메뉴)
 * - 3개의 주요 기능 카드
 * - 하단 네비게이션
 * 
 * 향후 연동 지점:
 * - 사용자 맞춤 기능 추천
 * - 최근 사용 기능 표시
 * - 알림 및 업데이트 표시
 */
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import bear from '../assets/bear-new.png';
import signLanguageIcon from '../assets/sign-language-icon.png';
import profileIcon from '../assets/profile-icon.png';

const Home = ({ onNavigate }) => {
  const navigate = useNavigate();

  const handleMenuClick = () => {
    navigate('/about');
  };

  const handleCardClick = (path) => {
    navigate(path);
  };

  const cards = [
    {
      title: '수화 변환',
      subtitle: '대화 듣기',
      description: '음성을 실시간으로 수화로 변환합니다',
      icon: 'image',
      imageSrc: signLanguageIcon,
      path: '/translate',
      color: 'var(--primary)'
    },
    {
      title: '텍스트로 말하기',
      subtitle: '직접 입력 + 상용구',
      description: '직접 입력 또는 상용구를 선택하여 음성으로 전달합니다',
      icon: '✏️',
      path: '/speak',
      color: 'var(--secondary)'
    },
    {
      title: '마이 페이지',
      subtitle: '사용 통계 + 개인 상용구',
      description: '사용 패턴을 확인하고 개인 상용구를 관리합니다',
      icon: 'image',
      imageSrc: profileIcon,
      path: '/mypage',
      color: 'var(--primary)'
    }
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--background)',
        paddingBottom: '80px' // 하단 네비게이션 공간
      }}
    >
      {/* 헤더 */}
      <Header onMenuClick={handleMenuClick} />

      {/* 메인 콘텐츠 */}
      <div
        style={{
          padding: 'var(--spacing-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-lg)'
        }}
      >
        {/* 환영 메시지 */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: 'var(--spacing-md)'
          }}
        >
          <h1
            style={{
              fontSize: 'var(--font-size-2xl)',
              fontWeight: '700',
              color: 'var(--primary)',
              margin: '0 0 var(--spacing-sm) 0'
            }}
          >
            반가워요!
          </h1>
          <p
            style={{
              fontSize: 'var(--font-size-base)',
              color: 'var(--text-secondary)',
              margin: 0,
              lineHeight: '1.6'
            }}
          >
            언제 어디서나 실시간 수화 통역을 시작하세요.
          </p>
        </div>

        {/* 곰 캐릭터 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: 'var(--spacing-lg)'
          }}
        >
          <img
            src={bear}
            alt="소담 곰 캐릭터"
            style={{
              width: '200px',
              height: 'auto',
              filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))'
            }}
          />
        </div>

        {/* 기능 카드들 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-lg)'
          }}
        >
          {cards.map((card, index) => (
            <div
              key={index}
              className="card"
              onClick={() => handleCardClick(card.path)}
              style={{
                cursor: 'pointer',
                border: `2px solid ${card.color}`,
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}

              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleCardClick(card.path);
                }
              }}
              aria-label={`${card.title}로 이동`}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-lg)'
                }}
              >
                {/* 아이콘 */}
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: card.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px',
                    color: 'var(--white)',
                    flexShrink: 0
                  }}
                >
                  {card.icon === 'image' ? (
                    <img
                      src={card.imageSrc}
                      alt={card.title}
                      style={{
                        width: '32px',
                        height: '32px',
                        filter: 'brightness(0) invert(1)'
                      }}
                    />
                  ) : (
                    card.icon
                  )}
                </div>

                {/* 텍스트 */}
                <div
                  style={{
                    flex: 1
                  }}
                >
                  <h3
                    style={{
                      fontSize: 'var(--font-size-xl)',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      margin: '0 0 var(--spacing-xs) 0'
                    }}
                  >
                    {card.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--text-secondary)',
                      margin: '0 0 var(--spacing-xs) 0',
                      fontWeight: '500'
                    }}
                  >
                    {card.subtitle}
                  </p>
                  <p
                    style={{
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--text-secondary)',
                      margin: 0,
                      lineHeight: '1.4'
                    }}
                  >
                    {card.description}
                  </p>
                </div>

                {/* 화살표 */}
                <div
                  style={{
                    fontSize: '24px',
                    color: card.color,
                    transition: 'transform 0.2s ease'
                  }}
                >
                  →
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 네비게이션 */}
      <BottomNav currentPath="/home" onNavigate={onNavigate} />
    </div>
  );
};

export default Home;
