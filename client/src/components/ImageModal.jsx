// client/src/components/ImageModal.jsx
import React from 'react';

function ImageModal({ images, currentIndex, onClose, onPrev, onNext }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <img
          src={images[currentIndex]}
          alt={`Viewing ${currentIndex + 1} of ${images.length}`}
          style={{ width: '100%' }}
        />
        <button className="modal-close" onClick={onClose}>X</button>
        {images.length > 1 && (
          <>
            <button className="modal-prev" onClick={onPrev}>&lt;</button>
            <button className="modal-next" onClick={onNext}>&gt;</button>
          </>
        )}
      </div>
    </div>
  );
}

export default ImageModal;