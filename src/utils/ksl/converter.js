/**
 * KSL 변환기 메인 클래스
 * 한국어 텍스트를 KSL 글로스로 변환
 */
import { KSL_DICTIONARY } from './dictionary.js';
import { KSL_RULES } from './rules.js';

export class KSLConverter {
  constructor() {
    this.dictionary = KSL_DICTIONARY;
    this.rules = KSL_RULES;
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
      
      // 4. 규칙 적용
      const processedWords = this.applyRules(glossWords, text);
      
      // 5. 글로스 생성
      const gloss = this.generateGloss(processedWords);
      
      // 6. 태그 생성
      const tags = this.generateTags(text, processedWords);
      
      // 신뢰도 계산
      const confidence = this.calculateConfidence(words, glossWords, text, processedWords);
      
      // 신뢰도 기반 적응형 처리
      let finalGloss = gloss;
      let finalTags = tags;
      
      if (confidence < 0.3) {
        // 매우 낮은 신뢰도: 원본 유지 + 변환 시도 표시
        finalGloss = `[KSL:${gloss}] ${text}`;
      } else if (confidence < 0.5) {
        // 낮은 신뢰도: 하이브리드 방식
        const mappedWords = words.map((word, i) => {
          const morphemeResult = this.analyzeMorpheme(word);
          if (this.dictionary[word] || (morphemeResult.stem && this.dictionary[morphemeResult.stem])) {
            return glossWords[i] || word;
          }
          return word; // 원본 유지
        });
        finalGloss = this.rules.moveTimePlace(mappedWords).join(' ');
      }
      // 신뢰도 >= 0.5: 정상 변환 (gloss 그대로 사용)
      
      return {
        original: text,
        gloss: finalGloss,
        tags: finalTags,
        confidence: confidence
      };
    } catch (error) {
      console.error('KSL 변환 오류:', error);
      return {
        original: text,
        gloss: text, // 변환 실패 시 원본 반환
        tags: '{NMM:neutral}',
        confidence: 0
      };
    }
  }

  normalizeText(text) {
    return text
      .replace(/[.!?]/g, '') // 문장부호 제거
      .trim();
  }

  tokenize(text) {
    return text.split(/\s+/).filter(word => word.length > 0);
  }

  mapToGloss(words) {
    return words.map(word => {
      // 1. 정확한 매칭 시도
      if (this.dictionary[word]) {
        return this.dictionary[word];
      }
      
      // 2. 형태소 분석 시도
      const morphemeResult = this.analyzeMorpheme(word);
      if (morphemeResult.stem && this.dictionary[morphemeResult.stem]) {
        return this.dictionary[morphemeResult.stem];
      }
      
      // 3. 매칭 실패 시 원본 반환
      return word;
    });
  }

  applyRules(words) {
    let processedWords = [...words];
    
    // 1. 시간/장소 전면화
    processedWords = this.rules.moveTimePlace(processedWords);
    
    // 2. 방향동사 태그 추가
    processedWords = this.rules.addDirectionalTags(processedWords);
    
    // 3. 믘어진 단어 처리 (ex: "가다 {dir:1→3}" → 단일 항목으로 유지)
    // (KSL 귀칙에 따라 단어와 태그를 하나의 단위로 처리)
    
    return processedWords;
  }

  generateGloss(words) {
    return words.join(' ');
  }

  generateTags(originalText, words) {
    // 기존 로직을 규칙 엔진으로 대체
    const sentenceType = this.rules.getSentenceType(originalText);
    return this.rules.getSignLanguageTags(sentenceType, originalText, words);
  }

  analyzeMorpheme(word) {
    // 확장된 형태소 분석 패턴
    const comprehensivePatterns = {
      // 현재형 패턴
      present: [
        { pattern: /([가-힣]+)(습니다|ㅂ니다)$/, type: 'formal' },
        { pattern: /([가-힣]+)(어요|아요|여요|해요)$/, type: 'polite' },
        { pattern: /([가-힣]+)(어|아|여|해)$/, type: 'casual' },
        { pattern: /([가-힣]+)(세요|으세요)$/, type: 'honorific' },
        { pattern: /([가-힣]+)(네요|구나|군요)$/, type: 'exclamatory' },
        { pattern: /([가-힣]+)(요)$/, type: 'polite_ending' }
      ],
      
      // 과거형 패턴
      past: [
        { pattern: /([가-힣]+)(었습니다|았습니다|였습니다|했습니다)$/, type: 'past_formal' },
        { pattern: /([가-힣]+)(었어요|았어요|였어요|했어요)$/, type: 'past_polite' },
        { pattern: /([가-힣]+)(었다|았다|였다|했다)$/, type: 'past_casual' },
        { pattern: /([가-힣]+)(었네요|았네요|였네요|했네요)$/, type: 'past_exclamatory' }
      ],
      
      // 미래/의지형 패턴
      future: [
        { pattern: /([가-힣]+)(을게요|ㄹ게요)$/, type: 'will' },
        { pattern: /([가-힣]+)(겠어요|겠습니다)$/, type: 'will_formal' },
        { pattern: /([가-힣]+)(ㄹ래요|을래요)$/, type: 'want_to' }
      ],
      
      // 의향/희망형 패턴
      intention: [
        { pattern: /([가-힣]+)고\s*싶어요$/, type: 'want', stem: (match) => match[1] + '다' },
        { pattern: /([가-힣]+)고\s*싶습니다$/, type: 'want_formal', stem: (match) => match[1] + '다' },
        { pattern: /([가-힣]+)고\s*싶다$/, type: 'want_casual', stem: (match) => match[1] + '다' }
      ],
      
      // 능력/가능성 패턴
      ability: [
        { pattern: /([가-힣]+)(ㄹ\s*수\s*있어요|을\s*수\s*있어요)$/, type: 'can' },
        { pattern: /([가-힣]+)(ㄹ\s*수\s*있습니다|을\s*수\s*있습니다)$/, type: 'can_formal' },
        { pattern: /([가-힣]+)(야\s*해요|야\s*합니다)$/, type: 'must' }
      ]
    };
    
    // 불규칙 활용 매핑 (명시적 매핑 방식)
    const irregularConjugations = {
      // ㅡ 불규칙 (아프다 → 아파요)
      '아파요': '아프다',
      '아프다': '아프다',
      '예뻐요': '예쁘다', 
      '바빠요': '바쁘다',
      '아름다워요': '아름답다',
      '쉬워요': '쉽다',
      '어려워요': '어렵다',
      '걸어요': '걷다',
      '들어요': '듣다',
      
      // 자주 사용되는 불규칙 활용 추가
      '좋네요': '좋다',
      '나쁘네요': '나쁘다',
      '추워요': '추다',
      '따뜻해요': '따뜻하다',
      '시원해요': '시원하다',
      '맛있어요': '맛있다',
      '맛있습니다': '맛있다',
      
      // 과거형 처리
      '이해했습니다': '이해하다',
      '이해했어요': '이해하다',
      '도와줬습니다': '도와주다',
      '도와줬어요': '도와주다',
      
      // 의향형 처리
      '싶어요': '원하다',
      '배우고싶어요': '배우다+원하다',
      '가고싶어요': '가다+원하다',
      '먹고싶어요': '먹다+원하다',
      
      // 높임 표현
      '드실래요': '먹다',
      '드세요': '먹다',
      '계세요': '있다',
      '말씀해주세요': '말하다'
    };
    
    // 높임 표현 매핑
    const honorificMappings = {
      '드시다': '먹다',
      '드세요': '먹다', 
      '드실래요': '먹다',
      '계시다': '있다',
      '계세요': '있다',
      '주무시다': '자다',
      '주무세요': '자다',
      '말씀하시다': '말하다',
      '말씀해주세요': '말하다'
    };
    
    // 1. 높임 표현 매핑 체크
    if (honorificMappings[word]) {
      return {
        stem: honorificMappings[word],
        suffix: '',
        type: 'honorific_mapping',
        original: word
      };
    }
    
    // 2. 불규칙 활용 체크 (직접 매핑)
    if (irregularConjugations[word]) {
      const stem = irregularConjugations[word];
      return {
        stem: stem,
        suffix: word.replace(stem.replace('다', ''), ''),
        type: 'irregular',
        original: word
      };
    }
    
    // 3. 포괄적 패턴 매칭
    for (const [category, patterns] of Object.entries(comprehensivePatterns)) {
      for (const pattern of patterns) {
        const match = word.match(pattern.pattern);
        if (match && match[1]) {
          let stem;
          if (pattern.stem && typeof pattern.stem === 'function') {
            stem = pattern.stem(match);
          } else {
            stem = match[1] + '다'; // 기본형으로 변환
          }
          
          return {
            stem: stem,
            suffix: match[2],
            type: pattern.type,
            category: category,
            original: word
          };
        }
      }
    }
    
    // 4. 조사 패턴 체크
    const particlePattern = /([가-힣]+)([은는이가을를에의로와과부터까지도만]|에서|으로|로서|와서|해서|라서)$/;
    const particleMatch = word.match(particlePattern);
    if (particleMatch && particleMatch[1]) {
      return {
        stem: particleMatch[1],
        suffix: particleMatch[2],
        type: 'particle',
        original: word
      };
    }
    
    // 5. 기타 어미 제거 (기존 방식)
    const cleanWord = word.replace(/입니다|니다$/g, '');
    if (cleanWord !== word && cleanWord.length > 0) {
      return {
        stem: cleanWord,
        suffix: word.replace(cleanWord, ''),
        type: 'simple',
        original: word
      };
    }
    
    return { stem: word, suffix: '', type: 'none', original: word };
  }

  calculateConfidence(words, glossWords, originalText, processedWords) {
    // 기본 매칭 점수 (60% 가중치)
    const mappedCount = words.filter(word => {
      // 정확한 매칭 확인
      if (this.dictionary[word]) {
        return true;
      }
      
      // 형태소 분석 후 매칭 확인
      const morphemeResult = this.analyzeMorpheme(word);
      if (morphemeResult.stem && this.dictionary[morphemeResult.stem]) {
        return true;
      }
      
      return false;
    }).length;
    
    const basicScore = Math.min(1.0, mappedCount / words.length) * 0.6;
    
    // 형태소 분석 성공률 (15% 가중치)
    const morphemeSuccessCount = words.filter(word => {
      const result = this.analyzeMorpheme(word);
      return result.type !== 'none' && result.stem !== word;
    }).length;
    const morphemeScore = Math.min(1.0, morphemeSuccessCount / words.length) * 0.15;
    
    // 귀칙 적용 성공률 (15% 가중치)
    let ruleScore = 0;
    
    // 시간/장소 전면화 체크
    const timeWords = ['오늘', '내일', '어제', '오전', '오후', '아침', '점심', '저녹'];
    const placeWords = ['학교', '집', '병원', '도서관', '마트', '식당', '회사'];
    
    const hasTimePlace = words.some(word => 
      timeWords.some(tw => word.includes(tw)) || 
      placeWords.some(pw => word.includes(pw))
    );
    
    if (hasTimePlace) ruleScore += 0.05;
    
    // 방향동사 태그 체크
    const hasDirectionalTag = processedWords.some(word => word.includes('{dir:'));
    const hasDirectionalVerb = words.some(word => 
      ['가다', '오다', '주다', '받다'].some(verb => word.includes(verb))
    );
    
    if (hasDirectionalVerb && hasDirectionalTag) ruleScore += 0.05;
    if (hasDirectionalVerb && !hasDirectionalTag) ruleScore += 0.02; // 부분 점수
    
    ruleScore = ruleScore * 3; // 15%로 정규화
    
    // 문장 유형 분석 정확도 (10% 가중치)
    const sentenceType = this.rules.getSentenceType(originalText);
    let sentenceScore = 0.1; // 기본 점수
    
    if (originalText.includes('?') && sentenceType === 'question') sentenceScore = 0.1;
    else if (originalText.includes('안') && sentenceType === 'negative') sentenceScore = 0.1;
    else if (originalText.includes('세요') && sentenceType === 'imperative') sentenceScore = 0.1;
    else if (sentenceType === 'declarative') sentenceScore = 0.08;
    
    // 최종 신뢰도 계산
    const totalConfidence = Math.min(1.0, basicScore + morphemeScore + ruleScore + sentenceScore);
    
    return totalConfidence;
  }
}
