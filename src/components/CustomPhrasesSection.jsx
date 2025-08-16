/**
 * Custom Phrases Section Component
 * 
 * 역할: 사용자의 개인 상용구를 관리하는 섹션
 * 
 * 입력:
 * - 없음 (localStorage에서 직접 데이터 로드)
 * 
 * 출력:
 * - 상용구 목록 (필터링/정렬 가능)
 * - 추가/수정/삭제 기능
 * - 드래그앤드롭으로 순서 변경
 * - 즐겨찾기 토글
 * 
 * 상호작용:
 * - 툴바: 추가 버튼, 카테고리 필터, 즐겨찾기 토글, 정렬 옵션
 * - 리스트: 각 아이템의 수정/삭제/즐겨찾기/드래그
 * - 모달: 상용구 추가/수정 폼
 * 
 * 접근성:
 * - 키보드로 모든 기능 사용 가능
 * - 드래그앤드롭의 키보드 대안 제공
 * - 적절한 ARIA 라벨 및 설명
 * - 포커스 관리 및 스크린 리더 지원
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  getItem, 
  addCustomPhrase, 
  updateCustomPhrase, 
  deleteCustomPhrase
} from '../utils/storage';

const CATEGORIES = ['전체', '업무', '일상', '긴급'];
const SORT_OPTIONS = [
  { value: 'usage', label: '사용 많은 순' },
  { value: 'recent', label: '최근 추가 순' },
  { value: 'alphabetical', label: '가나다 순' }
];

const CustomPhrasesSection = () => {
  const [phrases, setPhrases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState('usage');
  const [showModal, setShowModal] = useState(false);
  const [editingPhrase, setEditingPhrase] = useState(null);

  const [announcement, setAnnouncement] = useState('');

  // 폼 상태
  const [formData, setFormData] = useState({
    text: '',
    category: '일상',
    isFavorite: false
  });

  // 데이터 로드
  const loadPhrases = useCallback(() => {
    try {
      const data = getItem('customPhrases', []);
      setPhrases(Array.isArray(data) ? data : []);
      setIsLoading(false);
    } catch (error) {
      console.error('상용구 데이터 로드 중 오류:', error);
      setPhrases([]);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPhrases();
  }, [loadPhrases]);

  // 필터링 및 정렬된 상용구 목록
  const filteredAndSortedPhrases = useMemo(() => {
    let filtered = phrases;

    // 카테고리 필터
    if (selectedCategory !== '전체') {
      filtered = filtered.filter(phrase => phrase.category === selectedCategory);
    }

    // 즐겨찾기 필터
    if (showFavoritesOnly) {
      filtered = filtered.filter(phrase => phrase.isFavorite);
    }

    // 정렬
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'usage':
          return (b.usageCount || 0) - (a.usageCount || 0);
        case 'recent':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case 'alphabetical':
          return a.text.localeCompare(b.text, 'ko');
        default:
          return 0;
      }
    });

    return sorted;
  }, [phrases, selectedCategory, showFavoritesOnly, sortBy]);

  // 모달 열기/닫기
  const openAddModal = () => {
    setFormData({ text: '', category: '일상', isFavorite: false });
    setEditingPhrase(null);
    setShowModal(true);
  };

  const openEditModal = (phrase) => {
    setFormData({
      text: phrase.text,
      category: phrase.category,
      isFavorite: phrase.isFavorite
    });
    setEditingPhrase(phrase);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPhrase(null);
    setFormData({ text: '', category: '일상', isFavorite: false });
  };

  // 상용구 저장
  const handleSave = async () => {
    if (!formData.text.trim()) {
      makeAnnouncement('텍스트를 입력해주세요.');
      return;
    }

    try {
      let success = false;
      
      if (editingPhrase) {
        success = updateCustomPhrase(editingPhrase.id, {
          text: formData.text.trim(),
          category: formData.category,
          isFavorite: formData.isFavorite
        });
        if (success) {
          makeAnnouncement('상용구가 수정되었습니다.');
        }
      } else {
        success = addCustomPhrase(
          formData.text.trim(),
          formData.category,
          formData.isFavorite
        );
        if (success) {
          makeAnnouncement('새 상용구가 추가되었습니다.');
        }
      }

      if (success) {
        loadPhrases();
        closeModal();
      } else {
        makeAnnouncement('저장 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('상용구 저장 중 오류:', error);
      makeAnnouncement('저장 중 오류가 발생했습니다.');
    }
  };

  // 상용구 삭제
  const handleDelete = (phrase) => {
    if (window.confirm(`"${phrase.text}"를 삭제하시겠습니까?`)) {
      try {
        const success = deleteCustomPhrase(phrase.id);
        if (success) {
          loadPhrases();
          makeAnnouncement('상용구가 삭제되었습니다.');
        } else {
          makeAnnouncement('삭제 중 오류가 발생했습니다.');
        }
      } catch (error) {
        console.error('상용구 삭제 중 오류:', error);
        makeAnnouncement('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  // 즐겨찾기 토글
  const handleFavoriteToggle = (phrase) => {
    try {
      const success = updateCustomPhrase(phrase.id, {
        isFavorite: !phrase.isFavorite
      });
      if (success) {
        loadPhrases();
        makeAnnouncement(
          phrase.isFavorite 
            ? '즐겨찾기에서 제거되었습니다.' 
            : '즐겨찾기에 추가되었습니다.'
        );
      }
    } catch (error) {
      console.error('즐겨찾기 토글 중 오류:', error);
      makeAnnouncement('처리 중 오류가 발생했습니다.');
    }
  };





  // 접근성을 위한 알림 함수
  const makeAnnouncement = (message) => {
    setAnnouncement(message);
    setTimeout(() => setAnnouncement(''), 3000);
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div style={{ padding: 'var(--spacing-lg)', textAlign: 'center' }}>
        <div style={{ 
          fontSize: 'var(--font-size-base)', 
          color: 'var(--text-secondary)' 
        }}>
          상용구 데이터를 불러오는 중...
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: 'var(--spacing-lg)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-lg)'
      }}
    >
      {/* 접근성 알림 영역 */}
      <div 
        role="status" 
        aria-live="polite" 
        aria-atomic="true"
        style={{ 
          position: 'absolute',
          left: '-10000px',
          width: '1px',
          height: '1px',
          overflow: 'hidden'
        }}
      >
        {announcement}
      </div>

      {/* 섹션 제목 */}
      <div style={{ textAlign: 'center' }}>
        <h2
          style={{
            fontSize: 'var(--font-size-xl)',
            fontWeight: '700',
            color: 'var(--text-primary)',
            margin: '0 0 var(--spacing-sm) 0'
          }}
        >
          📝 개인 상용구
        </h2>
        <p
          style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--text-secondary)',
            margin: 0
          }}
        >
          자주 사용하는 문구를 추가하고 관리하세요
        </p>
      </div>

      {/* 툴바 */}
      <div className="card">
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--spacing-md)',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {/* 왼쪽: 추가 버튼 */}
          <button
            className="btn btn-primary"
            onClick={openAddModal}
            aria-label="새 상용구 추가"
          >
            <span aria-hidden="true">+</span>
            추가
          </button>

          {/* 오른쪽: 필터 및 정렬 */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--spacing-sm)',
              alignItems: 'center'
            }}
          >
            {/* 카테고리 필터 */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: 'var(--spacing-sm) var(--spacing-md)',
                border: '1px solid #E0E0E0',
                borderRadius: 'var(--radius)',
                fontSize: 'var(--font-size-sm)',
                backgroundColor: 'var(--white)',
                color: 'var(--text-primary)'
              }}
              aria-label="카테고리 필터"
            >
              {CATEGORIES.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {/* 즐겨찾기만 보기 토글 */}
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)',
                fontSize: 'var(--font-size-sm)',
                color: 'var(--text-primary)',
                cursor: 'pointer'
              }}
            >
              <input
                type="checkbox"
                checked={showFavoritesOnly}
                onChange={(e) => setShowFavoritesOnly(e.target.checked)}
                style={{
                  width: '16px',
                  height: '16px'
                }}
              />
              즐겨찾기만
            </label>

            {/* 정렬 옵션 */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: 'var(--spacing-sm) var(--spacing-md)',
                border: '1px solid #E0E0E0',
                borderRadius: 'var(--radius)',
                fontSize: 'var(--font-size-sm)',
                backgroundColor: 'var(--white)',
                color: 'var(--text-primary)'
              }}
              aria-label="정렬 방식"
            >
              {SORT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 요약 정보 */}
        <div
          style={{
            marginTop: 'var(--spacing-md)',
            padding: 'var(--spacing-sm)',
            backgroundColor: 'var(--background)',
            borderRadius: 'calc(var(--radius) / 2)',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--text-secondary)',
            textAlign: 'center'
          }}
        >
          총 {phrases.length}개 상용구 중 {filteredAndSortedPhrases.length}개 표시
        </div>
      </div>

      {/* 상용구 목록 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-sm)'
        }}
      >
        {filteredAndSortedPhrases.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <div
              style={{
                fontSize: '48px',
                marginBottom: 'var(--spacing-md)'
              }}
              aria-hidden="true"
            >
              📝
            </div>
            <h3
              style={{
                fontSize: 'var(--font-size-lg)',
                color: 'var(--text-primary)',
                marginBottom: 'var(--spacing-sm)'
              }}
            >
              표시할 상용구가 없습니다
            </h3>
            <p
              style={{
                fontSize: 'var(--font-size-base)',
                color: 'var(--text-secondary)',
                marginBottom: 'var(--spacing-lg)'
              }}
            >
              {phrases.length === 0 
                ? '첫 번째 상용구를 추가해보세요!' 
                : '필터 조건을 변경해보세요.'}
            </p>
            {phrases.length === 0 && (
              <button
                className="btn btn-primary"
                onClick={openAddModal}
              >
                상용구 추가하기
              </button>
            )}
          </div>
        ) : (
          filteredAndSortedPhrases.map((phrase) => (
            <div
              key={phrase.id}
              className="card"
              style={{
                transition: 'all 0.2s ease'
              }}
            >
              {/* 상단 행: 드래그 핸들 + 문구 + 별표 */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-md)',
                  marginBottom: 'var(--spacing-sm)'
                }}
              >


                {/* 상용구 텍스트 (한 줄로 표시) */}
                <div 
                  style={{ 
                    flex: 1, 
                    minWidth: 0,
                    fontSize: 'var(--font-size-base)',
                    color: 'var(--text-primary)',
                    fontWeight: '500',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                  title={phrase.text}
                >
                  {phrase.text}
                </div>

                {/* 즐겨찾기 토글 */}
                <button
                  className="btn"
                  onClick={() => handleFavoriteToggle(phrase)}
                  style={{
                    minWidth: '40px',
                    minHeight: '40px',
                    padding: 'var(--spacing-xs)',
                    backgroundColor: 'transparent',
                    color: phrase.isFavorite ? '#FFD700' : 'var(--text-secondary)',
                    fontSize: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                  aria-label={phrase.isFavorite ? '즐겨찾기에서 제거' : '즐겨찾기에 추가'}
                >
                  {phrase.isFavorite ? '⭐' : '☆'}
                </button>
              </div>

              {/* 하단 행: 카테고리 + 사용횟수 + 액션 버튼들 */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 'var(--spacing-md)'
                }}
              >
                {/* 왼쪽: 카테고리 + 사용횟수 */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-md)',
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--text-secondary)'
                  }}
                >
                  <span
                    style={{
                      padding: '2px 8px',
                      backgroundColor: 
                        phrase.category === '업무' ? '#E3F2FD' :
                        phrase.category === '긴급' ? '#FFEBEE' : '#F1F8E9',
                      color:
                        phrase.category === '업무' ? '#1976D2' :
                        phrase.category === '긴급' ? '#C62828' : '#388E3C',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: '600'
                    }}
                  >
                    {phrase.category}
                  </span>
                  <span>사용 {phrase.usageCount || 0}회</span>
                </div>

                {/* 오른쪽: 액션 버튼들 */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-xs)',
                    flexShrink: 0
                  }}
                >
                  {/* 수정 버튼 */}
                  <button
                    className="btn"
                    onClick={() => openEditModal(phrase)}
                    style={{
                      minWidth: '50px',
                      minHeight: '36px',
                      padding: 'var(--spacing-xs) var(--spacing-sm)',
                      backgroundColor: '#F3F4F6',
                      color: 'var(--text-primary)',
                      border: '1px solid #D1D5DB',
                      borderRadius: 'var(--radius)',
                      fontSize: 'var(--font-size-sm)',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 'var(--spacing-xs)'
                    }}
                    aria-label={`"${phrase.text}" 수정`}
                  >
                    <span aria-hidden="true">✏️</span>
                    수정
                  </button>

                  {/* 삭제 버튼 */}
                  <button
                    className="btn"
                    onClick={() => handleDelete(phrase)}
                    style={{
                      minWidth: '50px',
                      minHeight: '36px',
                      padding: 'var(--spacing-xs) var(--spacing-sm)',
                      backgroundColor: '#FEE2E2',
                      color: '#DC2626',
                      border: '1px solid #FECACA',
                      borderRadius: 'var(--radius)',
                      fontSize: 'var(--font-size-sm)',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 'var(--spacing-xs)'
                    }}
                    aria-label={`"${phrase.text}" 삭제`}
                  >
                    <span aria-hidden="true">🗑️</span>
                    삭제
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 추가/수정 모달 */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 'var(--spacing-md)'
          }}
          onClick={closeModal}
        >
          <div
            className="card"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '500px',
              maxHeight: '90vh',
              overflow: 'auto'
            }}
          >
            <h3
              style={{
                fontSize: 'var(--font-size-lg)',
                fontWeight: '600',
                color: 'var(--text-primary)',
                margin: '0 0 var(--spacing-lg) 0',
                textAlign: 'center'
              }}
            >
              {editingPhrase ? '상용구 수정' : '새 상용구 추가'}
            </h3>

            {/* 텍스트 입력 */}
            <div style={{ marginBottom: 'var(--spacing-md)' }}>
              <label
                htmlFor="phrase-text"
                style={{
                  display: 'block',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  marginBottom: 'var(--spacing-xs)'
                }}
              >
                텍스트 *
              </label>
              <textarea
                id="phrase-text"
                value={formData.text}
                onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
                placeholder="상용구 텍스트를 입력하세요"
                style={{
                  width: '100%',
                  minHeight: '80px',
                  padding: 'var(--spacing-md)',
                  border: '1px solid #E0E0E0',
                  borderRadius: 'var(--radius)',
                  fontSize: 'var(--font-size-base)',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
                maxLength={200}
                required
              />
              <div
                style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--text-secondary)',
                  textAlign: 'right',
                  marginTop: 'var(--spacing-xs)'
                }}
              >
                {formData.text.length}/200
              </div>
            </div>

            {/* 카테고리 선택 */}
            <div style={{ marginBottom: 'var(--spacing-md)' }}>
              <label
                htmlFor="phrase-category"
                style={{
                  display: 'block',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  marginBottom: 'var(--spacing-xs)'
                }}
              >
                카테고리
              </label>
              <select
                id="phrase-category"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                style={{
                  width: '100%',
                  padding: 'var(--spacing-md)',
                  border: '1px solid #E0E0E0',
                  borderRadius: 'var(--radius)',
                  fontSize: 'var(--font-size-base)',
                  backgroundColor: 'var(--white)',
                  color: 'var(--text-primary)'
                }}
              >
                {CATEGORIES.slice(1).map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* 즐겨찾기 체크박스 */}
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-sm)',
                  fontSize: 'var(--font-size-base)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer'
                }}
              >
                <input
                  type="checkbox"
                  checked={formData.isFavorite}
                  onChange={(e) => setFormData(prev => ({ ...prev, isFavorite: e.target.checked }))}
                  style={{
                    width: '18px',
                    height: '18px'
                  }}
                />
                <span>⭐ 즐겨찾기에 추가</span>
              </label>
            </div>

            {/* 버튼들 */}
            <div
              style={{
                display: 'flex',
                gap: 'var(--spacing-md)',
                justifyContent: 'center'
              }}
            >
              <button
                className="btn btn-outline"
                onClick={closeModal}
                style={{ minWidth: '100px' }}
              >
                취소
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSave}
                style={{ minWidth: '100px' }}
                disabled={!formData.text.trim()}
              >
                {editingPhrase ? '수정' : '추가'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomPhrasesSection;