import React from 'react';
import Modal from 'react-modal';

import '../../scss/about-modal.css';

Modal.setAppElement('#root');

const AboutModal = ({ isOpen, closeModal }) =>
  <Modal
    isOpen={isOpen}
    overlayClassName='about-modal'
    className='about-modal__wrapper'
  >
    <div className="about-modal__body">
      <h3 className="about-modal__logo">EM!</h3>
      
    </div>
    
    <div className="about-modal__footer">
    </div>
    
  
    <button className="about-modal__close-button" onClick={closeModal}>
      Fermer <span>X</span>
    </button>
  </Modal>

export default AboutModal;
