/**
 * MicButton Component
 * 
 * 역할: 마이크 버튼을 통해 음성 인식 상태를 제어합니다.
 * 
 * 입력:
 * - status: 현재 상태 ('idle', 'listening', 'analyzing', 'ready')
 * - onClick: 버튼 클릭 시 호출되는 콜백 함수
 * 
 * 출력:
 * - 상태에 따른 마이크 버튼 모양 변화
 * - 접근성을 위한 aria-label
 * 
 * 향후 연동 지점:
 * - 실제 음성 인식 API 연동
 * - 오디오 스트림 처리
 * - 음성 품질 모니터링
 */
const MicButton = ({ status, onClick }) => {
  const getButtonInfo = () => {
    switch (status) {
      case 'idle':
        return {
          icon: '🎤',
          text: '대화 듣기',
          color: 'var(--primary)',
          disabled: false
        };
      case 'listening':
        return {
          icon: '⏸️',
          text: '일시 정지',
          color: 'var(--error)',
          disabled: false
        };
      case 'analyzing':
        return {
          icon: '⏸️',
          text: '일시 정지',
          color: 'var(--error)',
          disabled: false
        };
      case 'ready':
        return {
          icon: '🔄',
          text: '다시 듣기',
          color: 'var(--primary)',
          disabled: false
        };
      default:
        return {
          icon: '🎤',
          text: '대화 듣기',
          color: 'var(--primary)',
          disabled: false
        };
    }
  };

  const buttonInfo = getButtonInfo();

  return (
    <button
      onClick={onClick}
      disabled={buttonInfo.disabled}
      className="btn btn-primary"
      style={{
        backgroundColor: buttonInfo.color,
        color: 'var(--white)',
        fontSize: 'var(--font-size-lg)',
        fontWeight: '600',
        padding: 'var(--spacing-md) var(--spacing-lg)',
        borderRadius: 'var(--radius)',
        border: 'none',
        cursor: buttonInfo.disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-sm)',
        minWidth: '160px',
        justifyContent: 'center',
        boxShadow: status === 'listening' || status === 'analyzing' ? '0 0 20px rgba(255, 68, 68, 0.3)' : 'var(--shadow)',
        animation: status === 'listening' || status === 'analyzing' ? 'pulse 2s infinite' : 'none'
      }}
      onMouseEnter={(e) => {
        if (!buttonInfo.disabled) {
          e.target.style.transform = 'scale(1.05)';
          e.target.style.boxShadow = 'var(--shadow-hover)';
        }
      }}
      onMouseLeave={(e) => {
        if (!buttonInfo.disabled) {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = status === 'listening' || status === 'analyzing' ? '0 0 20px rgba(255, 68, 68, 0.3)' : 'var(--shadow)';
        }
      }}
      aria-label={`${buttonInfo.text} 버튼`}
    >
      <span style={{ fontSize: '24px' }}>
        {buttonInfo.icon}
      </span>
      <span>{buttonInfo.text}</span>

      <style>
        {`
          @keyframes pulse {
            0%, 100% { 
              box-shadow: 0 0 20px rgba(255, 68, 68, 0.3);
            }
            50% { 
              box-shadow: 0 0 30px rgba(255, 68, 68, 0.6);
            }
          }
        `}
      </style>
    </button>
  );
};

export default MicButton;
