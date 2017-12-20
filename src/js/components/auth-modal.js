import React from 'react';
import Modal from 'react-modal';

import '../../scss/auth-modal.css';

Modal.setAppElement('#root');

const registerURL = 'https://staging-auth.en-marche.fr/register?response_type=code&client_id=6e06fa85-5d55-4503-ab5d-d65eb5685494&redirect_uri=http://localhost:3000'; // process.env.REACT_APP_REGISTER_URL;

const loginURL = 'https://staging-auth.en-marche.fr/oauth/v2/auth?response_type=code&client_id=6e06fa85-5d55-4503-ab5d-d65eb5685494&redirect_uri=http://localhost:3000&scope=&state=';

const AuthModal = ({ isOpen, closeModal }) =>
  <Modal
    isOpen={isOpen}
    overlayClassName='auth-modal'
    className='auth-modal__wrapper'
  >
    <div className="auth-modal__body">
      <h3 className="auth-modal__logo">EM!</h3>
      <p>
        Identifiez-vous afin d’accéder à plus de fonctionalités.
      </p>
      
      <a href={loginURL} className="auth-button__login">Connexion</a>
      
    </div>
    <div className="auth-modal__footer">
      Pas de compte ? <a href={registerURL} target="_blank" rel="noreferrer noopener">S&apos;inscrire</a>
    </div>
    
    <button className="auth-modal__close-button" onClick={closeModal}>Fermer <span>X</span></button>
  </Modal>

export default AuthModal;
