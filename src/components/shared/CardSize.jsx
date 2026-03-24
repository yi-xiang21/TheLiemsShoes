import React from 'react';import '../../assets/css/detail.css'; // Mượn css của detail.css hoặc có thể tạo css riêng

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
