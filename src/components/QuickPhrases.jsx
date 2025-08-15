/**
 * QuickPhrases Component
 * 
 * 역할: 자주 사용하는 문구들을 칩 형태로 제공하여 빠른 입력을 가능하게 합니다.
 * 
 * 입력:
 * - phrases: 표시할 문구 배열
 * - onPhraseClick: 문구 클릭 시 호출되는 콜백 함수
 * 
 * 출력:
 * - 칩 형태의 문구 버튼들
 * - 클릭 시 입력창에 삽입
 * 
 * 향후 연동 지점:
 * - 사용자별 맞춤 문구 저장
 * - 문맥에 따른 동적 문구 추천
 */
import phrasesData from '../data/phrases.json';

const QuickPhrases = ({ onPhraseClick }) => {
  const colors = [
    '#E8F5E8', '#FFF3E0', '#E3F2FD', '#F3E5F5', 
    '#FFEBEE', '#F1F8E9', '#E0F2F1', '#FFF8E1',
    '#FCE4EC', '#E8EAF6', '#E0F7FA', '#F9FBE7'
  ];

  return (
    <div
      style={{
        padding: 'var(--spacing-md)',
        backgroundColor: 'var(--white)',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow)',
        margin: 'var(--spacing-md)'
      }}
    >
      <h3
        style={{
          fontSize: 'var(--font-size-lg)',
          fontWeight: '600',
          color: 'var(--text-primary)',
          marginBottom: 'var(--spacing-md)',
          textAlign: 'center'
        }}
      >
        빠른 응답
      </h3>
      
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: 'var(--spacing-sm)',
          maxHeight: '300px',
          overflowY: 'auto'
        }}
      >
        {phrasesData.phrases.map((phrase, index) => (
          <button
            key={index}
            onClick={() => onPhraseClick(phrase)}
            className="btn"
            style={{
              backgroundColor: colors[index % colors.length],
              color: 'var(--text-primary)',
              border: '1px solid #E0E0E0',
              fontSize: 'var(--font-size-sm)',
              fontWeight: '500',
              padding: 'var(--spacing-sm) var(--spacing-md)',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textAlign: 'center',
              minHeight: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              wordBreak: 'keep-all',
              lineHeight: '1.4'
            }}

            aria-label={`${phrase} 선택`}
          >
            {phrase}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickPhrases;
