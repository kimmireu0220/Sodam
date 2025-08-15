/**
 * Speak Page
 * 
 * 역할: 텍스트 입력 및 빠른 응답 기능을 제공합니다.
 * 
 * 입력:
 * - onNavigate: 네비게이션 클릭 시 호출되는 콜백 함수
 * 
 * 출력:
 * - 텍스트 입력창
 * - 빠른 응답 문구들
 * - BigTextCard 모달
 * 
 * 향후 연동 지점:
 * - TTS 기능 연동
 * - 사용자 맞춤 문구 저장
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import QuickPhrases from '../components/QuickPhrases';
import BigTextCard from '../components/BigTextCard';
import bear from '../assets/bear-pointing.png';

const Speak = ({ onNavigate }) => {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handlePhraseClick = (phrase) => {
    setText(phrase);
  };

  const handleSubmit = () => {
    if (text.trim()) {
      setShowModal(true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
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
            텍스트로 말하기
          </h1>
          <p
            style={{
              fontSize: 'var(--font-size-base)',
              color: 'var(--text-secondary)',
              margin: 0,
              lineHeight: '1.6'
            }}
          >
            직접 입력 또는 상용구를 선택하여 음성으로 전달합니다
          </p>
        </div>

        {/* 곰 캐릭터 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: 'var(--spacing-lg)'
          }}
        >
          <img
            src={bear}
            alt="소담 곰 캐릭터"
            style={{
              width: '200px',
              height: 'auto',
              filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))'
            }}
          />
        </div>

        {/* 직접 입력 카드 */}
        <div className="card">
          <h3
            style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: 'var(--spacing-md)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)'
            }}
          >
            ✏️ 직접 입력
          </h3>
          
          <div
            style={{
              position: 'relative',
              marginBottom: 'var(--spacing-md)'
            }}
          >
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="전달하고 싶은 메시지를 입력하세요..."
              style={{
                width: '100%',
                minHeight: '120px',
                padding: 'var(--spacing-md)',
                border: '2px solid #E0E0E0',
                borderRadius: 'var(--radius)',
                fontSize: 'var(--font-size-base)',
                fontFamily: 'inherit',
                resize: 'vertical',
                outline: 'none',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--primary)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#E0E0E0';
              }}
              aria-label="메시지 입력창"
            />
            
            {/* 전송 버튼 */}
            <button
              onClick={handleSubmit}
              disabled={!text.trim()}
              className="btn btn-primary"
              style={{
                position: 'absolute',
                bottom: 'var(--spacing-sm)',
                right: 'var(--spacing-sm)',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                opacity: text.trim() ? 1 : 0.5,
                cursor: text.trim() ? 'pointer' : 'not-allowed'
              }}
              aria-label="메시지 전송"
            >
              →
            </button>
          </div>
          
          <p
            style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--text-secondary)',
              margin: 0,
              textAlign: 'center'
            }}
          >
            Enter 키를 눌러 전송할 수 있습니다
          </p>
        </div>

        {/* 상용구 선택 카드 */}
        <div className="card">
          <h3
            style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: 'var(--spacing-md)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)'
            }}
          >
            📝 상용구 선택
          </h3>
          <p
            style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--text-secondary)',
              marginBottom: 'var(--spacing-md)',
              lineHeight: '1.5'
            }}
          >
            자주 사용하는 문구를 선택하여 빠르게 입력할 수 있습니다
          </p>
          <QuickPhrases onPhraseClick={handlePhraseClick} />
        </div>
      </div>

      {/* 하단 네비게이션 */}
      <BottomNav currentPage="speak" onNavigate={onNavigate} />

      {/* BigTextCard 모달 */}
      <BigTextCard
        text={text}
        isVisible={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default Speak;
