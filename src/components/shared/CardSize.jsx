import React from 'react';
import '../../assets/css/detail.css'; // Reuse styles from detail.css.

const CardSize = ({id, size, isSelected, onClick }) => {
  return (
    <button
      data-sizeId={id}
      className={`detailSizeButton ${isSelected ? 'isSelected' : ''}`}
      onClick={onClick}
    >
      <span>{size}</span>
    </button>
  );
};

export default CardSize;
