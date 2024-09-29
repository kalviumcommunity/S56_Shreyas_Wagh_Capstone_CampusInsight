import React from 'react';
import './Styles/PostModal.css';

const PostModal = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>X</button>
        <form onSubmit={handleSubmit}>
          <textarea placeholder="What's happening?" required></textarea>
          <button type="submit">Post</button>
        </form>
      </div>
    </div>
  );
};

export default PostModal;
