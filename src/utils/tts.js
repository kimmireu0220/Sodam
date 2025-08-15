/**
 * TTS (Text-to-Speech) 유틸리티 함수
 * 
 * 역할: 텍스트를 음성으로 변환하는 기능을 제공합니다.
 * 
 * 입력:
 * - text: 음성으로 변환할 텍스트
 * - options: 음성 설정 옵션 (속도, 피치, 볼륨 등)
 * 
 * 출력:
 * - 음성 재생
 * - 재생 상태 콜백
 * 
 * 브라우저 지원:
 * - Chrome, Safari, Firefox (한국어 음성 가용성에 따라 다름)
 */

class TTSService {
  constructor() {
    this.synthesis = window.speechSynthesis;
    this.utterance = null;
    this.isPlaying = false;
    this.onStateChange = null;
  }

  // 한국어 음성 찾기
  findKoreanVoice() {
    const voices = this.synthesis.getVoices();
    // 한국어 음성 우선 선택
    const koreanVoice = voices.find(voice => 
      voice.lang.startsWith('ko') || 
      voice.lang.startsWith('ko-KR')
    );
    
    // 한국어 음성이 없으면 기본 음성 사용
    return koreanVoice || voices.find(voice => 
      voice.lang.startsWith('en') || 
      voice.default
    );
  }

  // 음성 재생
  speak(text, options = {}) {
    if (!this.synthesis) {
      console.error('Speech synthesis not supported');
      return false;
    }

    // 이전 음성 중지
    this.stop();

    // 음성 설정
    const voice = this.findKoreanVoice();
    if (!voice) {
      console.error('No suitable voice found');
      return false;
    }

    // Utterance 생성
    this.utterance = new SpeechSynthesisUtterance(text);
    this.utterance.voice = voice;
    this.utterance.rate = options.rate || 0.9; // 속도 (0.1 ~ 10)
    this.utterance.pitch = options.pitch || 1.0; // 피치 (0 ~ 2)
    this.utterance.volume = options.volume || 1.0; // 볼륨 (0 ~ 1)

    // 이벤트 리스너 설정
    this.utterance.onstart = () => {
      this.isPlaying = true;
      this.onStateChange?.('playing');
    };

    this.utterance.onend = () => {
      this.isPlaying = false;
      this.onStateChange?.('stopped');
    };

    this.utterance.onerror = (event) => {
      this.isPlaying = false;
      console.error('TTS Error:', event.error);
      this.onStateChange?.('error', event.error);
    };

    // 음성 재생
    this.synthesis.speak(this.utterance);
    return true;
  }

  // 음성 중지
  stop() {
    if (this.synthesis && this.isPlaying) {
      this.synthesis.cancel();
      this.isPlaying = false;
      this.onStateChange?.('stopped');
    }
  }

  // 재생 상태 확인
  getPlayingState() {
    return this.isPlaying;
  }

  // 사용 가능한 음성 목록 반환
  getAvailableVoices() {
    return this.synthesis ? this.synthesis.getVoices() : [];
  }
}

// 싱글톤 인스턴스 생성
const ttsService = new TTSService();

// 브라우저가 음성 목록을 로드할 때까지 대기
if (window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    // 음성 목록이 로드되면 콜백 호출
    console.log('Voices loaded:', ttsService.getAvailableVoices().length);
  };
}

export default ttsService;
