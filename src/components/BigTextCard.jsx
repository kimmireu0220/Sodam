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
 * - TTS 기능
 * 
 * 향후 연동 지점:
 * - TTS 기능 연동
 * - 텍스트 크기 조절 기능
 */
import { useState, useEffect } from 'react';
import ttsService from '../utils/tts';

const BigTextCard = ({ text, isVisible, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [buttonText, setButtonText] = useState('음성으로 전달');

  // TTS 상태 변경 리스너
  useEffect(() => {
    const handleStateChange = (state, error) => {
      switch (state) {
        case 'playing':
          setIsPlaying(true);
          setButtonText('재생 중...');
          break;
        case 'stopped':
          setIsPlaying(false);
          setButtonText('음성으로 전달');
          break;
        case 'error':
          setIsPlaying(false);
          setButtonText('음성으로 전달');
          alert(`음성 재생 오류: ${error || '알 수 없는 오류'}`);
          break;
      }
    };

    ttsService.onStateChange = handleStateChange;

    return () => {
      ttsService.onStateChange = null;
    };
  }, []);

  // 모달이 닫힐 때 음성 중지
  useEffect(() => {
    if (!isVisible && isPlaying) {
      ttsService.stop();
    }
  }, [isVisible, isPlaying]);

  const handleSpeakClick = () => {
    if (isPlaying) {
      // 재생 중이면 중지
      ttsService.stop();
    } else {
      // 재생 시작
      const success = ttsService.speak(text, {
        rate: 0.9,    // 속도 (조금 느리게)
        pitch: 1.0,   // 피치 (기본)
        volume: 1.0   // 볼륨 (최대)
      });

      if (!success) {
        alert('음성 재생을 지원하지 않는 브라우저입니다.');
      }
    }
  };

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

          {/* 액션 버튼 */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <button
              onClick={handleSpeakClick}
              disabled={!text.trim()}
              className={`btn ${isPlaying ? 'btn-secondary' : 'btn-primary'}`}
              style={{ 
                minWidth: '120px',
                opacity: text.trim() ? 1 : 0.5,
                cursor: text.trim() ? 'pointer' : 'not-allowed',
                position: 'relative'
              }}
            >
              {isPlaying && (
                <span
                  style={{
                    position: 'absolute',
                    left: '8px',
                    animation: 'pulse 1s infinite'
                  }}
                >
                  🔊
                </span>
              )}
              {buttonText}
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

          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
    </>
  );
};

export default BigTextCard;
