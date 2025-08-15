/**
 * About Page
 * 
 * 역할: 앱 정보와 고지사항을 표시합니다.
 * 
 * 입력:
 * - onNavigate: 네비게이션 클릭 시 호출되는 콜백 함수
 * 
 * 출력:
 * - 앱 정보
 * - 고지사항
 * - 뒤로 가기 버튼
 * 
 * 향후 연동 지점:
 * - 버전 정보 동적 표시
 * - 개인정보처리방침 링크
 * - 이용약관 링크
 */
import { useNavigate } from 'react-router-dom';
import logo from '../assets/sodam-logo.png';

const About = ({ onNavigate }) => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--background)',
        padding: 'var(--spacing-lg)'
      }}
    >
      {/* 헤더 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-md)',
          marginBottom: 'var(--spacing-xl)'
        }}
      >
        <button
          onClick={() => navigate('/home')}
          className="btn"
          style={{
            background: 'none',
            border: 'none',
            borderRadius: '50%',
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}

          aria-label="뒤로 가기"
        >
          ←
        </button>
        
        <h1
          style={{
            fontSize: 'var(--font-size-xl)',
            fontWeight: '600',
            color: 'var(--text-primary)',
            margin: 0
          }}
        >
          앱 정보
        </h1>
      </div>

      {/* 앱 정보 카드 */}
      <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-lg)',
            marginBottom: 'var(--spacing-lg)'
          }}
        >
          <img
            src={logo}
            alt="소담 로고"
            style={{
              width: '120px',
              height: 'auto'
            }}
          />
          
          <div>
            <h2
              style={{
                fontSize: 'var(--font-size-2xl)',
                fontWeight: '700',
                color: 'var(--primary)',
                margin: 0
              }}
            >
              소담
            </h2>
          </div>
        </div>
        
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-sm)'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 'var(--spacing-sm) 0',
              borderBottom: '1px solid #F0F0F0'
            }}
          >
            <span style={{ color: 'var(--text-secondary)' }}>버전</span>
            <span style={{ fontWeight: '500' }}>1.0.0</span>
          </div>
          
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 'var(--spacing-sm) 0',
              borderBottom: '1px solid #F0F0F0'
            }}
          >
            <span style={{ color: 'var(--text-secondary)' }}>개발사</span>
            <span style={{ fontWeight: '500' }}>Sodam Team</span>
          </div>
          
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 'var(--spacing-sm) 0'
            }}
          >
            <span style={{ color: 'var(--text-secondary)' }}>업데이트</span>
            <span style={{ fontWeight: '500' }}>2025년 8월</span>
          </div>
        </div>
      </div>

      {/* 고지사항 카드 */}
      <div className="card">
        <h3
          style={{
            fontSize: 'var(--font-size-lg)',
            fontWeight: '600',
            color: 'var(--text-primary)',
            marginBottom: 'var(--spacing-md)'
          }}
        >
          고지사항
        </h3>
        
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-md)',
            fontSize: 'var(--font-size-base)',
            lineHeight: '1.6',
            color: 'var(--text-secondary)'
          }}
        >
          <p>
            <strong style={{ color: 'var(--text-primary)' }}>Sodam</strong>은 
            사람↔사람 대화 보조 앱의 디자인/흐름 데모입니다.
          </p>
          
          <div
            style={{
              backgroundColor: '#FFF3E0',
              padding: 'var(--spacing-md)',
              borderRadius: 'var(--radius)',
              border: '1px solid #FFB84D'
            }}
          >
            <p style={{ margin: 0, fontWeight: '500', color: '#E65100' }}>
              ⚠️ 중요 안내
            </p>
            <ul style={{ margin: 'var(--spacing-sm) 0 0 0', paddingLeft: 'var(--spacing-lg)' }}>
              <li>통역사 대체가 아닙니다</li>
              <li>개인정보를 수집하지 않습니다</li>
              <li>실제 기능은 구현되지 않은 데모입니다</li>
            </ul>
          </div>
          
          <p>
            이 앱은 수화 통역 서비스의 사용자 경험을 시연하기 위한 
            프로토타입으로 제작되었습니다.
          </p>
          
          <p>
            실제 서비스 연동이나 개인정보 수집 없이 
            순수하게 UI/UX 데모 목적으로만 사용됩니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
