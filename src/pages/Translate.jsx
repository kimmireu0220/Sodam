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
import bearSuggest from '../assets/bear-suggest.png';

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
        backgroundColor: '#F5F5DC', // 베이지 배경색
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* 상단 헤더 */}
      <div
        style={{
          background: 'var(--white)',
          borderRadius: '0 0 20px 20px',
          padding: 'var(--spacing-md) var(--spacing-lg)',
          margin: '0 var(--spacing-md)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-sm)'
        }}
      >
        <button
          onClick={() => navigate('/home')}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '4px'
          }}
          aria-label="뒤로 가기"
        >
          ←
        </button>
        <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
          대기 중
        </span>
      </div>

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
         <div
           style={{
             background: 'var(--white)',
             borderRadius: '20px',
             padding: 'var(--spacing-xl)',
             boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
             textAlign: 'center',
             maxWidth: '90%',
             width: '100%',
             minHeight: '300px',
             display: 'flex',
             flexDirection: 'column',
             justifyContent: 'center'
           }}
         >
                     {/* 곰 캐릭터 이미지 */}
           <div style={{ marginBottom: 'var(--spacing-xl)' }}>
             <img
               src={bearSuggest}
               alt="곰 캐릭터"
               style={{
                 width: '180px',
                 height: 'auto',
                 borderRadius: '10px'
               }}
             />
           </div>
          
                     {/* 메시지 텍스트 */}
           <p
             style={{
               fontSize: 'var(--font-size-xl)',
               fontWeight: '600',
               color: 'var(--text-primary)',
               margin: 0,
               lineHeight: '1.5',
               padding: '0 var(--spacing-md)'
             }}
           >
             대화 듣기를 통해 실시간 수화 통역을 시작하세요!
           </p>
        </div>

                 {/* 하단 버튼들 */}
         <div
           style={{
             display: 'flex',
             flexDirection: 'row',
             gap: 'var(--spacing-md)',
             width: '100%',
             maxWidth: '90%',
             justifyContent: 'center'
           }}
         >
                     {/* 대화 듣기 버튼 */}
           <button
             onClick={handleMicClick}
             className="btn btn-primary"
             style={{
               background: '#FF6B35', // 오렌지 색상
               fontSize: 'var(--font-size-lg)',
               fontWeight: '600',
               padding: 'var(--spacing-md) var(--spacing-lg)',
               borderRadius: 'var(--radius)',
               border: 'none',
               cursor: 'pointer',
               transition: 'all 0.2s ease',
               display: 'flex',
               alignItems: 'center',
               gap: 'var(--spacing-sm)',
               justifyContent: 'center',
               color: 'var(--white)',
               flex: 1,
               maxWidth: '200px'
             }}
             aria-label="대화 듣기"
           >
             <span style={{ fontSize: '20px' }}>🎤</span>
             <span>대화 듣기</span>
           </button>

                     {/* 수화로 변환 버튼 */}
           <button
             onClick={handleTranslateClick}
             disabled={status !== 'ready'}
             className="btn btn-secondary"
             style={{
               background: '#F0F0F0', // 연한 베이지 색상
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
               flex: 1,
               maxWidth: '200px',
               opacity: status === 'ready' ? 1 : 0.5,
               color: 'var(--text-primary)'
             }}
             aria-label="수화로 변환"
           >
             <span style={{ fontSize: '20px' }}>🤟</span>
             <span>수화로 변환</span>
           </button>
        </div>
      </div>

      {/* 상태 표시 (필요시) */}
      {status !== 'idle' && (
        <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
          <TurnLight status={status} />
        </div>
      )}
    </div>
  );
};

export default Translate;
