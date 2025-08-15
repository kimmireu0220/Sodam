/**
 * AvatarCard Component
 * 
 * 역할: 곰 캐릭터를 표시하며, 상태에 따른 애니메이션을 제공합니다.
 * 
 * 입력:
 * - status: 현재 상태 ('idle', 'listening', 'analyzing', 'ready')
 * - message: 표시할 메시지 (ready 상태에서만)
 * 
 * 출력:
 * - 곰 캐릭터 이미지
 * - 상태에 따른 애니메이션
 * 
 * 향후 연동 지점:
 * - 실제 수화 애니메이션 연동
 * - 음성 인식 결과에 따른 동적 표현
 */
import bear from '../assets/bear-new.png';

const AvatarCard = ({ status, message }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'listening':
        return '👂';
      case 'analyzing':
        return '💭';
      case 'ready':
        return '🤟';
      default:
        return null;
    }
  };

  const statusIcon = getStatusIcon();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--spacing-lg)',
        padding: 'var(--spacing-xl)',
        backgroundColor: 'var(--white)',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow)',
        margin: 'var(--spacing-md)',
        position: 'relative'
      }}
    >
      {/* 상태 아이콘 */}
      {statusIcon && (
        <div
          style={{
            position: 'absolute',
            top: 'var(--spacing-md)',
            right: 'var(--spacing-md)',
            fontSize: '32px',
            animation: status === 'analyzing' ? 'bounce 1s infinite' : 'none'
          }}
        >
          {statusIcon}
        </div>
      )}

      {/* 곰 캐릭터 */}
      <div
        className={status === 'ready' ? 'shake' : ''}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <img
          src={bear}
          alt="소담 곰 캐릭터"
          style={{
            width: '140px',
            height: 'auto',
            filter: status === 'idle' ? 'grayscale(20%)' : 'none',
            transition: 'all 0.3s ease'
          }}
        />
      </div>
    </div>
  );
};

export default AvatarCard;
