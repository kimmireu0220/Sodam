/**
 * SpeechBubble Component
 * 
 * 역할: 곰돌이 캐릭터 위에 표시되는 말풍선 컴포넌트입니다.
 * 
 * 입력:
 * - message: 말풍선에 표시할 메시지
 * 
 * 출력:
 * - 말풍선 UI
 * - 접근성을 위한 aria-live 속성
 * 
 * 향후 연동 지점:
 * - 애니메이션 효과 추가
 * - 다양한 말풍선 스타일
 */
const SpeechBubble = ({ message }) => {
  if (!message) return null;

  return (
    <div
      style={{
        position: 'relative',
        marginBottom: 'var(--spacing-md)',
        animation: 'speechBubbleFadeIn 0.3s ease-in-out'
      }}
      aria-live="polite"
      aria-label={`곰돌이가 말하는 내용: ${message}`}
    >
      {/* 말풍선 본체 */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E0E0E0',
          borderRadius: 'var(--radius)',
          padding: 'var(--spacing-md)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          maxWidth: '280px',
          margin: '0 auto',
          position: 'relative',
          textAlign: 'center'
        }}
      >
        <p
          style={{
            fontSize: 'var(--font-size-lg)',
            fontWeight: '500',
            color: 'var(--text-primary)',
            margin: 0,
            lineHeight: '1.4'
          }}
        >
          "{message}"
        </p>
        
        {/* 말풍선 꼬리 */}
        <div
          style={{
            position: 'absolute',
            bottom: '-8px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderTop: '8px solid #FFFFFF',
            filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
          }}
        />
        
        {/* 말풍선 꼬리 테두리 */}
        <div
          style={{
            position: 'absolute',
            bottom: '-9px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderTop: '8px solid #E0E0E0',
            zIndex: -1
          }}
        />
      </div>

      <style>
        {`
          @keyframes speechBubbleFadeIn {
            0% {
              opacity: 0;
              transform: translateY(-10px) scale(0.95);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}
      </style>
    </div>
  );
};

export default SpeechBubble;
