/**
 * Statistics Section Component
 * 
 * 역할: 사용자의 앱 사용 통계를 시각적으로 표시하는 대시보드 섹션
 * 
 * 입력:
 * - 없음 (localStorage에서 직접 데이터 로드)
 * 
 * 출력:
 * - 4개의 통계 카드 (수화 변환, 텍스트 입력, 자주 사용하는 문구, 사용 패턴)
 * - 최근 7일 사용 패턴 막대 차트
 * - 사용 비율 및 추가 통계 정보
 * 
 * 상호작용:
 * - 막대 차트 hover/focus 시 상세 정보 표시
 * - 자주 사용하는 문구 리스트 표시
 * 
 * 접근성:
 * - 차트 데이터의 텍스트 설명 제공
 * - 키보드 네비게이션 지원
 * - 적절한 색상 대비 및 포커스 스타일
 * - 스크린 리더용 aria-label 및 설명
 */

import { useState, useEffect, useMemo } from 'react';
import { getItem } from '../utils/storage';
import { 
  formatSecondsToHhmm, 
  formatNumber, 
  getTopPhrases, 
  getDailySeries, 
  normalizeForChart,
  calculateRatio,
  calculateAverageSessionTime,
  generateChartDescription,
  analyzeUsagePattern
} from '../utils/statistics';

const StatisticsSection = () => {
  const [statistics, setStatistics] = useState(null);
  const [customPhrases, setCustomPhrases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 데이터 로드
  useEffect(() => {
    const loadData = () => {
      try {
        const stats = getItem('statistics');
        const phrases = getItem('customPhrases', []);
        
        setStatistics(stats);
        setCustomPhrases(phrases);
        setIsLoading(false);
      } catch (error) {
        console.error('통계 데이터 로드 중 오류:', error);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // 통계 데이터 계산
  const computedStats = useMemo(() => {
    if (!statistics) return null;

    // 기본 카운트
    const signLanguageCount = statistics.signLanguageCount || 0;
    const textInputCount = statistics.textInputCount || 0;
    const totalUsageTime = statistics.totalUsageTime || 0;

    // 상위 문구
    const topPhrases = getTopPhrases(customPhrases, 3);

    // 일별 사용 패턴 (최근 7일)
    const dailySeries = getDailySeries(statistics.dailyUsage || {}, 7);
    const chartData = normalizeForChart(dailySeries);

    // 사용 비율 (수화 vs 텍스트)
    const usageRatio = calculateRatio(signLanguageCount, textInputCount);

    // 평균 세션 시간
    const avgSessionTime = calculateAverageSessionTime(totalUsageTime);

    // 사용 패턴 분석
    const usagePattern = analyzeUsagePattern(statistics.dailyUsage || {}, 30);

    return {
      signLanguageCount,
      textInputCount,
      totalUsageTime,
      topPhrases,
      chartData,
      usageRatio,
      avgSessionTime,
      usagePattern
    };
  }, [statistics, customPhrases]);

  // 로딩 상태
  if (isLoading) {
    return (
      <div style={{ padding: 'var(--spacing-lg)', textAlign: 'center' }}>
        <div style={{ 
          fontSize: 'var(--font-size-base)', 
          color: 'var(--text-secondary)' 
        }}>
          통계 데이터를 불러오는 중...
        </div>
      </div>
    );
  }

  // 데이터 없음
  if (!computedStats) {
    return (
      <div style={{ padding: 'var(--spacing-lg)', textAlign: 'center' }}>
        <div style={{ 
          fontSize: 'var(--font-size-base)', 
          color: 'var(--text-secondary)' 
        }}>
          통계 데이터를 찾을 수 없습니다.
        </div>
      </div>
    );
  }

  const {
    signLanguageCount,
    textInputCount,
    totalUsageTime,
    topPhrases,
    chartData,
    usageRatio,
    avgSessionTime,
    usagePattern
  } = computedStats;

  // 차트 설명 생성
  const chartDescription = generateChartDescription(chartData, "최근 7일 사용 패턴");

  return (
    <div
      style={{
        padding: 'var(--spacing-mobile)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-lg)'
      }}
    >
      {/* 섹션 제목 */}
      <div style={{ textAlign: 'center' }}>
        <h2
          style={{
            fontSize: 'var(--font-mobile-xl)',
            fontWeight: '700',
            color: 'var(--text-primary)',
            margin: '0 0 var(--spacing-sm) 0'
          }}
        >
          📊 사용 통계
        </h2>
        <p
          style={{
            fontSize: 'var(--font-mobile-sm)',
            color: 'var(--text-secondary)',
            margin: 0
          }}
        >
          지금까지의 소담 사용 패턴을 확인해보세요
        </p>
      </div>

      {/* 통계 카드 그리드 */}
      <div
        className="stats-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 'var(--spacing-md)',
        }}
      >
        {/* 수화 변환 카드 */}
        <div className="card" style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              margin: '0 auto var(--spacing-md) auto'
            }}
            aria-hidden="true"
          >
            🤟
          </div>
          <h3
            style={{
              fontSize: 'var(--font-size-3xl)',
              fontWeight: '800',
              color: 'var(--primary)',
              margin: '0 0 var(--spacing-xs) 0'
            }}
          >
            {formatNumber(signLanguageCount)}
          </h3>
          <p
            style={{
              fontSize: 'var(--font-size-base)',
              fontWeight: '600',
              color: 'var(--text-primary)',
              margin: '0 0 var(--spacing-xs) 0'
            }}
          >
            수화 변환
          </p>
          <p
            style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--text-secondary)',
              margin: 0
            }}
          >
            음성을 수화로 변환한 횟수
          </p>
        </div>

        {/* 텍스트 입력 카드 */}
        <div className="card" style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'var(--secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              margin: '0 auto var(--spacing-md) auto'
            }}
            aria-hidden="true"
          >
            ✏️
          </div>
          <h3
            style={{
              fontSize: 'var(--font-size-3xl)',
              fontWeight: '800',
              color: 'var(--secondary)',
              margin: '0 0 var(--spacing-xs) 0'
            }}
          >
            {formatNumber(textInputCount)}
          </h3>
          <p
            style={{
              fontSize: 'var(--font-size-base)',
              fontWeight: '600',
              color: 'var(--text-primary)',
              margin: '0 0 var(--spacing-xs) 0'
            }}
          >
            텍스트 입력
          </p>
          <p
            style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--text-secondary)',
              margin: 0
            }}
          >
            직접 입력한 텍스트 횟수
          </p>
        </div>

        {/* 자주 사용하는 문구 카드 */}
        <div className="card">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-md)',
              marginBottom: 'var(--spacing-md)'
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'var(--success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                flexShrink: 0
              }}
              aria-hidden="true"
            >
              📝
            </div>
            <div>
              <h3
                style={{
                  fontSize: 'var(--font-size-lg)',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  margin: '0 0 var(--spacing-xs) 0'
                }}
              >
                자주 사용하는 문구
              </h3>
              <p
                style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--text-secondary)',
                  margin: 0
                }}
              >
                상위 3개 문구
              </p>
            </div>
          </div>
          
          {topPhrases.length > 0 ? (
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-sm)'
              }}
            >
              {topPhrases.map((phrase, index) => (
                <li
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 'var(--spacing-sm)',
                    backgroundColor: 'var(--background)',
                    borderRadius: 'calc(var(--radius) / 2)',
                    fontSize: 'var(--font-size-sm)'
                  }}
                >
                  <span
                    style={{
                      color: 'var(--text-primary)',
                      flex: 1,
                      marginRight: 'var(--spacing-sm)'
                    }}
                  >
                    {phrase.text}
                  </span>
                  <span
                    style={{
                      color: 'var(--text-secondary)',
                      fontWeight: '600',
                      fontSize: 'var(--font-size-sm)'
                    }}
                    aria-label={`${phrase.usageCount}번 사용됨`}
                  >
                    {formatNumber(phrase.usageCount)}회
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p
              style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--text-secondary)',
                textAlign: 'center',
                padding: 'var(--spacing-md)',
                margin: 0
              }}
            >
              아직 사용한 문구가 없습니다.
            </p>
          )}
        </div>

        {/* 사용 패턴 차트 카드 */}
        <div className="card">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-md)',
              marginBottom: 'var(--spacing-lg)'
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: '#6366F1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                flexShrink: 0
              }}
              aria-hidden="true"
            >
              📈
            </div>
            <div>
              <h3
                style={{
                  fontSize: 'var(--font-size-lg)',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  margin: '0 0 var(--spacing-xs) 0'
                }}
              >
                사용 패턴
              </h3>
              <p
                style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--text-secondary)',
                  margin: 0
                }}
              >
                최근 7일간 활동
              </p>
            </div>
          </div>

          {/* 막대 차트 */}
          <div
            role="img"
            aria-label={chartDescription}
            style={{
              marginBottom: 'var(--spacing-md)'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'end',
                justifyContent: 'space-between',
                height: '120px',
                gap: '4px',
                padding: '0 var(--spacing-sm)',
                marginBottom: 'var(--spacing-sm)'
              }}
            >
              {chartData.map((item) => (
                <div
                  key={item.date}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    flex: 1,
                    position: 'relative'
                  }}
                >
                  {/* 막대 */}
                  <div
                    tabIndex={0}
                    role="button"
                    aria-label={`${item.dayName}요일: ${formatNumber(item.count)}회 사용`}
                    className="chart-bar"
                    style={{
                      width: '100%',
                      minWidth: '32px',
                      maxWidth: '32px',
                      height: `${Math.max(item.percentage, 24)}px`,
                      backgroundColor: item.count > 0 ? 'var(--primary)' : '#E5E7EB',
                      borderRadius: '4px 4px 0 0',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'all 0.2s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.outline = '3px solid var(--primary)';
                      e.target.style.outlineOffset = '2px';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.outline = 'none';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                    onMouseEnter={(e) => {
                      if (window.matchMedia('(hover: hover)').matches) {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (window.matchMedia('(hover: hover)').matches) {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }
                    }}
                    onTouchStart={(e) => {
                      e.target.style.transform = 'scale(0.95)';
                    }}
                    onTouchEnd={(e) => {
                      setTimeout(() => {
                        e.target.style.transform = 'scale(1)';
                      }, 100);
                    }}
                    title={`${item.dayName}요일: ${formatNumber(item.count)}회`}
                  />
                  
                  {/* 요일 라벨 */}
                  <span
                    style={{
                      fontSize: '11px',
                      color: 'var(--text-secondary)',
                      marginTop: 'var(--spacing-xs)',
                      fontWeight: '500'
                    }}
                    aria-hidden="true"
                  >
                    {item.dayName}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 추가 통계 정보 */}
      <div className="card">
        <h3
          style={{
            fontSize: 'var(--font-size-lg)',
            fontWeight: '600',
            color: 'var(--text-primary)',
            margin: '0 0 var(--spacing-md) 0',
            textAlign: 'center'
          }}
        >
          📋 상세 통계
        </h3>
        
        <div
          className="stats-grid"
          style={{
            textAlign: 'center'
          }}
        >
          <div>
            <div
              style={{
                fontSize: 'var(--font-size-xl)',
                fontWeight: '700',
                color: 'var(--primary)',
                marginBottom: 'var(--spacing-xs)'
              }}
            >
              {formatSecondsToHhmm(totalUsageTime)}
            </div>
            <div
              style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--text-secondary)'
              }}
            >
              총 사용 시간
            </div>
          </div>

          <div>
            <div
              style={{
                fontSize: 'var(--font-size-xl)',
                fontWeight: '700',
                color: 'var(--secondary)',
                marginBottom: 'var(--spacing-xs)'
              }}
            >
              {avgSessionTime}
            </div>
            <div
              style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--text-secondary)'
              }}
            >
              평균 세션 시간
            </div>
          </div>

          <div>
            <div
              style={{
                fontSize: 'var(--font-size-xl)',
                fontWeight: '700',
                color: 'var(--success)',
                marginBottom: 'var(--spacing-xs)'
              }}
            >
              {usageRatio.value1Ratio}% : {usageRatio.value2Ratio}%
            </div>
            <div
              style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--text-secondary)'
              }}
            >
              수화 : 텍스트 비율
            </div>
          </div>

          <div>
            <div
              style={{
                fontSize: 'var(--font-size-xl)',
                fontWeight: '700',
                color: '#6366F1',
                marginBottom: 'var(--spacing-xs)'
              }}
            >
              {usagePattern.consistency}%
            </div>
            <div
              style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--text-secondary)'
              }}
            >
              사용 일관성
            </div>
          </div>
        </div>

        {usagePattern.mostActiveDay && (
          <div
            style={{
              marginTop: 'var(--spacing-md)',
              padding: 'var(--spacing-sm)',
              backgroundColor: 'var(--background)',
              borderRadius: 'calc(var(--radius) / 2)',
              textAlign: 'center'
            }}
          >
            <span
              style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--text-secondary)'
              }}
            >
              가장 활발한 요일: 
            </span>
            <strong
              style={{
                color: 'var(--primary)',
                marginLeft: 'var(--spacing-xs)'
              }}
            >
              {usagePattern.mostActiveDay}요일
            </strong>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatisticsSection;