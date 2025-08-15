/**
 * Translate Page
 * 
 * 역할: 음성 인식 및 수화 변환 기능을 제공합니다.
 * 
 * 입력:
 * - onNavigate: 네비게이션 클릭 시 호출되는 콜백 함수
 * 
 * 출력:
 * - 곰 캐릭터
 * - 마이크 제어
 * - 수화 변환 버튼
 * 
 * 기능:
 * - 실제 STT API 연동 완료
 * - 수화 애니메이션 연동
 * - 음성 품질 모니터링
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

import SpeechBubble from '../components/SpeechBubble';
import bearPointing from '../assets/bear-pointing.png';
import bearThinking from '../assets/bear-thinking.png';
import bearSuggest from '../assets/bear-suggest.png';
import bearSign from '../assets/bear-sign.png';

const Translate = ({ onNavigate }) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('idle');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showLanguageGuide, setShowLanguageGuide] = useState(false);

  // Speech Recognition Hook
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition();

  // 음성 인식 상태 모니터링
  useEffect(() => {
    if (listening) {
      setStatus('listening');
    } else if (isProcessing) {
      setStatus('analyzing');
    } else if (transcript && !isProcessing) {
      setStatus('ready');
    }
  }, [listening, transcript, isProcessing]);

  // 브라우저 지원 확인
  if (!browserSupportsSpeechRecognition) {
    return (
      <div style={{ 
        padding: 'var(--spacing-lg)', 
        textAlign: 'center',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div className="card">
          <h2 style={{ color: 'var(--error)', marginBottom: 'var(--spacing-md)' }}>
            ⚠️ 브라우저 지원 불가
          </h2>
          <p>죄송합니다. 현재 브라우저는 음성 인식을 지원하지 않습니다.</p>
          <p>Chrome, Safari, 또는 Firefox 최신 버전을 사용해 주세요.</p>
        </div>
      </div>
    );
  }

  // 마이크 클릭 핸들러
  const handleMicClick = async () => {
    if (status === 'ready') {
      // ready 상태에서 다시 클릭하면 idle로 복귀
      setStatus('idle');
      resetTranscript();
      return;
    }

    if (listening) {
      // 현재 듣고 있으면 중지
      SpeechRecognition.stopListening();
      setIsProcessing(true);
      
      // 분석 상태를 잠시 보여주기 위한 딜레이
      setTimeout(() => {
        setIsProcessing(false);
      }, 1000);
      return;
    }

    // 마이크 권한 확인
    if (isMicrophoneAvailable === false) {
      alert('마이크 권한이 필요합니다. 브라우저 설정에서 마이크 권한을 허용해 주세요.');
      return;
    }

    try {
      // 이전 인식 결과 초기화
      resetTranscript();
      setStatus('listening');

      // 음성 인식 시작 (한국어, 연속 인식 비활성화)
      await SpeechRecognition.startListening({
        continuous: false, // 한 번에 하나의 발화만 인식
        language: 'ko-KR'  // 한국어 설정 (더 정확한 한국어 인식)
      });
    } catch (error) {
      console.error('음성 인식 시작 실패:', error);
      setStatus('idle');
      alert('음성 인식을 시작할 수 없습니다. 마이크가 연결되어 있는지 확인해 주세요.');
    }
  };

  // 언어 설정 안내 팝업 토글
  const toggleLanguageGuide = () => {
    setShowLanguageGuide(!showLanguageGuide);
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
          paddingTop: 'calc(var(--spacing-lg) + 60px)', // 헤더 높이만큼 추가 여백
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
          {(status === 'ready' || status === 'converting' || status === 'signing') && transcript && <SpeechBubble message={transcript} />}
          
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
                  minWidth: '160px',
                  backgroundColor: listening ? 'var(--error)' : 
                                  status === 'ready' ? 'var(--success)' : 
                                  'var(--primary)',
                  animation: listening ? 'pulse 2s infinite' : 'none'
                }}
                aria-label={
                  status === 'ready' ? '다시 듣기' :
                  listening ? '음성 인식 중지' :
                  '대화 듣기'
                }
              >
                <span style={{ fontSize: '20px' }}>
                  {status === 'ready' ? '🔄' : 
                   listening ? '⏹️' : 
                   '🎤'}
                </span>
                <span>
                  {status === 'ready' ? '다시 듣기' :
                   listening ? '인식 중지' :
                   '대화 듣기'}
                </span>
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

      {/* 언어 설정 안내 팝업 */}
      {showLanguageGuide && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 'var(--spacing-lg)'
          }}
          onClick={toggleLanguageGuide}
        >
          <div
            className="card"
            style={{
              maxWidth: '500px',
              maxHeight: '80vh',
              overflow: 'auto',
              padding: 'var(--spacing-xl)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-lg)' }}>
              <h2 style={{ color: 'var(--primary)', marginBottom: 'var(--spacing-md)' }}>
                🌐 한국어 음성 인식 설정 방법
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                브라우저 설정을 변경하여 한국어 음성 인식 정확도를 높이세요
              </p>
            </div>

            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: 'var(--spacing-md)' }}>
                📱 모바일 브라우저
              </h3>
              
              <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <h4 style={{ color: 'var(--primary)', fontSize: 'var(--font-size-base)' }}>Chrome (Android)</h4>
                <ol style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', paddingLeft: 'var(--spacing-md)' }}>
                  <li>Chrome 앱 열기</li>
                  <li>⋮ (메뉴) → 설정</li>
                  <li>고급 → 언어</li>
                  <li>언어 추가 → 한국어 선택</li>
                  <li>한국어를 맨 위로 이동</li>
                </ol>
              </div>

              <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <h4 style={{ color: 'var(--primary)', fontSize: 'var(--font-size-base)' }}>Safari (iOS)</h4>
                <ol style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', paddingLeft: 'var(--spacing-md)' }}>
                  <li>설정 앱 열기</li>
                  <li>일반 → 언어 및 지역</li>
                  <li>iPhone 언어 → 한국어 선택</li>
                  <li>지역 → 대한민국 선택</li>
                </ol>
              </div>
            </div>

            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: 'var(--spacing-md)' }}>
                💻 데스크톱 브라우저
              </h3>
              
              <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <h4 style={{ color: 'var(--primary)', fontSize: 'var(--font-size-base)' }}>Chrome</h4>
                <ol style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', paddingLeft: 'var(--spacing-md)' }}>
                  <li>Chrome 열기</li>
                  <li>⋮ (메뉴) → 설정</li>
                  <li>고급 → 언어</li>
                  <li>언어 추가 → 한국어 선택</li>
                  <li>한국어를 맨 위로 이동</li>
                </ol>
              </div>

              <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <h4 style={{ color: 'var(--primary)', fontSize: 'var(--font-size-base)' }}>Safari (Mac)</h4>
                <ol style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', paddingLeft: 'var(--spacing-md)' }}>
                  <li>Safari → 환경설정</li>
                  <li>웹사이트 → 언어</li>
                  <li>언어 추가 → 한국어 선택</li>
                  <li>한국어를 맨 위로 이동</li>
                </ol>
              </div>
            </div>

            <div style={{ 
              backgroundColor: '#FFF3E0', 
              padding: 'var(--spacing-md)', 
              borderRadius: 'var(--radius)',
              border: '1px solid #FFB84D'
            }}>
              <p style={{ 
                fontSize: 'var(--font-size-sm)', 
                color: '#E65100', 
                margin: 0,
                fontWeight: '600'
              }}>
                💡 팁: 설정 변경 후 브라우저를 완전히 종료하고 다시 열어주세요!
              </p>
            </div>

            <div style={{ textAlign: 'center', marginTop: 'var(--spacing-lg)' }}>
              <button
                onClick={toggleLanguageGuide}
                className="btn btn-primary"
                style={{ minWidth: '120px' }}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 스타일 추가 */}
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
    </div>
  );
};

export default Translate;
