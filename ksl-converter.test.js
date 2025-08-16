/**
 * KSL 변환기 통합 테스트 슈트
 * 
 * 목적: KSL 변환기의 모든 기능을 체계적으로 테스트하고 검증
 * 특징: 실제 환경 + 모의 환경 지원, 성능 측정, 개선사항 검증
 * 
 * @version 1.0.0
 * @author KSL Converter Team
 */

// ============================================================================
// 환경 감지 및 모듈 로딩
// ============================================================================

let KSLConverter;
let isRealEnvironment = false;

try {
  // 실제 프로젝트 환경 시도
  ({ KSLConverter } = await import('./src/utils/ksl/converter.js'));
  isRealEnvironment = true;
  console.log('✅ 실제 프로젝트 환경에서 테스트 실행');
} catch (error) {
  console.log('⚠️  모의 환경으로 폴백하여 테스트 실행');
  isRealEnvironment = false;
  
  // 모의 환경 정의
  const MOCK_DICTIONARY = {
    // 인사/기본 표현
    "안녕하세요": "안녕", "안녕": "안녕", "감사합니다": "감사", "감사": "감사",
    "죄송합니다": "죄송", "죄송": "죄송", "네": "네", "아니요": "아니요", "안녕히": "안녕히",
    "반갑습니다": "반갑다", "반갑다": "반갑다", "고맙습니다": "고맙다", "고맙다": "고맙다",
    
    // 장소
    "학교": "학교", "집": "집", "병원": "병원", "식당": "식당", "회사": "회사",
    "가게": "가게", "은행": "은행", "역": "역", "공원": "공원", "도서관": "도서관",
    "카페": "카페", "마트": "마트", "놀이터": "놀이터",
    
    // 시간
    "오늘": "오늘", "내일": "내일", "어제": "어제", "지금": "지금", "나중에": "나중에",
    "아침": "아침", "점심": "점심", "저녁": "저녁", "오전": "오전", "오후": "오후",
    "주말": "주말", "시": "시", "분": "분", "몇": "몇",
    
    // 동작
    "가다": "가다", "오다": "오다", "먹다": "먹다", "마시다": "마시다", "자다": "자다",
    "일하다": "일하다", "공부하다": "공부하다", "만나다": "만나다", "주다": "주다", "받다": "받다",
    "사다": "사다", "보다": "보다", "듣다": "듣다", "말하다": "말하다", "하다": "하다",
    "배우다": "배우다", "보여주다": "보여주다", "도와주다": "도와주다", "신고하다": "신고하다",
    "필요하다": "필요하다", "산책하다": "산책하다",
    
    // 의문사
    "어디": "어디", "언제": "언제", "무엇": "무엇", "뭐": "무엇", "누구": "누구",
    "왜": "왜", "어떻게": "어떻게",
    
    // 형용사
    "좋다": "좋다", "나쁘다": "나쁘다", "크다": "크다", "작다": "작다",
    "많다": "많다", "적다": "적다", "빠르다": "빠르다", "느리다": "느리다",
    "재미있다": "재미있다", "어렵다": "어렵다", "쉽다": "쉽다", "맛있다": "맛있다",
    
    // 사람/대명사
    "사람": "사람", "저": "저", "나": "나", "저는": "저", "나는": "나",
    "언니": "언니", "친구": "친구", "가족": "가족", "선생님": "선생님",
    
    // 기타
    "선물": "선물", "빵": "빵", "날씨": "날씨", "수화": "수화", "도움": "도움",
    "예정": "예정", "정말": "정말", "천천히": "천천히", "다시": "다시", "한번": "한번"
  };
  
  const MOCK_RULES = {
    getSentenceType: (text) => {
      const questionPatterns = [/\?/, /니까$/, /나요$/, /까요$/, /어디/, /언제/, /무엇/, /누구/, /왜/, /어떻게/, /뭐/];
      const negativePatterns = [/\b안\b/, /\b못\b/, /\b없\b/, /아니/, /싫/, /싶지\s*않/, /말지\s*말/];
      const imperativePatterns = [/세요$/, /어라$/, /아라$/, /가라$/, /오라$/, /해라$/, /하지\s*마/, /하지\s*마라/];
      const exclamatoryPatterns = [/!/, /아!/, /오!/, /와!/, /어머!/, /세상에!/];
      
      if (questionPatterns.some(pattern => pattern.test(text))) return 'question';
      if (negativePatterns.some(pattern => pattern.test(text))) return 'negative';
      if (imperativePatterns.some(pattern => pattern.test(text))) return 'imperative';
      if (exclamatoryPatterns.some(pattern => pattern.test(text))) return 'exclamatory';
      return 'declarative';
    },
    
    getSignLanguageTags: (sentenceType, text, words) => {
      const tags = [];
      switch (sentenceType) {
        case 'question': tags.push('{NMM:WH?}'); break;
        case 'negative': tags.push('{NMM:neg}'); break;
        case 'imperative': tags.push('{NMM:imp}'); break;
        case 'exclamatory': tags.push('{NMM:excl}'); break;
        default: tags.push('{NMM:neutral}');
      }
      return tags.join(' ');
    },
    
    moveTimePlace: (words) => {
      const timeWords = ['오늘', '내일', '어제', '지금', '나중에', '아침', '점심', '저녁', '오전', '오후', '주말'];
      const placeWords = ['학교', '집', '병원', '식당', '회사', '가게', '은행', '역', '공원', '도서관', '카페', '마트'];
      
      const timeFound = [];
      const placeFound = [];
      const otherWords = [];
      
      words.forEach(word => {
        const isTimeWord = timeWords.some(timeWord => word === timeWord || word.includes(timeWord));
        const isPlaceWord = placeWords.some(placeWord => word === placeWord || word.includes(placeWord));
        
        if (isTimeWord) timeFound.push(word);
        else if (isPlaceWord) placeFound.push(word);
        else otherWords.push(word);
      });
      
      return [...timeFound, ...placeFound, ...otherWords];
    },
    
    addDirectionalTags: (words) => {
      const directionalMappings = {
        '가다': '{dir:1→3}', '오다': '{dir:3→1}', '주다': '{dir:1→3}', '받다': '{dir:3→1}',
        '보여주다': '{dir:1→3}', '도와주다': '{dir:1→3}', '신고하다': '{dir:1→3}'
      };
      
      return words.map(word => {
        if (directionalMappings[word]) return `${word} ${directionalMappings[word]}`;
        for (const [verb, tag] of Object.entries(directionalMappings)) {
          if (word.includes(verb)) return `${word} ${tag}`;
        }
        return word;
      });
    }
  };
  
  // 모의 KSLConverter 클래스
  KSLConverter = class MockKSLConverter {
    constructor() {
      this.dictionary = MOCK_DICTIONARY;
      this.rules = MOCK_RULES;
    }

    convert(text) {
      if (!text || text.trim() === '') return null;

      try {
        const normalizedText = this.normalizeText(text);
        const words = this.tokenize(normalizedText);
        const glossWords = this.mapToGloss(words);
        const processedWords = this.applyRules(glossWords, text);
        const gloss = this.generateGloss(processedWords);
        const tags = this.generateTags(text, processedWords);
        
        return {
          original: text,
          gloss: gloss,
          tags: tags,
          confidence: this.calculateConfidence(words, glossWords)
        };
      } catch (error) {
        return {
          original: text,
          gloss: text,
          tags: '{NMM:neutral}',
          confidence: 0
        };
      }
    }

    normalizeText(text) {
      return text.replace(/[.!?]/g, '').trim();
    }

    tokenize(text) {
      return text.split(/\s+/).filter(word => word.length > 0);
    }

    mapToGloss(words) {
      return words.map(word => {
        if (this.dictionary[word]) return this.dictionary[word];
        const morphemeResult = this.analyzeMorpheme(word);
        if (morphemeResult.stem && this.dictionary[morphemeResult.stem]) {
          return this.dictionary[morphemeResult.stem];
        }
        return word;
      });
    }

    analyzeMorpheme(word) {
      const verbEndings = [
        { pattern: /([\가-힣]+)(습니다|ㅂ니다)$/, type: 'formal' },
        { pattern: /([\가-힣]+)(어요|아요|여요)$/, type: 'polite' },
        { pattern: /([\가-힣]+)(세요|으세요)$/, type: 'honorific' },
        { pattern: /([\가-힣]+)(요)$/, type: 'polite_ending' }
      ];
      
      const particlePattern = /([\가-힣]+)([은는이가을를에의로와과부터까지도만]|에서|으로)$/;
      
      for (const ending of verbEndings) {
        const match = word.match(ending.pattern);
        if (match && match[1]) {
          return { stem: match[1] + '다', suffix: match[2], type: ending.type, original: word };
        }
      }
      
      const particleMatch = word.match(particlePattern);
      if (particleMatch && particleMatch[1]) {
        return { stem: particleMatch[1], suffix: particleMatch[2], type: 'particle', original: word };
      }
      
      const cleanWord = word.replace(/입니다|니다$/g, '');
      if (cleanWord !== word && cleanWord.length > 0) {
        return { stem: cleanWord, suffix: word.replace(cleanWord, ''), type: 'simple', original: word };
      }
      
      return { stem: word, suffix: '', type: 'none', original: word };
    }

    applyRules(words, originalText) {
      let processedWords = [...words];
      processedWords = this.rules.moveTimePlace(processedWords);
      processedWords = this.rules.addDirectionalTags(processedWords);
      return processedWords;
    }

    generateGloss(words) {
      return words.join(' ');
    }

    generateTags(originalText, words) {
      const sentenceType = this.rules.getSentenceType(originalText);
      return this.rules.getSignLanguageTags(sentenceType, originalText, words);
    }

    calculateConfidence(words, glossWords) {
      const mappedCount = words.filter(word => {
        if (this.dictionary[word]) return true;
        const morphemeResult = this.analyzeMorpheme(word);
        if (morphemeResult.stem && this.dictionary[morphemeResult.stem]) return true;
        return false;
      }).length;
      
      return Math.min(1.0, mappedCount / words.length);
    }
  };
}

// ============================================================================
// 테스트 케이스 정의
// ============================================================================

const TEST_SUITES = {
  basic: {
    name: "기본 기능 테스트",
    description: "KSL 변환기의 기본 기능 검증",
    cases: [
      { input: "안녕하세요", expected: "안녕", description: "기본 인사" },
      { input: "안녕하세요 저는 사람입니다", description: "복합 문장 + 어미 처리" },
      { input: "저는 내일 학교에 가요", description: "시간/장소 전면화 + 어미 처리" },
      { input: "어디 가세요?", description: "의문문 + 어미 처리" },
      { input: "감사합니다", expected: "감사", description: "정중 표현" }
    ]
  },
  
  improved: {
    name: "개선 기능 검증",
    description: "향상된 기능들의 정확성 검증",
    cases: [
      { input: "오늘 집에서 빵을 먹었어요", description: "시간/장소 전면화 + 과거형" },
      { input: "언니가 선물을 주었어요", description: "방향동사 태그" },
      { input: "안 먹어요", description: "부정문" },
      { input: "천천히 말씀해 주세요", description: "명령문 + 방향동사" },
      { input: "다시 한번 보여주세요", description: "복합 동사 + 방향동사" }
    ]
  },
  
  scenarios: {
    name: "실제 사용 시나리오",
    description: "실제 상황에서의 사용성 검증",
    cases: [
      // 일상 대화
      { input: "안녕하세요, 반갑습니다", category: "일상 대화" },
      { input: "오늘 날씨가 좋네요", category: "일상 대화" },
      { input: "점심 뭐 드실래요?", category: "일상 대화" },
      { input: "내일 몇 시에 만날까요?", category: "일상 대화" },
      
      // 학습 상황
      { input: "수화를 배우고 싶어요", category: "학습 상황" },
      { input: "천천히 말씀해 주세요", category: "학습 상황" },
      { input: "다시 한번 보여주세요", category: "학습 상황" },
      { input: "이해했습니다", category: "학습 상황" },
      
      // 응급 상황
      { input: "도움이 필요해요", category: "응급 상황" },
      { input: "아파요", category: "응급 상황" },
      { input: "병원에 가야 해요", category: "응급 상황" },
      { input: "119에 신고해 주세요", category: "응급 상황" }
    ]
  },
  
  complex: {
    name: "복잡한 문장 테스트",
    description: "긴 문장과 복잡한 구조 처리 능력 검증",
    cases: [
      { 
        input: "저는 내일 오전 9시에 학교 도서관에서 친구를 만날 예정입니다",
        description: "긴 문장 + 시간/장소 전면화" 
      },
      { 
        input: "어제 마트에서 산 빵이 정말 맛있었어요",
        description: "과거형 + 시간/장소 전면화" 
      },
      { 
        input: "주말에 가족과 함께 공원에 가서 산책하고 싶어요",
        description: "복합 문장 + 의향 표현" 
      }
    ]
  }
};

// ============================================================================
// 테스트 실행 엔진
// ============================================================================

class KSLTestRunner {
  constructor() {
    this.converter = new KSLConverter();
    this.results = {
      total: 0,
      passed: 0,
      failed: 0,
      suites: {},
      performance: {
        totalTime: 0,
        averageTime: 0,
        maxTime: 0,
        minTime: Infinity
      },
      confidence: {
        total: 0,
        average: 0,
        high: 0, // ≥ 80%
        medium: 0, // 50-79%
        low: 0 // < 50%
      },
      improvements: {
        morphemeAnalysis: 0,
        timePlace: 0,
        directionalTags: 0,
        sentenceType: 0
      }
    };
  }
  
  runAllTests() {
    console.log('🚀 KSL 변환기 통합 테스트 시작\n');
    console.log(`📊 환경: ${isRealEnvironment ? '실제 프로젝트' : '모의 환경'}`);
    console.log(`📅 실행 시간: ${new Date().toLocaleString('ko-KR')}\n`);
    
    const startTime = performance.now();
    
    for (const [suiteKey, suite] of Object.entries(TEST_SUITES)) {
      this.runTestSuite(suiteKey, suite);
    }
    
    const endTime = performance.now();
    this.results.performance.totalTime = endTime - startTime;
    this.results.performance.averageTime = this.results.performance.totalTime / this.results.total;
    
    this.generateReport();
  }
  
  runTestSuite(suiteKey, suite) {
    console.log(`\n📁 ${suite.name}`);
    console.log(`   ${suite.description}`);
    console.log('='.repeat(70));
    
    const suiteResults = {
      total: 0,
      passed: 0,
      failed: 0,
      cases: []
    };
    
    suite.cases.forEach((testCase, index) => {
      const result = this.runSingleTest(testCase, index + 1);
      suiteResults.cases.push(result);
      suiteResults.total++;
      
      if (result.status === 'passed') {
        suiteResults.passed++;
        this.results.passed++;
      } else {
        suiteResults.failed++;
        this.results.failed++;
      }
      
      this.results.total++;
    });
    
    this.results.suites[suiteKey] = suiteResults;
    
    console.log(`\n📊 ${suite.name} 결과: ${suiteResults.passed}/${suiteResults.total} 통과\n`);
  }
  
  runSingleTest(testCase, index) {
    const startTime = performance.now();
    const result = this.converter.convert(testCase.input);
    const endTime = performance.now();
    const executionTime = endTime - startTime;
    
    // 성능 통계 업데이트
    this.results.performance.maxTime = Math.max(this.results.performance.maxTime, executionTime);
    this.results.performance.minTime = Math.min(this.results.performance.minTime, executionTime);
    
    // 신뢰도 통계 업데이트
    this.results.confidence.total += result.confidence;
    if (result.confidence >= 0.8) this.results.confidence.high++;
    else if (result.confidence >= 0.5) this.results.confidence.medium++;
    else this.results.confidence.low++;
    
    // 개선사항 검증
    const improvements = this.validateImprovements(testCase, result);
    Object.keys(improvements).forEach(key => {
      if (improvements[key]) this.results.improvements[key]++;
    });
    
    // 테스트 결과 판단
    const status = this.evaluateTestResult(testCase, result);
    
    // 결과 출력
    console.log(`${index}. "${testCase.input}"`);
    console.log(`   → "${result.gloss}"`);
    console.log(`   📋 태그: ${result.tags}`);
    console.log(`   📈 신뢰도: ${Math.round(result.confidence * 100)}%`);
    console.log(`   ⏱️  처리시간: ${executionTime.toFixed(2)}ms`);
    
    if (testCase.category) {
      console.log(`   🏷️  카테고리: ${testCase.category}`);
    }
    
    if (testCase.description) {
      console.log(`   📝 설명: ${testCase.description}`);
    }
    
    // 개선사항 표시
    const appliedImprovements = Object.entries(improvements)
      .filter(([_, applied]) => applied)
      .map(([key, _]) => this.getImprovementLabel(key));
    
    if (appliedImprovements.length > 0) {
      console.log(`   🎯 적용된 개선: ${appliedImprovements.join(', ')}`);
    }
    
    // 기대값 검증 (있는 경우)
    if (testCase.expected) {
      const matchesExpected = result.gloss.includes(testCase.expected);
      console.log(`   ${matchesExpected ? '✅' : '❌'} 기대값 검증: "${testCase.expected}"`);
    }
    
    console.log('');
    
    return {
      input: testCase.input,
      output: result,
      executionTime,
      improvements,
      status,
      category: testCase.category || 'general'
    };
  }
  
  validateImprovements(testCase, result) {
    const text = testCase.input;
    const gloss = result.gloss;
    
    return {
      morphemeAnalysis: this.checkMorphemeAnalysis(text, gloss),
      timePlace: this.checkTimePlaceFronting(text, gloss),
      directionalTags: this.checkDirectionalTags(gloss),
      sentenceType: this.checkSentenceType(text, result.tags)
    };
  }
  
  checkMorphemeAnalysis(text, gloss) {
    // 어미가 있는 단어가 올바르게 처리되었는지 확인
    const hasEnding = /요|니다|세요/.test(text);
    const stemProcessed = hasEnding && !gloss.includes('요') && !gloss.includes('니다');
    return stemProcessed;
  }
  
  checkTimePlaceFronting(text, gloss) {
    // 시간/장소 표현이 앞으로 이동했는지 확인
    const timeWords = ['오늘', '내일', '어제', '오전', '오후'];
    const placeWords = ['학교', '집', '병원', '도서관', '마트'];
    
    const hasTime = timeWords.some(word => text.includes(word));
    const hasPlace = placeWords.some(word => text.includes(word));
    
    if (hasTime) {
      const timeWord = timeWords.find(word => text.includes(word));
      return gloss.startsWith(timeWord);
    }
    
    return false;
  }
  
  checkDirectionalTags(gloss) {
    return gloss.includes('{dir:');
  }
  
  checkSentenceType(text, tags) {
    if (text.includes('?') && tags.includes('WH?')) return true;
    if (/\b안\b|\b못\b|\b없\b/.test(text) && tags.includes('neg')) return true;
    if (/세요$/.test(text) && tags.includes('imp')) return true;
    return tags.includes('neutral');
  }
  
  getImprovementLabel(key) {
    const labels = {
      morphemeAnalysis: '✅ 어미 처리',
      timePlace: '✅ 시간/장소 전면화',
      directionalTags: '✅ 방향동사 태그',
      sentenceType: '✅ 문장유형 분류'
    };
    return labels[key] || key;
  }
  
  evaluateTestResult(testCase, result) {
    // 기본적인 성공 기준
    if (result.confidence >= 0.7) return 'passed';
    if (result.confidence >= 0.5) return 'warning';
    return 'failed';
  }
  
  generateReport() {
    console.log('\n' + '='.repeat(70));
    console.log('📊 KSL 변환기 통합 테스트 최종 보고서');
    console.log('='.repeat(70));
    
    // 전체 통계
    console.log('\n🎯 전체 테스트 결과');
    console.log(`   총 테스트: ${this.results.total}개`);
    console.log(`   통과: ${this.results.passed}개 (${Math.round(this.results.passed/this.results.total*100)}%)`);
    console.log(`   실패: ${this.results.failed}개 (${Math.round(this.results.failed/this.results.total*100)}%)`);
    
    // 신뢰도 통계
    this.results.confidence.average = this.results.confidence.total / this.results.total;
    console.log('\n📈 신뢰도 분석');
    console.log(`   평균 신뢰도: ${Math.round(this.results.confidence.average * 100)}%`);
    console.log(`   높음 (≥80%): ${this.results.confidence.high}개`);
    console.log(`   보통 (50-79%): ${this.results.confidence.medium}개`);
    console.log(`   낮음 (<50%): ${this.results.confidence.low}개`);
    
    // 성능 통계
    console.log('\n⚡ 성능 분석');
    console.log(`   총 실행시간: ${this.results.performance.totalTime.toFixed(2)}ms`);
    console.log(`   평균 처리시간: ${this.results.performance.averageTime.toFixed(2)}ms`);
    console.log(`   최대 처리시간: ${this.results.performance.maxTime.toFixed(2)}ms`);
    console.log(`   최소 처리시간: ${this.results.performance.minTime.toFixed(2)}ms`);
    
    // 개선사항 검증
    console.log('\n🚀 개선사항 적용 현황');
    console.log(`   어미 처리: ${this.results.improvements.morphemeAnalysis}회 적용`);
    console.log(`   시간/장소 전면화: ${this.results.improvements.timePlace}회 적용`);
    console.log(`   방향동사 태그: ${this.results.improvements.directionalTags}회 적용`);
    console.log(`   문장유형 분류: ${this.results.improvements.sentenceType}회 적용`);
    
    // 테스트 스위트별 결과
    console.log('\n📁 테스트 스위트별 결과');
    Object.entries(this.results.suites).forEach(([key, suite]) => {
      const passRate = Math.round(suite.passed / suite.total * 100);
      console.log(`   ${TEST_SUITES[key].name}: ${suite.passed}/${suite.total} (${passRate}%)`);
    });
    
    // 환경별 권장사항
    if (!isRealEnvironment) {
      console.log('\n⚠️  모의 환경 알림');
      console.log('   실제 성능을 확인하려면 프로젝트 환경에서 테스트를 실행하세요.');
    }
    
    // 최종 결론
    const overallScore = Math.round(this.results.passed / this.results.total * 100);
    console.log('\n🏆 최종 결론');
    
    if (overallScore >= 90) {
      console.log('   ✨ 우수: KSL 변환기가 매우 안정적으로 작동합니다.');
    } else if (overallScore >= 70) {
      console.log('   ✅ 양호: KSL 변환기가 전반적으로 잘 작동합니다.');
    } else if (overallScore >= 50) {
      console.log('   ⚠️  보통: 일부 개선이 필요합니다.');
    } else {
      console.log('   ❌ 미흡: 추가 개발이 필요합니다.');
    }
    
    console.log(`   전체 점수: ${overallScore}점/100점`);
    console.log('\n테스트 완료! 🎉');
  }
}

// ============================================================================
// 테스트 실행
// ============================================================================

const testRunner = new KSLTestRunner();
testRunner.runAllTests();