import React, { Component } from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter } from '@fortawesome/fontawesome-free-brands';
import { withRouter } from 'react-router'

import '../../scss/layout.css';

const Header = () =>
  <header className="header">
    <div className="header-left">
      <a href="/" title="En Marche!" rel="noopener noreferrer" className="header-logo">EM!</a><span className="header-sep"> | </span><span className="header-tag">Il l&apos;a dit, il le fait</span>
    </div>

    <div className="header-right">
      Partager
      <a href="" className="header-social" target="_blank" rel="noopener noreferrer">
        <FontAwesomeIcon icon={faFacebookF} />
      </a>
      <a href="" className="header-social" target="_blank" rel="noopener noreferrer">
        <FontAwesomeIcon icon={faTwitter} />
      </a>
    </div>

    <div className="header-right__mobile">
      <button className="header-button">Partager</button>
    </div>
  </header>

const Footer = () =>
  <footer className="footer">
    <div className="footer-body">
    © La République En Marche | <a href="https://en-marche.fr/mentions-legales" target="_blank" rel="noopener noreferrer">Mentions Légales</a> | <a href="https://en-marche.fr/politique-cookies" target="_blank" rel="noopener noreferrer">Politique de Cookies</a>
    </div>
  </footer>

class Page extends Component {
  render() {
    let { location } = this.props;
    let isDashboard = location && location.pathname.slice(1).split('/').length <= 1;
    return (
      <div className={`Page${isDashboard ? ' Page__dashboard' : ''}`}>
        <Header />
        {this.props.children}
        <Footer />
      </div>
    )
  }
}

export default withRouter(Page);
