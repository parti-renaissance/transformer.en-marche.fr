import React from 'react';
import ReactSVG from 'react-svg';
import Moment from 'react-moment';

const rootPath = process.env.REACT_APP_ROOT_PATH || ''; // for access assets when running on a nested path, i.e. github pages

const ChezVousFixedModal = ({ isOpen, closeModal }) => {
    if (isOpen === false) {
        return null;
    }

    return (
        <div className="fixed-modal">
            <div className="fixed-modal__content">
                <button className="fixed-modal__close" onClick={closeModal}>
                    <ReactSVG
                        className="banner-icon"
                        path={`${rootPath}/assets/svg/close.svg`}
                    />
                </button>
                <span className="subtitle">
                    <Moment date="2017-05-14" durationFromNow format="Y"/> ans du quinquennat
                </span>
                <div className="title">Consultez ici ce qui a changé près de chez vous</div>
            </div>
            <div className="fixed-modal__footer">
                <a className="fixed-modal__button" href="https://chezvous.en-marche.fr/" target="_blank" rel="noopener noreferrer">J'entre ma ville</a>
            </div>
            <div className="fixed-modal__illustration">
                <ReactSVG
                    path={`${rootPath}/assets/svg/chezvous-teaser.svg`}
                />
            </div>
        </div>
    );
};

export default ChezVousFixedModal;
