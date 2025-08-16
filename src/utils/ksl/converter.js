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

  applyRules(words, originalText) {
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
    // 동사 어미 패턴
    const verbEndings = [
      { pattern: /([가-힣]+)(습니다|ㅂ니다)$/, type: 'formal' },
      { pattern: /([가-힣]+)(어요|아요|여요)$/, type: 'polite' },
      { pattern: /([가-힣]+)(어|아|여)$/, type: 'casual' },
      { pattern: /([가-힣]+)(세요|으세요)$/, type: 'honorific' },
      { pattern: /([가-힣]+)(었습니다|았습니다|였습니다)$/, type: 'past_formal' },
      { pattern: /([가-힣]+)(었어요|았어요|였어요)$/, type: 'past_polite' },
      { pattern: /([가-힣]+)(을게요|ㄹ게요)$/, type: 'will' },
      { pattern: /([가-힣]+)(요)$/, type: 'polite_ending' }
    ];
    
    // 조사 패턴
    const particlePattern = /([가-힣]+)([은는이가을를에의로와과부터까지도만]|에서|으로|로서|와서|해서|라서)$/;
    
    // 동사 어미 매칭
    for (const ending of verbEndings) {
      const match = word.match(ending.pattern);
      if (match && match[1]) {
        return {
          stem: match[1] + '다', // 기본형으로 변환
          suffix: match[2],
          type: ending.type,
          original: word
        };
      }
    }
    
    // 조사 매칭
    const particleMatch = word.match(particlePattern);
    if (particleMatch && particleMatch[1]) {
      return {
        stem: particleMatch[1],
        suffix: particleMatch[2],
        type: 'particle',
        original: word
      };
    }
    
    // 기타 어미 제거 (기존 방식)
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

  calculateConfidence(words, glossWords) {
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
    
    const confidence = Math.min(1.0, mappedCount / words.length);
    return confidence;
  }
}
