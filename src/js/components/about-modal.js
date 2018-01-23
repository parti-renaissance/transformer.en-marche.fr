import React from 'react';
import Modal from 'react-modal';
import T from 'i18n-react';

import '../../scss/about-modal.css';

Modal.setAppElement('#root');

const AboutModal = ({ isOpen, closeModal, locale }) =>
  <Modal
    isOpen={isOpen}
    overlayClassName='about-modal'
    className='about-modal__wrapper'
    locale={locale}
  >
    <div className="about-modal__body">
      <h3>{T.translate('about.title', {context: locale})}</h3>
      <p>{T.translate('about.p1', {context: locale})}</p>
      <p>{T.translate('about.p2', {context: locale})}</p>
      <ul>
        <li>{T.translate('about.li1', {context: locale})}</li>
        <li>{T.translate('about.li2', {context: locale})}</li>
        <li>{T.translate('about.li3', {context: locale})}</li>
        <li>{T.translate('about.li4', {context: locale})}</li>
      </ul>
      <p>{T.translate('about.p3', {context: locale})}</p>
      <p>{T.translate('about.p4a', {context: locale})} <a href="https://contact.en-marche.fr/" rel="noopener noreferrer" target="_blank">{T.translate('about.p4b', {context: locale})}</a>.
      </p>
    </div>

    <button className="about-modal__close-button" onClick={closeModal}>
      {T.translate('about.close', {context: locale})}
      <span>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </span>
    </button>
  </Modal>

export default AboutModal;
