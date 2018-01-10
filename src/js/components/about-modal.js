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
      <h3>À propos</h3>
      <p>
        Emmanuel Macron a été élu président de la République avec une promesse :
        transformer la France.
      </p>
      <p>
        Cet outil vous permet de suivre l’avancée des mesures contenues dans le programme présidentiel en fonction des catégories «&nbsp;à venir&nbsp;», «&nbsp;en cours&nbsp;», «&nbsp;fait&nbsp;» et «&nbsp;modifié&nbsp;».
      </p>
      <p>
        Les principales mesures sont disponibles ici, les autres le sont ici.
      </p>
      <p>
        Pour le moment, cet outil ne prend pas en compte les mesures annoncées par le président de la République et son Gouvernement après l’élection présidentielle.
      </p>
    </div>

    <button className="about-modal__close-button" onClick={closeModal}>
      Fermer <span>X</span>
    </button>
  </Modal>

export default AboutModal;
