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
        Grâce à On l'a dit, On le fait, vous pouvez suivre la mise en oeuvre des engagements du programme présidentiel.
      </p>
      <p>
          Pour vous aider à y voir plus clair, nous avons classé les mesures du programme présidentiel en quatre catégories :
          <ul>
            <li>« à venir » : la mesure a été adoptée</li>
            <li>« en cours » : le Gouvernement ou le Parlement travaille sur cette mesure</li>
            <li>« fait » : le Gouvernement ou le Parlement se saisit du sujet d'ici la fin du quinquennat</li>
            <li>« modifié » : la mesure a été amendée</li>
          </ul>
      </p>
      <p>
        Cet outil recense les mesures du programme présidentiel. Il ne prend pas encore en comptes les mesures annoncées par le président de la République et son Gouvernement depuis l’élection présidentielle.
      </p>
      <p>
        Vous avez encore des questions ? <a href="https://contact.en-marche.fr/" rel="noopener noreferrer" target="_blank">Écrivez-nous</a>.
      </p>
    </div>

    <button className="about-modal__close-button" onClick={closeModal}>
      Fermer <span>X</span>
    </button>
  </Modal>

export default AboutModal;
