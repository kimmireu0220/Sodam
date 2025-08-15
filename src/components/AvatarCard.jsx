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
 * - 메시지 말풍선 (ready 상태)
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

      {/* 메시지 말풍선 */}
      {status === 'ready' && message && (
        <div
          style={{
            backgroundColor: 'var(--primary)',
            color: 'var(--white)',
            padding: 'var(--spacing-md)',
            borderRadius: 'var(--radius)',
            maxWidth: '280px',
            textAlign: 'center',
            position: 'relative',
            animation: 'slideIn 0.5s ease'
          }}
        >
          {message}
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
              borderTop: '8px solid var(--primary)'
            }}
          ></div>
        </div>
      )}

      {/* 상태별 안내 메시지 */}
      {status !== 'ready' && (
        <div
          style={{
            textAlign: 'center',
            color: 'var(--text-secondary)',
            fontSize: 'var(--font-size-lg)',
            fontWeight: '500'
          }}
        >
          {status === 'idle' && '대화 듣기를 통해 실시간 수화 통역을 시작하세요!'}
          {status === 'listening' && '듣는 중...'}
          {status === 'analyzing' && '현재 대화 문장을 분석하고 있어요!'}
        </div>
      )}

      <style>
        {`
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
          }
          
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default AvatarCard;
