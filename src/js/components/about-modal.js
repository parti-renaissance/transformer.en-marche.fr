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
      <p>
        Grâce à On l'a dit, On le fait, suivez la mise en œuvre du plan de
        transformation.
      </p>
      <p>
        Pour vous aider à y voir plus clair, nous avons classé les mesures du
        programme présidentiel en quatre catégories :
          <ul>
            <li>« fait » : la mesure a été adoptée</li>
            <li>« en cours » : le Gouvernement ou le Parlement travaille sur cette mesure</li>
            <li>« à venir » : le Gouvernement ou le Parlement se saisira du sujet d'ici la fin du quinquennat</li>
            <li>« modifié » : la mesure a été amendée</li>
          </ul>
      </p>
      <p>
        Cet outil recense les mesures du programme présidentiel. Il ne prend pas
        encore en compte les mesures annoncées par le président de la République
        et son Gouvernement depuis l’élection présidentielle.
      </p>
      <p>
        Vous avez encore des questions ? <a href="https://contact.en-marche.fr/" rel="noopener noreferrer" target="_blank">Écrivez-nous</a>.
      </p>
    </div>

    <button className="about-modal__close-button" onClick={closeModal}>
      Fermer
      <span>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </span>
    </button>
  </Modal>

export default AboutModal;
