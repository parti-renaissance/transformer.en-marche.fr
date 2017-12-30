import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { ShareButtons, generateShareIcon } from 'react-share';
import clickOutside from 'react-click-outside';
import Transition from 'react-transition-group/Transition';
import Media from "react-media"

import '../../scss/layout.css';

const { FacebookShareButton, TwitterShareButton } = ShareButtons;
const FacebookIcon = generateShareIcon('facebook');
const TwitterIcon = generateShareIcon('twitter');

const SOCIAL_COPY = "Suivez le progrès du gouvernement https://transformerlafrance.fr";

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

const Header = ({ locale }) => {
  return (
    <header className="header">
      <div className="header-left">
        <Link to={`/${locale}`} title="En Marche!" className="header-logo">EM!</Link><span className="header-sep"> | </span><span className="header-tag">On le dit, on le fait</span>
      </div>

        <Media query="(min-width: 800px)">
        {matches =>
          matches ?
          <div className="header-right">
            Partager
            <FacebookShareButton url={window.location.toString()} quote={SOCIAL_COPY}>
              <FacebookIcon round={true} size={35}/>
            </FacebookShareButton>
            <TwitterShareButton url={window.location.toString()} title={SOCIAL_COPY}>
              <TwitterIcon round={true} size={35}/>
            </TwitterShareButton>
          </div>
          :
          <div className="header-right">
            <MobileShare />
          </div>
        }
        </Media>
    </header>
  );
}

const Footer = () =>
  <footer className="footer">
    <div className="footer-body">
    © La République En Marche | <a href="https://en-marche.fr/mentions-legales" target="_blank" rel="noopener noreferrer">Mentions Légales</a> | <a href="https://en-marche.fr/politique-cookies" target="_blank" rel="noopener noreferrer">Politique de Cookies</a> | <a href="https://github.com/EnMarche/gov-timeline" target="_blank" rel="noopener noreferrer">Code libre sur Github</a>
    </div>
  </footer>

class Page extends Component {
  render() {
    let { location } = this.props;
    let locale = location.pathname.slice(1).split('/')[0];
    let isDashboard = location && location.pathname.slice(1).split('/').length <= 1;
    return (
      <div className={`Page${isDashboard ? ' Page__dashboard' : ''}`}>
        <Header locale={locale} />
        {this.props.children}
        <Footer />
      </div>
    )
  }
}

export default withRouter(Page);
