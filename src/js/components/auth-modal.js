import React from 'react';
import Modal from 'react-modal';
import { withRouter } from 'react-router-dom'

import '../../scss/auth-modal.css';

Modal.setAppElement('#root');

const registerURL =`${process.env.REACT_APP_REGISTER_URL}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}`;
const loginURL = `${process.env.REACT_APP_LOGIN_URL}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}`;

const AuthModal = ({ isOpen, closeModal, location }) =>
  <Modal
    isOpen={isOpen}
    overlayClassName='auth-modal'
    className='auth-modal__wrapper'
  >
    <div className="auth-modal__body">
      <h3 className="auth-modal__logo">EM!</h3>
      <p>
        Identifiez-vous afin de pouvoir voter pour les mesures les plus importantes pour vous.
      </p>

      <a href={`${loginURL}&state=${location.pathname}${location.search}`} className="auth-button__login">Connexion</a>

    </div>
    <div className="auth-modal__footer">
      Pas de compte ? <a href={`${registerURL}`} target="_blank" rel="noreferrer noopener">S&apos;inscrire</a>
    </div>

    <button className="auth-modal__close-button" onClick={closeModal}>Fermer <span>X</span></button>
  </Modal>

export default withRouter(AuthModal);
