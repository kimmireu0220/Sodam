/**
 * Translate Page
 * 
 * 역할: 음성 인식 및 수화 변환 기능을 제공합니다.
 * 
 * 입력:
 * - onNavigate: 네비게이션 클릭 시 호출되는 콜백 함수
 * 
 * 출력:
 * - TurnLight 상태 표시
 * - AvatarCard 곰 캐릭터
 * - MicButton 마이크 제어
 * - 수화 변환 버튼
 * 
 * 향후 연동 지점:
 * - 실제 STT API 연동
 * - 수화 애니메이션 연동
 * - 음성 품질 모니터링
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TurnLight from '../components/TurnLight';
import AvatarCard from '../components/AvatarCard';
import MicButton from '../components/MicButton';

const Translate = ({ onNavigate }) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  // 상태 전환 로직
  const handleMicClick = () => {
    if (status === 'ready') {
      // ready 상태에서 다시 클릭하면 idle로 복귀
      setStatus('idle');
      setMessage('');
      return;
    }

    // idle → listening → analyzing → ready 순서로 전환
    setStatus('listening');
    
    setTimeout(() => {
      setStatus('analyzing');
    }, 800);
    
    setTimeout(() => {
      setStatus('ready');
      setMessage('안녕하세요. 반갑습니다.');
    }, 1600);
  };

  const handleTranslateClick = () => {
    if (status === 'ready') {
      // TODO: 수화 애니메이션 연동 예정
      onNavigate('수화 변환이 완료되었습니다!');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--background)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* 상단 상태 표시 */}
      <TurnLight status={status} />

      {/* 메인 콘텐츠 */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 'var(--spacing-lg)',
          gap: 'var(--spacing-xl)'
        }}
      >
        {/* 곰 캐릭터 카드 */}
        <AvatarCard status={status} message={message} />

        {/* 하단 버튼들 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-md)',
            width: '100%',
            maxWidth: '300px'
          }}
        >
          {/* 마이크 버튼 */}
          <MicButton status={status} onClick={handleMicClick} />

          {/* 수화 변환 버튼 */}
          <button
            onClick={handleTranslateClick}
            disabled={status !== 'ready'}
            className="btn btn-secondary"
            style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: '600',
              padding: 'var(--spacing-md) var(--spacing-lg)',
              borderRadius: 'var(--radius)',
              border: 'none',
              cursor: status === 'ready' ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)',
              justifyContent: 'center',
              minWidth: '160px',
              opacity: status === 'ready' ? 1 : 0.5
            }}

            aria-label="수화로 변환"
          >
            <span style={{ fontSize: '24px' }}>🤟</span>
            <span>수화로 변환</span>
          </button>
        </div>
      </div>

      {/* 뒤로 가기 버튼 */}
      <div
        style={{
          position: 'absolute',
          top: 'var(--spacing-md)',
          left: 'var(--spacing-md)',
          zIndex: 10
        }}
      >
        <button
          onClick={() => navigate('/home')}
          className="btn"
          style={{
            background: 'var(--white)',
            border: 'none',
            borderRadius: '50%',
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}

          aria-label="뒤로 가기"
        >
          ←
        </button>
      </div>
    </div>
  );
};

export default Translate;
