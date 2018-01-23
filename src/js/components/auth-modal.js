import React from 'react';
import Modal from 'react-modal';
import { withRouter } from 'react-router-dom'
import T from 'i18n-react';

import '../../scss/auth-modal.css';

Modal.setAppElement('#root');

const registerURL =`${process.env.REACT_APP_REGISTER_URL}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}`;
const loginURL = `${process.env.REACT_APP_LOGIN_URL}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}`;

const AuthModal = ({ isOpen, closeModal, location, locale }) =>
  <Modal
    isOpen={isOpen}
    overlayClassName='auth-modal'
    className='auth-modal__wrapper'
  >
    <div className="auth-modal__body">
      <h3 className="auth-modal__logo">EM!</h3>
      <T.p text='auth.loginPrompt' context={locale} />

      <T.a
        text='auth.login'
        context={locale}
        href={`${loginURL}&state=${location.pathname}${location.search}`}
        className="auth-button__login" />

    </div>
    <div className="auth-modal__footer">
      {T.translate('auth.noAccount', {context: locale, url: registerURL})}&nbsp;
      <T.a
        text='auth.signUp'
        context={locale}
        href={registerURL}
        target="_blank"
        rel="nofollow noopener" />
    </div>

    <button className="auth-modal__close-button" onClick={closeModal}>
      {T.translate('auth.close', {context: locale})}
      <span>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </span>
    </button>
  </Modal>

export default withRouter(AuthModal);
