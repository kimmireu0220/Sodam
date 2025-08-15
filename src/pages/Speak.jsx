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
 * - 수화 애니메이션 연동
 * - 사용자 맞춤 문구 저장
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuickPhrases from '../components/QuickPhrases';
import BigTextCard from '../components/BigTextCard';

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

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--background)',
        paddingBottom: '80px' // 하단 네비게이션 공간
      }}
    >
      {/* 헤더 */}
      <div
        style={{
          backgroundColor: 'var(--white)',
          padding: 'var(--spacing-md)',
          boxShadow: 'var(--shadow)',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-md)'
          }}
        >
          <button
            onClick={() => navigate('/home')}
            className="btn"
            style={{
              background: 'none',
              border: 'none',
              borderRadius: '50%',
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#F0F0F0';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
            aria-label="뒤로 가기"
          >
            ←
          </button>
          
          <h1
            style={{
              fontSize: 'var(--font-size-xl)',
              fontWeight: '600',
              color: 'var(--text-primary)',
              margin: 0
            }}
          >
            텍스트로 말하기
          </h1>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div
        style={{
          padding: 'var(--spacing-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-xl)'
        }}
      >
        {/* 텍스트 입력 카드 */}
        <div className="card">
          <h3
            style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: 'var(--spacing-md)'
            }}
          >
            메시지 입력
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

        {/* 빠른 응답 */}
        <QuickPhrases onPhraseClick={handlePhraseClick} />
      </div>

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
