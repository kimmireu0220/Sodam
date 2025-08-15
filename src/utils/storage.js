/**
 * Storage Utility
 * 
 * 역할: localStorage 기반 데이터 관리를 위한 유틸리티 함수들
 * 
 * 기능:
 * - localStorage CRUD 작업
 * - 시드 데이터 초기화
 * - 데이터 타입 안전성 보장
 * - 에러 핸들링
 * 
 * 상호작용:
 * - 모든 컴포넌트에서 데이터 로드/저장 시 사용
 * - 통계 및 사용자 설정 데이터 관리
 * 
 * 접근성:
 * - 데이터 무결성 보장
 * - 실패 시 기본값 반환
 */

// 기본 데이터 스키마
const DEFAULT_STATISTICS = {
  signLanguageCount: 150,
  textInputCount: 89,
  totalUsageTime: 3600, // 초 단위
  favoritePhrases: ["안녕하세요", "감사합니다", "죄송합니다"],
  dailyUsage: {
    "2024-01-15": 5,
    "2024-01-16": 8,
    "2024-01-17": 12,
    "2024-01-18": 6,
    "2024-01-19": 15,
    "2024-01-20": 9,
    "2024-01-21": 11
  }
};

const DEFAULT_CUSTOM_PHRASES = [
  { id: 1, text: "회의가 언제 시작하나요?", category: "업무", isFavorite: true, usageCount: 12, createdAt: "2024-01-15T09:00:00.000Z" },
  { id: 2, text: "점심 드셨나요?", category: "일상", isFavorite: false, usageCount: 8, createdAt: "2024-01-16T12:00:00.000Z" },
  { id: 3, text: "도움이 필요합니다", category: "긴급", isFavorite: true, usageCount: 5, createdAt: "2024-01-17T14:30:00.000Z" },
  { id: 4, text: "화장실은 어디인가요?", category: "일상", isFavorite: false, usageCount: 3, createdAt: "2024-01-18T10:15:00.000Z" },
  { id: 5, text: "프레젠테이션 자료를 확인해주세요", category: "업무", isFavorite: true, usageCount: 15, createdAt: "2024-01-19T16:45:00.000Z" }
];

/**
 * localStorage에서 데이터를 안전하게 가져오는 함수
 * @param {string} key - localStorage 키
 * @param {*} defaultValue - 기본값
 * @returns {*} 파싱된 데이터 또는 기본값
 */
export const getItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item);
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

/**
 * localStorage에 데이터를 안전하게 저장하는 함수
 * @param {string} key - localStorage 키
 * @param {*} value - 저장할 값
 * @returns {boolean} 성공 여부
 */
export const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing localStorage key "${key}":`, error);
    return false;
  }
};

/**
 * localStorage에서 데이터를 업데이트하는 함수
 * @param {string} key - localStorage 키
 * @param {function} updateFn - 업데이트 함수 (oldValue) => newValue
 * @param {*} defaultValue - 기본값
 * @returns {boolean} 성공 여부
 */
export const updateItem = (key, updateFn, defaultValue = null) => {
  try {
    const currentValue = getItem(key, defaultValue);
    const newValue = updateFn(currentValue);
    return setItem(key, newValue);
  } catch (error) {
    console.error(`Error updating localStorage key "${key}":`, error);
    return false;
  }
};

/**
 * localStorage에서 데이터를 삭제하는 함수
 * @param {string} key - localStorage 키
 * @returns {boolean} 성공 여부
 */
export const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
    return false;
  }
};

/**
 * 시드 데이터를 초기화하는 함수
 * 데이터가 없을 경우에만 초기화
 */
export const initSeedDataIfEmpty = () => {
  try {
    // 통계 데이터 초기화
    const existingStats = getItem('statistics');
    if (!existingStats) {
      setItem('statistics', DEFAULT_STATISTICS);
      console.log('통계 시드 데이터 초기화 완료');
    }

    // 개인 상용구 데이터 초기화
    const existingPhrases = getItem('customPhrases');
    if (!existingPhrases || !Array.isArray(existingPhrases)) {
      setItem('customPhrases', DEFAULT_CUSTOM_PHRASES);
      console.log('개인 상용구 시드 데이터 초기화 완료');
    }
  } catch (error) {
    console.error('시드 데이터 초기화 중 오류:', error);
  }
};

/**
 * 통계 데이터 관련 함수들
 */

/**
 * 수화 변환 횟수 증가
 */
export const incrementSignLanguageCount = () => {
  return updateItem('statistics', (stats) => ({
    ...stats,
    signLanguageCount: (stats?.signLanguageCount || 0) + 1
  }), DEFAULT_STATISTICS);
};

/**
 * 텍스트 입력 횟수 증가
 */
export const incrementTextInputCount = () => {
  return updateItem('statistics', (stats) => ({
    ...stats,
    textInputCount: (stats?.textInputCount || 0) + 1
  }), DEFAULT_STATISTICS);
};

/**
 * 사용 시간 추가
 * @param {number} seconds - 추가할 시간(초)
 */
export const addUsageTime = (seconds) => {
  return updateItem('statistics', (stats) => ({
    ...stats,
    totalUsageTime: (stats?.totalUsageTime || 0) + seconds
  }), DEFAULT_STATISTICS);
};

/**
 * 일일 사용량 업데이트
 * @param {string} date - YYYY-MM-DD 형식의 날짜
 * @param {number} count - 사용 횟수 (기본값: 1)
 */
export const updateDailyUsage = (date = null, count = 1) => {
  const today = date || new Date().toISOString().split('T')[0];
  
  return updateItem('statistics', (stats) => ({
    ...stats,
    dailyUsage: {
      ...stats?.dailyUsage,
      [today]: (stats?.dailyUsage?.[today] || 0) + count
    }
  }), DEFAULT_STATISTICS);
};

/**
 * 개인 상용구 관련 함수들
 */

/**
 * 상용구 사용 횟수 업데이트
 * @param {number} phraseId - 상용구 ID
 */
export const updatePhraseUsage = (phraseId) => {
  return updateItem('customPhrases', (phrases) => {
    if (!Array.isArray(phrases)) return DEFAULT_CUSTOM_PHRASES;
    
    return phrases.map(phrase => 
      phrase.id === phraseId 
        ? { ...phrase, usageCount: (phrase.usageCount || 0) + 1 }
        : phrase
    );
  }, DEFAULT_CUSTOM_PHRASES);
};

/**
 * 새 상용구 추가
 * @param {string} text - 상용구 텍스트
 * @param {string} category - 카테고리
 * @param {boolean} isFavorite - 즐겨찾기 여부
 */
export const addCustomPhrase = (text, category = "일상", isFavorite = false) => {
  return updateItem('customPhrases', (phrases) => {
    if (!Array.isArray(phrases)) phrases = DEFAULT_CUSTOM_PHRASES;
    
    const newId = Math.max(...phrases.map(p => p.id), 0) + 1;
    const newPhrase = {
      id: newId,
      text,
      category,
      isFavorite,
      usageCount: 0,
      createdAt: new Date().toISOString()
    };
    
    return [...phrases, newPhrase];
  }, DEFAULT_CUSTOM_PHRASES);
};

/**
 * 상용구 수정
 * @param {number} phraseId - 상용구 ID
 * @param {object} updates - 업데이트할 필드들
 */
export const updateCustomPhrase = (phraseId, updates) => {
  return updateItem('customPhrases', (phrases) => {
    if (!Array.isArray(phrases)) return DEFAULT_CUSTOM_PHRASES;
    
    return phrases.map(phrase => 
      phrase.id === phraseId 
        ? { ...phrase, ...updates }
        : phrase
    );
  }, DEFAULT_CUSTOM_PHRASES);
};

/**
 * 상용구 삭제
 * @param {number} phraseId - 상용구 ID
 */
export const deleteCustomPhrase = (phraseId) => {
  return updateItem('customPhrases', (phrases) => {
    if (!Array.isArray(phrases)) return DEFAULT_CUSTOM_PHRASES;
    
    return phrases.filter(phrase => phrase.id !== phraseId);
  }, DEFAULT_CUSTOM_PHRASES);
};

/**
 * 상용구 순서 재정렬
 * @param {array} newOrder - 새로운 순서의 상용구 배열
 */
export const reorderCustomPhrases = (newOrder) => {
  return setItem('customPhrases', newOrder);
};

/**
 * 데이터 초기화 (개발/테스트용)
 */
export const resetAllData = () => {
  try {
    setItem('statistics', DEFAULT_STATISTICS);
    setItem('customPhrases', DEFAULT_CUSTOM_PHRASES);
    console.log('모든 데이터가 초기화되었습니다.');
    return true;
  } catch (error) {
    console.error('데이터 초기화 중 오류:', error);
    return false;
  }
};

// 앱 시작 시 시드 데이터 초기화
if (typeof window !== 'undefined') {
  initSeedDataIfEmpty();
}