/**
 * STT (Speech-to-Text) 유틸리티 함수
 * 
 * 역할: 음성을 텍스트로 변환하는 기능을 제공합니다.
 * 
 * 입력:
 * - language: 인식할 언어 (기본값: 'ko' - 한국어)
 * - options: 음성 인식 설정 옵션 (연속 인식, 중간 결과 등)
 * 
 * 출력:
 * - 음성 인식 결과 텍스트
 * - 인식 상태 콜백
 * 
 * 브라우저 지원:
 * - Chrome, Safari, Firefox (Web Speech API 지원 브라우저)
 * - react-speech-recognition 라이브러리 사용
 */

import SpeechRecognition from 'react-speech-recognition';

class STTService {
  constructor() {
    this.isListening = false;
    this.onStateChange = null;
    this.onResult = null;
    this.onError = null;
    this.language = 'ko'; // 기본값: 한국어
    this.transcript = '';
    this.finalTranscript = '';
    this.interimTranscript = '';
  }

  // 브라우저 지원 확인
  isBrowserSupported() {
    return SpeechRecognition.browserSupportsSpeechRecognition();
  }

  // 연속 듣기 지원 확인
  isContinuousListeningSupported() {
    // react-speech-recognition에서는 대부분의 브라우저에서 지원
    return this.isBrowserSupported();
  }

  // 마이크 권한 확인
  async checkMicrophonePermission() {
    try {
      if (navigator.permissions) {
        const permission = await navigator.permissions.query({ name: 'microphone' });
        return permission.state === 'granted';
      }
      // 권한 API가 없는 경우, 실제 시도해보기
      return true;
    } catch (error) {
      console.warn('마이크 권한 확인 실패:', error);
      return true; // 확인할 수 없는 경우 시도해보기
    }
  }

  // 음성 인식 시작
  async startListening(options = {}) {
    if (!this.isBrowserSupported()) {
      const error = '브라우저가 음성 인식을 지원하지 않습니다.';
      console.error(error);
      this.onError?.(error);
      return false;
    }

    try {
      this.isListening = true;
      this.transcript = '';
      this.finalTranscript = '';
      this.interimTranscript = '';
      
      this.onStateChange?.('listening');

      // 음성 인식 시작
      await SpeechRecognition.startListening({
        continuous: options.continuous !== false, // 기본값: true
        language: options.language || this.language,
        interimResults: options.interimResults !== false // 기본값: true
      });

      return true;
    } catch (error) {
      this.isListening = false;
      console.error('음성 인식 시작 실패:', error);
      this.onError?.(error.message || '음성 인식을 시작할 수 없습니다.');
      this.onStateChange?.('error');
      return false;
    }
  }

  // 음성 인식 중지
  async stopListening() {
    if (!this.isListening) {
      return;
    }

    try {
      this.isListening = false;
      await SpeechRecognition.stopListening();
      this.onStateChange?.('stopped');
    } catch (error) {
      console.error('음성 인식 중지 실패:', error);
      this.onError?.(error.message || '음성 인식을 중지할 수 없습니다.');
    }
  }

  // 음성 인식 중단 (즉시 중지)
  async abortListening() {
    if (!this.isListening) {
      return;
    }

    try {
      this.isListening = false;
      await SpeechRecognition.abortListening();
      this.onStateChange?.('aborted');
    } catch (error) {
      console.error('음성 인식 중단 실패:', error);
      this.onError?.(error.message || '음성 인식을 중단할 수 없습니다.');
    }
  }

  // 언어 설정
  setLanguage(language) {
    this.language = language;
  }

  // 현재 언어 반환
  getLanguage() {
    return this.language;
  }

  // 인식 상태 확인
  getListeningState() {
    return this.isListening;
  }

  // 현재 인식된 텍스트 반환
  getTranscript() {
    return this.transcript;
  }

  // 최종 인식된 텍스트 반환
  getFinalTranscript() {
    return this.finalTranscript;
  }

  // 중간 인식된 텍스트 반환 (처리 중인 텍스트)
  getInterimTranscript() {
    return this.interimTranscript;
  }

  // 내부적으로 인식 결과를 업데이트하는 메서드
  _updateTranscript(transcript, finalTranscript, interimTranscript) {
    this.transcript = transcript;
    this.finalTranscript = finalTranscript;
    this.interimTranscript = interimTranscript;
    
    // 결과 콜백 호출
    this.onResult?.({
      transcript,
      finalTranscript,
      interimTranscript,
      isFinal: !!finalTranscript && !interimTranscript
    });
  }

  // 인식 상태 변경 시 호출될 콜백 설정
  setOnStateChange(callback) {
    this.onStateChange = callback;
  }

  // 인식 결과 수신 시 호출될 콜백 설정
  setOnResult(callback) {
    this.onResult = callback;
  }

  // 오류 발생 시 호출될 콜백 설정
  setOnError(callback) {
    this.onError = callback;
  }

  // 리소스 정리
  cleanup() {
    if (this.isListening) {
      this.abortListening();
    }
    this.onStateChange = null;
    this.onResult = null;
    this.onError = null;
  }
}

// 싱글톤 인스턴스 생성
const sttService = new STTService();

export default sttService;