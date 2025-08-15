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
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import TurnLight from '../components/TurnLight';
import SpeechBubble from '../components/SpeechBubble';
import bearPointing from '../assets/bear-pointing.png';
import bearThinking from '../assets/bear-thinking.png';
import bearSuggest from '../assets/bear-suggest.png';
import bearSign from '../assets/bear-sign.png';

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

    // idle 또는 다른 상태에서 → listening → analyzing → ready 순서로 전환
    setStatus('listening');
    
    setTimeout(() => {
      setStatus('analyzing');
    }, 2000); // 2초로 늘림
    
    setTimeout(() => {
      setStatus('ready');
      setMessage('안녕하세요. 반갑습니다.');
    }, 4000); // 4초로 늘림
  };

  const handleTranslateClick = () => {
    if (status === 'ready') {
      // 변환 중 상태로 변경 (캐릭터 이미지는 그대로 유지)
      setStatus('converting');
      
      // 2초 후 완료 상태로 변경 (캐릭터 이미지 변경)
      setTimeout(() => {
        setStatus('signing');
      }, 2000);
    }
  };

  const handleMenuClick = () => {
    navigate('/about');
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
          padding: 'var(--spacing-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-lg)'
        }}
      >
        {/* 환영 메시지 */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: 'var(--spacing-md)'
          }}
        >
          <h1
            style={{
              fontSize: 'var(--font-size-2xl)',
              fontWeight: '700',
              color: 'var(--primary)',
              margin: '0 0 var(--spacing-sm) 0'
            }}
          >
            수화 변환
          </h1>
          <p
            style={{
              fontSize: 'var(--font-size-base)',
              color: 'var(--text-secondary)',
              margin: 0,
              lineHeight: '1.6'
            }}
          >
            음성을 실시간으로 수화로 변환합니다
          </p>
        </div>

        {/* 곰 캐릭터와 말풍선 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: 'var(--spacing-lg)'
          }}
        >
          {/* ready, converting, signing 상태일 때 말풍선 표시 */}
          {(status === 'ready' || status === 'converting' || status === 'signing') && <SpeechBubble message={message} />}
          
          {/* 곰 캐릭터 */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <img
              src={
                status === 'ready' ? bearSuggest :
                status === 'analyzing' ? bearThinking :
                status === 'converting' ? bearSuggest : // converting 상태에서는 ready와 같은 이미지 유지
                status === 'signing' ? bearSign :
                bearPointing
              }
              alt="소담 곰 캐릭터"
              style={{
                width: '200px',
                height: 'auto',
                filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))',
                transition: 'all 0.3s ease'
              }}
            />
          </div>
        </div>

        {/* 메인 기능 카드 */}
        <div className="card">
          <div
            style={{
              textAlign: 'center',
              padding: 'var(--spacing-xl)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-lg)'
            }}
          >
            {/* 안내 메시지 */}
            <p
              style={{
                fontSize: 'var(--font-size-xl)',
                fontWeight: '600',
                color: 'var(--text-primary)',
                margin: 0,
                lineHeight: '1.5'
              }}
            >
              대화 듣기를 통해 실시간 수화 통역을 시작하세요!
            </p>
            
            {/* 상태 표시 */}
            <div
              style={{
                padding: 'var(--spacing-md)',
                borderRadius: 'var(--radius)',
                                 backgroundColor: status === 'idle' ? '#F5F5F5' : 
                                status === 'listening' ? '#FFF3E0' : 
                                status === 'analyzing' ? '#E3F2FD' : 
                                status === 'ready' ? '#E8F5E8' : 
                                status === 'converting' ? '#F3E5F5' :
                                status === 'signing' ? '#E8F5E8' : '#F5F5F5',
                 border: status === 'idle' ? '1px solid #E0E0E0' :
                        status === 'listening' ? '1px solid #FFB84D' :
                        status === 'analyzing' ? '1px solid #2196F3' :
                        status === 'ready' ? '1px solid #4CAF50' : 
                        status === 'converting' ? '1px solid #9C27B0' :
                        status === 'signing' ? '1px solid #4CAF50' : '1px solid #E0E0E0',
                margin: 'var(--spacing-md) 0',
                textAlign: 'center'
              }}
            >
              <p
                style={{
                  fontSize: 'var(--font-size-lg)',
                  fontWeight: '600',
                                     color: status === 'idle' ? '#666666' : 
                          status === 'listening' ? '#E65100' : 
                          status === 'analyzing' ? '#1565C0' : 
                          status === 'ready' ? '#2E7D32' : 
                          status === 'converting' ? '#7B1FA2' :
                          status === 'signing' ? '#2E7D32' : '#666666',
                  margin: '0 0 var(--spacing-sm) 0'
                }}
              >
                                 {status === 'idle' && '🎤 대화 듣기를 눌러 음성 인식을 시작하세요'}
                 {status === 'listening' && '🔊 음성을 듣고 있습니다...'}
                 {status === 'analyzing' && '🤔 음성을 분석하고 있습니다...'}
                 {status === 'ready' && '✅ 음성 인식 완료!'}
                 {status === 'converting' && '🤟 수화로 변환 중...'}
                 {status === 'signing' && '✅ 수화 변환 완료!'}
              </p>
              {message && status !== 'ready' && status !== 'converting' && status !== 'signing' && (
                <p
                  style={{
                    fontSize: 'var(--font-size-base)',
                    color: 'var(--text-secondary)',
                    margin: 0,
                    fontStyle: 'italic'
                  }}
                >
                  "{message}"
                </p>
              )}
            </div>

            {/* 버튼들 */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 'var(--spacing-md)',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}
            >
              {/* 대화 듣기 버튼 */}
              <button
                onClick={handleMicClick}
                className="btn btn-primary"
                style={{
                  flex: 1,
                  maxWidth: '200px',
                  minWidth: '160px'
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
                  flex: 1,
                  maxWidth: '200px',
                  minWidth: '160px',
                  opacity: status === 'ready' ? 1 : 0.5,
                  cursor: status === 'ready' ? 'pointer' : 'not-allowed'
                }}
                aria-label="수화로 변환"
              >
                <span style={{ fontSize: '20px' }}>🤟</span>
                <span>수화로 변환</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 네비게이션 */}
      <BottomNav currentPage="translate" onNavigate={onNavigate} />

      {/* 상태 표시 */}
      <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
        <TurnLight status={status} />
      </div>
    </div>
  );
};

export default Translate;
