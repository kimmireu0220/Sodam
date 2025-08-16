/**
 * KSL 변환 결과 표시 컴포넌트
 */

const KSLResultCard = ({ original, kslResult }) => {
  if (!kslResult) return null;

  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: 'var(--radius)',
        padding: 'var(--spacing-lg)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        marginBottom: 'var(--spacing-lg)',
        border: '2px solid var(--primary)'
      }}
    >
      <h3
        style={{
          fontSize: 'var(--font-size-lg)',
          fontWeight: '600',
          color: 'var(--primary)',
          margin: '0 0 var(--spacing-md) 0',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--spacing-sm)'
        }}
      >
        🤟 KSL 변환 결과
      </h3>

      {/* 가로 배치 컨테이너 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 'var(--spacing-md)',
          alignItems: 'stretch',
          minHeight: '80px'
        }}
      >
        {/* 한국어 원본 - 왼쪽 */}
        <div
          style={{
            flex: 1,
            padding: 'var(--spacing-md)',
            backgroundColor: '#f8f9fa',
            borderRadius: 'var(--radius)',
            border: '1px solid #e9ecef',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <h4
            style={{
              fontSize: 'var(--font-size-base)',
              fontWeight: '600',
              color: 'var(--text-primary)',
              margin: '0 0 var(--spacing-sm) 0',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-xs)',
              whiteSpace: 'nowrap'
            }}
          >
            🇰🇷 한국어
          </h4>
          <p
            style={{
              fontSize: 'var(--font-size-base)',
              color: 'var(--text-primary)',
              margin: 0,
              lineHeight: '1.4',
              wordBreak: 'keep-all',
              overflowWrap: 'break-word'
            }}
          >
            "{original}"
          </p>
        </div>

        {/* KSL 글로스 - 오른쪽 */}
        <div
          style={{
            flex: 1,
            padding: 'var(--spacing-md)',
            backgroundColor: '#e8f5e8',
            borderRadius: 'var(--radius)',
            border: '1px solid #4caf50',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <h4
            style={{
              fontSize: 'var(--font-size-base)',
              fontWeight: '600',
              color: 'var(--success)',
              margin: '0 0 var(--spacing-sm) 0',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-xs)',
              whiteSpace: 'nowrap'
            }}
          >
            🤟 KSL 글로스
          </h4>
          <p
            style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: '600',
              color: 'var(--success)',
              margin: 0,
              lineHeight: '1.4',
              wordBreak: 'keep-all',
              overflowWrap: 'break-word'
            }}
          >
            "{kslResult.gloss}"
          </p>
        </div>
      </div>

      {/* 신뢰도 - 하단 */}
      {kslResult.confidence !== undefined && (
        <div
          style={{
            marginTop: 'var(--spacing-md)',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <div
            style={{
              width: '100%',
              padding: 'var(--spacing-sm) var(--spacing-md)',
              backgroundColor: '#f0f8ff',
              borderRadius: 'var(--radius)',
              border: '1px solid #87ceeb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <p
              style={{
                fontSize: 'var(--font-size-sm)',
                color: '#0066cc',
                margin: 0,
                fontWeight: '500',
                whiteSpace: 'nowrap'
              }}
            >
              변환 신뢰도: {Math.round(kslResult.confidence * 100)}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default KSLResultCard;
