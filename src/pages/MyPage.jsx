/**
 * MyPage - Sodam 마이페이지
 * 
 * ## 기능 요약
 * 사용자 개인화 대시보드로 다음 기능을 제공:
 * 1. **사용 통계 대시보드**: 수화 변환/텍스트 입력 횟수, 자주 사용하는 문구, 최근 7일 사용 패턴
 * 2. **개인 상용구 관리**: CRUD 기능, 즐겨찾기, 카테고리 필터링, 드래그앤드롭 정렬
 * 
 * ## 단축키 및 조작법
 * - **키보드 네비게이션**: Tab/Shift+Tab으로 이동, Enter/Space로 활성화
 * - **상용구 순서 변경**: 
 *   - 마우스: 드래그 핸들(↕️)을 드래그
 *   - 키보드: 항목 선택 후 ▲/▼ 버튼 사용
 * - **차트 상호작용**: 막대에 포커스/호버하여 상세 정보 확인
 * 
 * 
 * 역할: 사용자의 앱 사용 패턴 분석 및 개인 상용구 관리 인터페이스
 * 
 * 입력:
 * - onNavigate: 네비게이션 콜백 함수
 * 
 * 출력:
 * - 환영 메시지 및 곰 캐릭터
 * - 사용 통계 시각화 (4개 카드 + 막대 차트)
 * - 개인 상용구 관리 인터페이스
 * 
 * 상호작용:
 * - 통계 차트의 인터랙티브 요소
 * - 상용구 추가/수정/삭제/정렬/필터링
 * - 드래그앤드롭 및 키보드 접근성
 * 
 * 접근성:
 * - WCAG 2.1 AA 준수
 * - 키보드로 모든 기능 사용 가능
 * - 스크린 리더 지원 (aria-label, role, aria-live)
 * - 적절한 색상 대비 및 포커스 스타일
 * - 의미 있는 HTML 구조
 */

import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import StatisticsSection from '../components/StatisticsSection';
import CustomPhrasesSection from '../components/CustomPhrasesSection';
import bear from '../assets/bear-new.png';

const MyPage = ({ onNavigate }) => {
  const handleMenuClick = () => {
    // About 페이지로 이동하거나 메뉴 표시
    if (onNavigate) {
      onNavigate('메뉴');
    }
  };

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
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-xl)'
        }}
      >
        {/* 환영 섹션 */}
        <section
          style={{
            padding: 'var(--spacing-lg)',
            textAlign: 'center'
          }}
        >
          {/* 환영 메시지 */}
          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <h1
              style={{
                fontSize: 'var(--font-size-2xl)',
                fontWeight: '700',
                color: 'var(--primary)',
                margin: '0 0 var(--spacing-sm) 0'
              }}
            >
              안녕하세요! 👋
            </h1>
            <p
              style={{
                fontSize: 'var(--font-size-lg)',
                color: 'var(--text-primary)',
                margin: '0 0 var(--spacing-xs) 0',
                lineHeight: '1.6'
              }}
            >
              소담과 함께 더 나은 소통을 준비해요
            </p>
            <p
              style={{
                fontSize: 'var(--font-size-base)',
                color: 'var(--text-secondary)',
                margin: 0,
                lineHeight: '1.5'
              }}
            >
              사용 패턴을 확인하고 개인 상용구를 관리해보세요
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
            <div
              style={{
                width: '160px',
                height: '160px',
                borderRadius: '50%',
                backgroundColor: 'var(--white)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow)',
                padding: 'var(--spacing-md)'
              }}
            >
              <img
                src={bear}
                alt="소담 곰 캐릭터 - 친근하게 손을 흔드는 모습"
                style={{
                  width: '120px',
                  height: 'auto',
                  filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
                }}
              />
            </div>
          </div>

          {/* 페이지 설명 */}
          <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 'var(--spacing-md)',
                textAlign: 'center'
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: '32px',
                    marginBottom: 'var(--spacing-xs)'
                  }}
                  aria-hidden="true"
                >
                  📊
                </div>
                <h3
                  style={{
                    fontSize: 'var(--font-size-base)',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    margin: '0 0 var(--spacing-xs) 0'
                  }}
                >
                  사용 통계
                </h3>
                <p
                  style={{
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--text-secondary)',
                    margin: 0,
                    lineHeight: '1.4'
                  }}
                >
                  앱 사용 패턴을<br />한눈에 확인
                </p>
              </div>

              <div>
                <div
                  style={{
                    fontSize: '32px',
                    marginBottom: 'var(--spacing-xs)'
                  }}
                  aria-hidden="true"
                >
                  📝
                </div>
                <h3
                  style={{
                    fontSize: 'var(--font-size-base)',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    margin: '0 0 var(--spacing-xs) 0'
                  }}
                >
                  상용구 관리
                </h3>
                <p
                  style={{
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--text-secondary)',
                    margin: 0,
                    lineHeight: '1.4'
                  }}
                >
                  개인 문구를<br />쉽게 정리
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 사용 통계 섹션 */}
        <section 
          aria-labelledby="statistics-heading"
          style={{ 
            backgroundColor: 'var(--white)',
            marginTop: 'var(--spacing-md)'
          }}
        >
          {/* 섹션 구분을 위한 숨겨진 제목 */}
          <h2 
            id="statistics-heading" 
            style={{ 
              position: 'absolute', 
              left: '-10000px',
              width: '1px',
              height: '1px', 
              overflow: 'hidden' 
            }}
          >
            사용 통계 섹션
          </h2>
          <StatisticsSection />
        </section>

        {/* 개인 상용구 섹션 */}
        <section 
          aria-labelledby="phrases-heading"
          style={{ 
            backgroundColor: 'var(--white)'
          }}
        >
          {/* 섹션 구분을 위한 숨겨진 제목 */}
          <h2 
            id="phrases-heading" 
            style={{ 
              position: 'absolute', 
              left: '-10000px',
              width: '1px',
              height: '1px', 
              overflow: 'hidden' 
            }}
          >
            개인 상용구 관리 섹션
          </h2>
          <CustomPhrasesSection />
        </section>

      </div>

      {/* 하단 네비게이션 */}
      <BottomNav currentPath="/mypage" onNavigate={onNavigate} />
    </div>
  );
};

export default MyPage;