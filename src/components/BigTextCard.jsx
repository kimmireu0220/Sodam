/**
 * BigTextCard Component
 * 
 * 역할: 텍스트를 큰 글자로 표시하는 모달 컴포넌트입니다.
 * 
 * 입력:
 * - text: 표시할 텍스트
 * - isVisible: 모달 표시 여부
 * - onClose: 모달 닫기 콜백 함수
 * 
 * 출력:
 * - 큰 글자로 표시된 텍스트
 * - 닫기 버튼
 * - 배경 오버레이
 * 
 * 향후 연동 지점:
 * - TTS 기능 연동
 * - 수화 애니메이션 연동
 * - 텍스트 크기 조절 기능
 */
const BigTextCard = ({ text, isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <>
      {/* 배경 오버레이 */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--spacing-md)',
          animation: 'fadeIn 0.3s ease'
        }}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="big-text-title"
      >
        {/* 모달 카드 */}
        <div
          style={{
            backgroundColor: 'var(--white)',
            borderRadius: 'var(--radius)',
            padding: 'var(--spacing-xl)',
            maxWidth: '90vw',
            maxHeight: '80vh',
            overflow: 'auto',
            position: 'relative',
            animation: 'slideIn 0.3s ease',
            boxShadow: 'var(--shadow-hover)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 'var(--spacing-md)',
              right: 'var(--spacing-md)',
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              padding: 'var(--spacing-xs)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}

            aria-label="닫기"
          >
            ✕
          </button>

          {/* 제목 */}
          <h2
            id="big-text-title"
            style={{
              fontSize: 'var(--font-size-xl)',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: 'var(--spacing-lg)',
              textAlign: 'center'
            }}
          >
            전달할 메시지
          </h2>

          {/* 큰 텍스트 */}
          <div
            style={{
              fontSize: 'var(--font-size-3xl)',
              fontWeight: '700',
              color: 'var(--primary)',
              textAlign: 'center',
              lineHeight: '1.4',
              wordBreak: 'keep-all',
              marginBottom: 'var(--spacing-xl)',
              minHeight: '120px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {text}
          </div>

          {/* 액션 버튼들 */}
          <div
            style={{
              display: 'flex',
              gap: 'var(--spacing-md)',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}
          >
            <button
              onClick={() => {
                // TODO: TTS/아바타 연동 예정
                alert('곧 제공될 예정입니다');
              }}
              className="btn btn-primary"
              style={{ minWidth: '120px' }}
            >
              음성으로 전달
            </button>
            
            <button
              onClick={() => {
                // TODO: 수화 애니메이션 연동 예정
                alert('곧 제공될 예정입니다');
              }}
              className="btn btn-secondary"
              style={{ minWidth: '120px' }}
            >
              수화로 변환
            </button>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: scale(0.9) translateY(20px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
        `}
      </style>
    </>
  );
};

export default BigTextCard;
