/**
 * Statistics Utility
 * 
 * 역할: 통계 데이터 처리 및 분석을 위한 유틸리티 함수들
 * 
 * 기능:
 * - 시간 포맷팅 (초 → 시:분)
 * - 최근 N일 데이터 생성
 * - 상위 N개 추출
 * - 비율 계산
 * - 차트 데이터 생성
 * 
 * 상호작용:
 * - StatisticsSection에서 차트 및 카드 데이터 생성
 * - MyPage에서 통계 정보 표시
 * 
 * 접근성:
 * - 숫자 포맷팅을 통한 가독성 향상
 * - 차트 데이터의 접근 가능한 형태 변환
 */

/**
 * 초 단위 시간을 시:분 형태로 포맷팅
 * @param {number} totalSeconds - 총 초
 * @returns {string} "0시간 30분" 형태의 문자열
 */
export const formatSecondsToHhmm = (totalSeconds) => {
  if (!totalSeconds || totalSeconds < 0) {
    return "0분";
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours === 0) {
    return `${minutes}분`;
  }
  
  if (minutes === 0) {
    return `${hours}시간`;
  }
  
  return `${hours}시간 ${minutes}분`;
};

/**
 * 숫자를 천 단위로 구분하여 포맷팅
 * @param {number} num - 숫자
 * @returns {string} "1,234" 형태의 문자열
 */
export const formatNumber = (num) => {
  if (typeof num !== 'number') {
    return '0';
  }
  return num.toLocaleString('ko-KR');
};

/**
 * 자주 사용하는 상용구 상위 N개 추출
 * @param {array} customPhrases - 개인 상용구 배열
 * @param {number} topN - 상위 몇 개까지 (기본값: 3)
 * @returns {array} 사용 빈도 순으로 정렬된 상용구 배열
 */
export const getTopPhrases = (customPhrases = [], topN = 3) => {
  if (!Array.isArray(customPhrases)) {
    return [];
  }

  return customPhrases
    .filter(phrase => phrase.usageCount > 0)
    .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
    .slice(0, topN)
    .map(phrase => ({
      text: phrase.text,
      usageCount: phrase.usageCount || 0
    }));
};

/**
 * 최근 N일간의 일별 사용량 데이터 생성
 * @param {object} dailyUsageData - { "2024-01-15": 5, ... } 형태의 데이터
 * @param {number} days - 최근 몇 일 (기본값: 7일)
 * @returns {array} 날짜순 정렬된 사용량 배열
 */
export const getDailySeries = (dailyUsageData = {}, days = 7) => {
  const series = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    const dayName = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
    
    series.push({
      date: dateString,
      dayName,
      count: dailyUsageData[dateString] || 0,
      displayDate: `${date.getMonth() + 1}/${date.getDate()}`
    });
  }
  
  return series;
};

/**
 * 최근 N주간의 주별 사용량 데이터 생성
 * @param {object} dailyUsageData - 일별 사용량 데이터
 * @param {number} weeks - 최근 몇 주 (기본값: 4주)
 * @returns {array} 주별 사용량 배열
 */
export const getWeeklySeries = (dailyUsageData = {}, weeks = 4) => {
  const series = [];
  const today = new Date();
  
  for (let i = weeks - 1; i >= 0; i--) {
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() - (i * 7));
    
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 6);
    
    let weeklyCount = 0;
    
    // 해당 주의 7일간 사용량 합계
    for (let day = 0; day < 7; day++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + day);
      const dateString = currentDate.toISOString().split('T')[0];
      weeklyCount += dailyUsageData[dateString] || 0;
    }
    
    series.push({
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      count: weeklyCount,
      displayDate: `${startDate.getMonth() + 1}/${startDate.getDate()}-${endDate.getMonth() + 1}/${endDate.getDate()}`
    });
  }
  
  return series;
};

/**
 * 최근 N개월간의 월별 사용량 데이터 생성
 * @param {object} dailyUsageData - 일별 사용량 데이터
 * @param {number} months - 최근 몇 개월 (기본값: 12개월)
 * @returns {array} 월별 사용량 배열
 */
export const getMonthlySeries = (dailyUsageData = {}, months = 12) => {
  const series = [];
  const today = new Date();
  
  for (let i = months - 1; i >= 0; i--) {
    const targetDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth();
    
    // 해당 월의 마지막 날 구하기
    const lastDay = new Date(year, month + 1, 0).getDate();
    
    let monthlyCount = 0;
    
    // 해당 월의 모든 날짜 확인
    for (let day = 1; day <= lastDay; day++) {
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      monthlyCount += dailyUsageData[dateString] || 0;
    }
    
    series.push({
      year,
      month: month + 1,
      count: monthlyCount,
      displayDate: `${year}년 ${month + 1}월`
    });
  }
  
  return series;
};

/**
 * 차트용 데이터 정규화 (최댓값 기준 백분율)
 * @param {array} series - 시계열 데이터 배열
 * @param {string} valueKey - 값이 들어있는 키 이름 (기본값: 'count')
 * @returns {array} 백분율이 추가된 시계열 데이터
 */
export const normalizeForChart = (series, valueKey = 'count') => {
  if (!Array.isArray(series) || series.length === 0) {
    return [];
  }

  const maxValue = Math.max(...series.map(item => item[valueKey] || 0));
  
  if (maxValue === 0) {
    return series.map(item => ({ ...item, percentage: 0 }));
  }

  return series.map(item => ({
    ...item,
    percentage: Math.round(((item[valueKey] || 0) / maxValue) * 100)
  }));
};

/**
 * 두 값의 비율 계산
 * @param {number} value1 - 첫 번째 값
 * @param {number} value2 - 두 번째 값
 * @param {boolean} asPercentage - 백분율로 반환할지 여부 (기본값: true)
 * @returns {object} { value1Ratio, value2Ratio, total } 형태의 객체
 */
export const calculateRatio = (value1 = 0, value2 = 0, asPercentage = true) => {
  const total = value1 + value2;
  
  if (total === 0) {
    return {
      value1Ratio: 0,
      value2Ratio: 0,
      total: 0
    };
  }

  const value1Ratio = (value1 / total) * (asPercentage ? 100 : 1);
  const value2Ratio = (value2 / total) * (asPercentage ? 100 : 1);

  return {
    value1Ratio: Math.round(value1Ratio),
    value2Ratio: Math.round(value2Ratio),
    total
  };
};

/**
 * 평균 세션 시간 계산 (추정)
 * @param {number} totalUsageTime - 총 사용 시간 (초)
 * @param {number} totalSessions - 총 세션 수
 * @returns {string} 평균 세션 시간 문자열 또는 "—" (데이터 없음)
 */
export const calculateAverageSessionTime = (totalUsageTime = 0, totalSessions = null) => {
  // 세션 수가 없으면 총 사용량 기반으로 추정
  // 가정: 하루 평균 3-5회 사용, 1회당 3-10분
  if (!totalSessions) {
    if (totalUsageTime < 60) {
      return "—"; // 1분 미만이면 의미 없음
    }
    
    // 평균 5분 세션으로 추정
    const estimatedSessions = Math.max(1, Math.floor(totalUsageTime / 300));
    const avgTime = totalUsageTime / estimatedSessions;
    return formatSecondsToHhmm(Math.round(avgTime));
  }

  if (totalSessions === 0) {
    return "—";
  }

  const avgTime = totalUsageTime / totalSessions;
  return formatSecondsToHhmm(Math.round(avgTime));
};

/**
 * 사용 패턴 분석
 * @param {object} dailyUsageData - 일별 사용량 데이터
 * @param {number} days - 분석할 기간 (일)
 * @returns {object} 사용 패턴 분석 결과
 */
export const analyzeUsagePattern = (dailyUsageData = {}, days = 30) => {
  const series = getDailySeries(dailyUsageData, days);
  const counts = series.map(item => item.count);
  
  if (counts.length === 0) {
    return {
      averageDaily: 0,
      mostActiveDay: null,
      totalDays: 0,
      activeDays: 0,
      consistency: 0
    };
  }

  const total = counts.reduce((sum, count) => sum + count, 0);
  const activeDays = counts.filter(count => count > 0).length;
  const averageDaily = Math.round(total / counts.length * 10) / 10;
  
  // 가장 활발한 요일 찾기
  const dayGroups = {};
  series.forEach(item => {
    const day = new Date(item.date).getDay();
    if (!dayGroups[day]) dayGroups[day] = [];
    dayGroups[day].push(item.count);
  });

  let mostActiveDay = null;
  let maxDayAverage = 0;
  
  Object.entries(dayGroups).forEach(([day, counts]) => {
    const avg = counts.reduce((sum, c) => sum + c, 0) / counts.length;
    if (avg > maxDayAverage) {
      maxDayAverage = avg;
      mostActiveDay = ['일', '월', '화', '수', '목', '금', '토'][parseInt(day)];
    }
  });

  // 일관성 점수 (0-100): 사용하지 않은 날이 적을수록 높음
  const consistency = Math.round((activeDays / counts.length) * 100);

  return {
    averageDaily,
    mostActiveDay,
    totalDays: counts.length,
    activeDays,
    consistency
  };
};

/**
 * 차트 접근성을 위한 텍스트 설명 생성
 * @param {array} series - 시계열 데이터
 * @param {string} title - 차트 제목
 * @returns {string} 스크린 리더용 차트 설명
 */
export const generateChartDescription = (series, title = "차트") => {
  if (!Array.isArray(series) || series.length === 0) {
    return `${title}: 데이터가 없습니다.`;
  }

  const total = series.reduce((sum, item) => sum + (item.count || 0), 0);
  const maxValue = Math.max(...series.map(item => item.count || 0));
  const maxIndex = series.findIndex(item => item.count === maxValue);
  
  let description = `${title}: 총 ${series.length}개 데이터 포인트, 전체 합계 ${formatNumber(total)}회`;
  
  if (maxValue > 0) {
    const maxItem = series[maxIndex];
    const maxLabel = maxItem.displayDate || maxItem.dayName || `${maxIndex + 1}번째`;
    description += `. 최고값은 ${maxLabel}의 ${formatNumber(maxValue)}회입니다.`;
  }

  return description;
};