/**
 * KSL 변환 규칙
 */

export const KSL_RULES = {
  /**
   * 조사 제거
   */
  removeParticles: (word) => {
    return word.replace(/[은는이가을를에의로]/g, '');
  },

  /**
   * 시간/장소 전면화
   */
  moveTimePlace: (words) => {
    const timeWords = [
      '오늘', '내일', '어제', '지금', '나중에', '아침', '점심', '저녁',
      '언제', '언제부터', '언제까지', '그때', '이제', '나중', '오전', '오후',
      '새벽', '밤', '주말', '평일', '월요일', '화요일', '수요일', '목요일', '금요일',
      '토요일', '일요일', '월', '년', '시간', '분', '초'
    ];
    
    const placeWords = [
      '학교', '집', '병원', '식당', '회사', '가게', '은행', '역', '공원',
      '도서관', '극장', '카페', '마트', '살롱', '지하철', '버스정류장',
      '공항', '항구', '호텔', '모텔', '운동장', '수영장', '놀이터',
      '산', '바다', '강', '호수', '섬', '동네', '골목', '길가'
    ];
    
    // 시간/장소 단어들을 찾아서 전면으로 이동
    const timeFound = [];
    const placeFound = [];
    const otherWords = [];
    
    words.forEach(word => {
      // 정확한 단어 매칭 및 어근 매칭 처리
      const isTimeWord = timeWords.some(timeWord => 
        word === timeWord || word.includes(timeWord) || timeWord.includes(word)
      );
      const isPlaceWord = placeWords.some(placeWord => 
        word === placeWord || word.includes(placeWord) || placeWord.includes(word)
      );
      
      if (isTimeWord) {
        timeFound.push(word);
      } else if (isPlaceWord) {
        placeFound.push(word);
      } else {
        otherWords.push(word);
      }
    });
    
    // KSL 어순: 시간 + 장소 + 나머지
    return [...timeFound, ...placeFound, ...otherWords];
  },

  /**
   * 방향동사 태그 추가
   */
  addDirectionalTags: (words) => {
    const directionalMappings = {
      // 기본 방향동사
      '가다': '{dir:1→3}',  // 1인칭에서 3인칭으로
      '오다': '{dir:3→1}',  // 3인칭에서 1인칭으로
      '주다': '{dir:1→3}',  // 1인칭에서 3인칭으로
      '받다': '{dir:3→1}', // 3인칭에서 1인칭으로
      '보내다': '{dir:1→3}',
      '가져오다': '{dir:3→1}',
      '가져가다': '{dir:1→3}',
      '들어가다': '{dir:1→3}',
      '나가다': '{dir:1→3}',
      '들어오다': '{dir:3→1}',
      '나오다': '{dir:3→1}',
      '올라가다': '{dir:1→3}',
      '내려가다': '{dir:1→3}',
      '올라오다': '{dir:3→1}',
      '내려오다': '{dir:3→1}'
    };
    
    return words.map(word => {
      // 정확한 매칭 확인
      if (directionalMappings[word]) {
        return `${word} ${directionalMappings[word]}`;
      }
      
      // 부분 매칭 (어근 에 대한 처리)
      for (const [verb, tag] of Object.entries(directionalMappings)) {
        if (word.includes(verb)) {
          return `${word} ${tag}`;
        }
      }
      
      return word;
    });
  },

  /**
   * 문장 유형 판별
   */
  getSentenceType: (text) => {
    // 의문문 패턴
    const questionPatterns = [
      /\?/, // 물음표
      /니까$/, /나요$/, /까요$/, // 의문 어미
      /어디/, /언제/, /무엇/, /누구/, /왜/, /어떻게/, /뭐/ // 의문사
    ];
    
    // 부정문 패턴
    const negativePatterns = [
      /\b안\b/, /\b못\b/, /\b없\b/, // 부정 부사
      /아니/, /싫/, /싶지\s*않/, /말지\s*말/ // 기타 부정 표현
    ];
    
    // 명령문 패턴
    const imperativePatterns = [
      /세요$/, /어라$/, /아라$/, /가라$/, /오라$/,
      /해라$/, /하지\s*마/, /하지\s*마라/
    ];
    
    // 감탄문 패턴
    const exclamatoryPatterns = [
      /!/, /아!/, /오!/, /와!/, /어머!/, /세상에!/
    ];
    
    if (questionPatterns.some(pattern => pattern.test(text))) {
      return 'question';
    } else if (negativePatterns.some(pattern => pattern.test(text))) {
      return 'negative';
    } else if (imperativePatterns.some(pattern => pattern.test(text))) {
      return 'imperative';
    } else if (exclamatoryPatterns.some(pattern => pattern.test(text))) {
      return 'exclamatory';
    } else {
      return 'declarative';
    }
  },
  
  /**
   * 수화 태그 매핑
   */
  getSignLanguageTags: (sentenceType, text, words) => {
    const tags = [];
    
    // 비수지 태그 (NMM: Non-Manual Markers)
    switch (sentenceType) {
      case 'question':
        tags.push('{NMM:WH?}');
        break;
      case 'negative':
        tags.push('{NMM:neg}');
        break;
      case 'imperative':
        tags.push('{NMM:imp}');
        break;
      case 'exclamatory':
        tags.push('{NMM:excl}');
        break;
      default:
        tags.push('{NMM:neutral}');
    }
    
    // 방향 태그 처리
    const hasDirectionalTag = words.some(word => word.includes('{dir:'));
    if (!hasDirectionalTag) {
      // 기본 방향 태그 추가 (문맥에 따라)
      if (text.includes('가다') || text.includes('가요') || text.includes('가세요')) {
        tags.push('{dir:1→3}');
      } else if (text.includes('오다') || text.includes('와요') || text.includes('오세요')) {
        tags.push('{dir:3→1}');
      }
    }
    
    return tags.join(' ');
  }
};

// 별도 함수로 내보내기
export const analyzeKoreanSentence = (text) => {
  return {
    type: KSL_RULES.getSentenceType(text),
    tags: KSL_RULES.getSignLanguageTags(
      KSL_RULES.getSentenceType(text), 
      text, 
      text.split(/\s+/)
    )
  };
};