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
    const timeWords = ['오늘', '내일', '어제', '지금', '나중에', '아침', '점심', '저녁'];
    const placeWords = ['학교', '집', '병원', '식당', '회사', '가게', '은행', '역', '공원'];
    
    const timeFound = words.filter(w => timeWords.includes(w));
    const placeFound = words.filter(w => placeWords.includes(w));
    const otherWords = words.filter(w => !timeWords.includes(w) && !placeWords.includes(w));
    
    return [...timeFound, ...placeFound, ...otherWords];
  },

  /**
   * 방향동사 태그 추가
   */
  addDirectionalTags: (words) => {
    const directionalVerbs = ['가다', '오다', '주다', '받다'];
    
    return words.map(word => {
      if (directionalVerbs.includes(word)) {
        return `${word} {dir:1→3}`;
      }
      return word;
    });
  },

  /**
   * 문장 유형 판별
   */
  getSentenceType: (text) => {
    if (text.includes('?') || text.includes('까')) {
      return 'question';
    } else if (text.includes('안') || text.includes('못') || text.includes('없')) {
      return 'negative';
    } else {
      return 'declarative';
    }
  }
};
