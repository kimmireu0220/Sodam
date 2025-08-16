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
          alignItems: 'flex-start'
        }}
      >
        {/* 한국어 원본 - 왼쪽 */}
        <div
          style={{
            flex: 1,
            padding: 'var(--spacing-md)',
            backgroundColor: '#f8f9fa',
            borderRadius: 'var(--radius)',
            border: '1px solid #e9ecef'
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
              gap: 'var(--spacing-xs)'
            }}
          >
            🇰🇷 한국어
          </h4>
          <p
            style={{
              fontSize: 'var(--font-size-base)',
              color: 'var(--text-primary)',
              margin: 0,
              lineHeight: '1.5'
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
            border: '1px solid #4caf50'
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
              gap: 'var(--spacing-xs)'
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
              lineHeight: '1.5'
            }}
          >
            "{kslResult.gloss}"
          </p>
        </div>
      </div>

      {/* 태그와 신뢰도 - 하단 */}
      <div
        style={{
          marginTop: 'var(--spacing-md)',
          display: 'flex',
          flexDirection: 'row',
          gap: 'var(--spacing-md)',
          alignItems: 'center'
        }}
      >
        {/* 태그 */}
        {kslResult.tags && (
          <div
            style={{
              flex: 1,
              padding: 'var(--spacing-sm) var(--spacing-md)',
              backgroundColor: '#fff3e0',
              borderRadius: 'var(--radius)',
              border: '1px solid #ffb74d'
            }}
          >
            <p
              style={{
                fontSize: 'var(--font-size-sm)',
                color: '#e65100',
                margin: 0,
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)'
              }}
            >
              🏷️ 태그: {kslResult.tags}
            </p>
          </div>
        )}

        {/* 신뢰도 */}
        {kslResult.confidence !== undefined && (
          <div
            style={{
              flex: 1,
              textAlign: 'center',
              padding: 'var(--spacing-sm) var(--spacing-md)',
              backgroundColor: '#f0f8ff',
              borderRadius: 'var(--radius)',
              border: '1px solid #87ceeb'
            }}
          >
            <p
              style={{
                fontSize: 'var(--font-size-sm)',
                color: '#0066cc',
                margin: 0,
                fontWeight: '500'
              }}
            >
              변환 신뢰도: {Math.round(kslResult.confidence * 100)}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KSLResultCard;
