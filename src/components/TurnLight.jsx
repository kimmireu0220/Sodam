/**
 * TurnLight Component
 * 
 * 역할: 음성 인식 상태를 시각적으로 표시하는 신호등 컴포넌트입니다.
 * 
 * 입력:
 * - status: 현재 상태 ('idle', 'listening', 'analyzing', 'ready')
 * 
 * 출력:
 * - 상태에 따른 색상 변화
 * - 접근성을 위한 aria-live 속성
 * 
 * 향후 연동 지점:
 * - 실제 음성 인식 API와 연동
 * - 더 세밀한 상태 관리
 */
const TurnLight = ({ status }) => {
  const getStatusInfo = () => {
    switch (status) {
      case 'idle':
        return { color: '#FF4444', text: '대기 중' };
      case 'listening':
        return { color: '#FFB84D', text: '듣는 중...' };
      case 'analyzing':
        return { color: '#FFB84D', text: '분석 중...' };
      case 'ready':
        return { color: '#44CC44', text: '준비 완료' };
      default:
        return { color: '#FF4444', text: '대기 중' };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-sm)',
        padding: 'var(--spacing-sm) var(--spacing-md)',
        backgroundColor: 'var(--white)',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow)',
        margin: 'var(--spacing-md)'
      }}
      aria-live="polite"
      aria-label={`현재 상태: ${statusInfo.text}`}
    >
      {/* 신호등 원형 표시 */}
      <div
        style={{
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          backgroundColor: statusInfo.color,
          boxShadow: `0 0 8px ${statusInfo.color}`,
          animation: status === 'listening' || status === 'analyzing' ? 'pulse 1s infinite' : 'none'
        }}
        role="status"
        aria-label={statusInfo.text}
      ></div>
      
      {/* 상태 텍스트 */}
      <span
        style={{
          fontSize: 'var(--font-size-sm)',
          color: 'var(--text-secondary)',
          fontWeight: '500'
        }}
      >
        {statusInfo.text}
      </span>

      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
    </div>
  );
};

export default TurnLight;
