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
      // 정확한 매칭 시도
      if (this.dictionary[word]) {
        return this.dictionary[word];
      }
      
      // 조사 제거 후 매칭 시도
      const cleanWord = word.replace(/[은는이가을를에의로]/g, '');
      if (this.dictionary[cleanWord]) {
        return this.dictionary[cleanWord];
      }
      
      // 매칭 실패 시 원본 반환
      return word;
    });
  }

  applyRules(words, originalText) {
    let processedWords = [...words];
    
    // 시간/장소 전면화
    processedWords = this.rules.moveTimePlace(processedWords);
    
    // 조사 제거
    processedWords = processedWords.map(word => 
      this.rules.removeParticles(word)
    );
    
    // 방향동사 태그 추가
    processedWords = this.rules.addDirectionalTags(processedWords);
    
    return processedWords;
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
    
    // 부정문 태그
    if (originalText.includes('안') || originalText.includes('못') || originalText.includes('없')) {
      tags.push('{NMM:neg}');
    }
    
    // 방향 태그 (기본값)
    if (words.some(word => word.includes('{dir:'))) {
      // 이미 방향 태그가 있으면 그대로 유지
    } else if (words.includes('가다') || words.includes('오다')) {
      tags.push('{dir:1→3}');
    }
    
    return tags.join(' ');
  }

  calculateConfidence(words, glossWords) {
    const mappedCount = glossWords.filter(word => 
      this.dictionary[word] || this.dictionary[word.replace(/[은는이가을를에의로]/g, '')]
    ).length;
    
    return Math.min(1.0, mappedCount / words.length);
  }
}
