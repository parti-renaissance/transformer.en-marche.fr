import React, { Component } from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter } from '@fortawesome/fontawesome-free-brands';

import '../../scss/layout.css';

const Header = () =>
  <header className="header">
    <div className="header-left">
      <a href="https://en-marche.fr" title="En Marche!" target="_blank" rel="noopener noreferrer" className="header-logo">EM!</a><span className="header-sep"> | </span><span className="header-tag">Alors, ça avance ?</span>
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

export default class Page extends Component {
  render() {
    return (
      <div className="Page">
        <Header />
        {this.props.children}
        <Footer />
      </div>
    )
  }
}
