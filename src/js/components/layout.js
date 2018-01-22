import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { ShareButtons, generateShareIcon } from 'react-share';
import clickOutside from 'react-click-outside';
import Transition from 'react-transition-group/Transition';
import Media from "react-media";
import T from 'i18n-react';

import TranslateDropdown from './translate-dropdown';

import '../../scss/layout.css';

const { FacebookShareButton, TwitterShareButton } = ShareButtons;
const FacebookIcon = generateShareIcon('facebook');
const TwitterIcon = generateShareIcon('twitter');

const SOCIAL_COPY = "Suivez le progrès du gouvernement";

const duration = 125;
const SharePanel = ({ in: inProp }) =>
  <Transition in={inProp} timeout={duration} mountOnEnter={true} unmountOnExit={true}>
    {(state) => (
      <div className="share-panel" style={{
        transition: `opacity ${duration}ms ease`,
        opacity: ['entering', 'exiting'].includes(state) ? 0 : 1
      }}>
        <FacebookShareButton url={window.location.toString()} quote={SOCIAL_COPY}>
          <FacebookIcon round={true} size={35}/>
        </FacebookShareButton>
        <TwitterShareButton url={window.location.toString()} title={SOCIAL_COPY}>
          <TwitterIcon round={true} size={35}/>
        </TwitterShareButton>
      </div>
    )}
  </Transition>

class MobileShare extends Component {
  state = {isOpened: false}

  handleClickOutside() {
    this.setState({ isOpened: false });
  }

  render() {
    let { isOpened } = this.state;
    return (
      <div className="mobile-share">
        <button className="header-button" onClick={() => this.setState({ isOpened: !isOpened })}>Partager</button>
        <SharePanel in={isOpened} />
      </div>
    );
  }
}

MobileShare = clickOutside(MobileShare);

const Header = ({ locale, hasToken, disconnect, openAbout, location, useTranslation }) => {
  return (
    <header className={`header${useTranslation ? ' i18n' : ''}`}>
      <div className="header-left">
        <Link to={`/${locale}`} title="En Marche!" className="header-logo">EM!</Link><span className="header-sep"> | </span><span className="header-tag">{T.translate('projet.title', {context: locale})}</span>
      </div>

        <Media query="(min-width: 800px)">
        {matches =>
          matches ?
          <div className="header-right">
            {useTranslation &&
              <TranslateDropdown selected={locale} location={location} />}
            <button onClick={openAbout} className="header-right__about">{T.translate('projet.headerAbout', {context: locale})}</button>
            <span className="header-right__divider">|</span>
            {T.translate('projet.headerShare', {context: locale})}
            <FacebookShareButton url={window.location.toString()} quote={SOCIAL_COPY}>
              <FacebookIcon round={true} size={35}/>
            </FacebookShareButton>
            <TwitterShareButton url={window.location.toString()} title={SOCIAL_COPY}>
              <TwitterIcon round={true} size={35}/>
            </TwitterShareButton>

            {hasToken &&
              <button className="header-disconnect" onClick={disconnect}>{T.translate('projet.headerLogout', {context: locale})}</button>}
          </div>
          :
          <div className="header-right">
            {useTranslation &&
              <TranslateDropdown selected={locale} location={location} small />}
            <MobileShare />
          </div>
        }
        </Media>
    </header>
  );
}

const Footer = ({ locale }) =>
  <footer className="footer">
    <div className="footer-body">
    © <a href="https://en-marche.fr" target="_blank" rel="noopener noreferrer">La République En Marche</a> | <a href="https://contact.en-marche.fr/" rel="noopener noreferrer" target="_blank">{T.translate('about.p4b', {context: locale})}</a> | <a href="https://en-marche.fr/mentions-legales" target="_blank" rel="noopener noreferrer">{T.translate('projet.footerTerms', {context: locale})}</a> | <a href="https://en-marche.fr/politique-cookies" target="_blank" rel="noopener noreferrer">{T.translate('projet.footerPrivacy', {context: locale})}</a> | <a href="https://github.com/EnMarche/gov-timeline" target="_blank" rel="noopener noreferrer">{T.translate('projet.footerOs', {context: locale})}</a>
    </div>
  </footer>

class Layout extends Component {
  render() {
    let { location, hasToken, disconnect, openAbout, useTranslation } = this.props;
    let locale = location.pathname.slice(1).split('/')[0];
    let isDashboard = location && location.pathname.slice(1).split('/').length <= 1;
    return (
      <div className={`Page${isDashboard ? ' Page__dashboard' : ''}`}>
        <Header
         locale={locale}
         hasToken={hasToken}
         disconnect={disconnect}
         openAbout={openAbout}
         location={location}
         useTranslation={useTranslation}
        />
        {this.props.children}
        <Footer
         locale={locale}
        />
      </div>
    )
  }
}

export default withRouter(Layout);
