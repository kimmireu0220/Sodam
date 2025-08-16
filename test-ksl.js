/**
 * KSL 변환기 테스트 스크립트
 */

// Node.js 환경에서 테스트하기 위한 모의 사전과 규칙
const KSL_DICTIONARY = {
  // 인사/기본 표현
  "안녕하세요": "안녕",
  "안녕": "안녕",
  "감사합니다": "감사",
  "감사": "감사",
  "죄송합니다": "죄송",
  "죄송": "죄송",
  "네": "네",
  "아니요": "아니요",
  "안녕히": "안녕히",
  
  // 장소
  "학교": "학교",
  "집": "집",
  "병원": "병원",
  "식당": "식당",
  "회사": "회사",
  "가게": "가게",
  "은행": "은행",
  "역": "역",
  "공원": "공원",
  
  // 시간
  "오늘": "오늘",
  "내일": "내일",
  "어제": "어제",
  "지금": "지금",
  "나중에": "나중에",
  "아침": "아침",
  "점심": "점심",
  "저녁": "저녁",
  
  // 동작
  "가다": "가다",
  "오다": "오다",
  "먹다": "먹다",
  "마시다": "마시다",
  "자다": "자다",
  "일하다": "일하다",
  "공부하다": "공부하다",
  "만나다": "만나다",
  "주다": "주다",
  "받다": "받다",
  "사다": "사다",
  "보다": "보다",
  "듣다": "듣다",
  "말하다": "말하다",
  
  // 의문사
  "어디": "어디",
  "언제": "언제",
  "무엇": "무엇",
  "뭐": "무엇",
  "누구": "누구",
  "왜": "왜",
  "어떻게": "어떻게",
  
  // 기타
  "좋다": "좋다",
  "나쁘다": "나쁘다",
  "크다": "크다",
  "작다": "작다",
  "많다": "많다",
  "적다": "적다",
  "빠르다": "빠르다",
  "느리다": "느리다",
  
  // 사람/대명사
  "사람": "사람",
  "저": "저",
  "나": "나",
  "저는": "저",
  "나는": "나"
};

class KSLConverter {
  constructor() {
    this.dictionary = KSL_DICTIONARY;
  }

  convert(text) {
    if (!text || text.trim() === '') {
      return null;
    }

    try {
      // 1. 텍스트 정규화
      const normalizedText = this.normalizeText(text);
      
      // 2. 단어 분리
      const words = this.tokenize(normalizedText);
      
      // 3. 사전 매핑
      const glossWords = this.mapToGloss(words);
      
      // 4. 글로스 생성
      const gloss = this.generateGloss(glossWords);
      
      // 5. 태그 생성
      const tags = this.generateTags(text, glossWords);
      
      return {
        original: text,
        gloss: gloss,
        tags: tags,
        confidence: this.calculateConfidence(words, glossWords)
      };
    } catch (error) {
      console.error('KSL 변환 오류:', error);
      return {
        original: text,
        gloss: text,
        tags: '{NMM:neutral}',
        confidence: 0
      };
    }
  }

  normalizeText(text) {
    return text
      .replace(/[.!?]/g, '')
      .trim();
  }

  tokenize(text) {
    return text.split(/\s+/).filter(word => word.length > 0);
  }

  mapToGloss(words) {
    return words.map(word => {
      console.log(`매핑 시도: "${word}"`);
      
      // 정확한 매칭 시도
      if (this.dictionary[word]) {
        console.log(`✅ 정확 매칭: "${word}" → "${this.dictionary[word]}"`);
        return this.dictionary[word];
      }
      
      // 조사 제거 후 매칭 시도
      const cleanWord = word.replace(/[은는이가을를에의로]|입니다|니다|요/g, '');
      console.log(`조사 제거: "${word}" → "${cleanWord}"`);
      console.log(`사전에 "${cleanWord}" 존재 여부:`, !!this.dictionary[cleanWord]);
      
      if (this.dictionary[cleanWord]) {
        console.log(`✅ 조사 제거 후 매칭: "${word}" → "${cleanWord}" → "${this.dictionary[cleanWord]}"`);
        return this.dictionary[cleanWord];
      }
      
      console.log(`❌ 매칭 실패: "${word}"`);
      return word;
    });
  }

  generateGloss(words) {
    return words.join(' ');
  }

  generateTags(originalText, words) {
    const tags = [];
    
    // 의문문 태그
    if (originalText.includes('?') || originalText.includes('까')) {
      tags.push('{NMM:WH?}');
    } else {
      tags.push('{NMM:neutral}');
    }
    
    // 부정문 태그 - 단어 경계를 고려하여 수정
    const negativeWords = ['안', '못', '없'];
    const hasNegative = negativeWords.some(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'g');
      return regex.test(originalText);
    });
    
    if (hasNegative) {
      tags.push('{NMM:neg}');
    }
    
    return tags.join(' ');
  }

  calculateConfidence(words, glossWords) {
    console.log('신뢰도 계산 디버깅:', {
      originalWords: words,
      glossWords: glossWords
    });
    
    const mappedCount = words.filter(word => {
      // 정확한 매칭 확인
      if (this.dictionary[word]) {
        console.log(`✅ 매칭됨: "${word}"`);
        return true;
      }
      
      // 조사 제거 후 매칭 확인
      const cleanWord = word.replace(/[은는이가을를에의로]|입니다|니다|요/g, '');
      if (this.dictionary[cleanWord]) {
        console.log(`✅ 조사 제거 후 매칭: "${word}" → "${cleanWord}"`);
        return true;
      }
      
      console.log(`❌ 매칭 실패: "${word}"`);
      return false;
    }).length;
    
    const confidence = Math.min(1.0, mappedCount / words.length);
    console.log(`신뢰도: ${mappedCount}/${words.length} = ${confidence * 100}%`);
    
    return confidence;
  }
}

// 테스트 실행
console.log('=== KSL 변환기 테스트 ===\n');

const converter = new KSLConverter();

// 테스트 케이스들
const testCases = [
  "안녕하세요",
  "안녕하세요 저는 사람입니다",
  "저는 내일 학교에 가요",
  "어디 가세요?",
  "감사합니다"
];

testCases.forEach((testCase, index) => {
  console.log(`\n--- 테스트 ${index + 1}: "${testCase}" ---`);
  const result = converter.convert(testCase);
  console.log('\n최종 결과:', result);
  console.log('='.repeat(50));
});
