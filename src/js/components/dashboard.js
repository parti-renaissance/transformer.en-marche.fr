import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import { Link } from 'react-router-dom';
import compact from 'lodash/compact';

import { getVoteCount } from '../actions/vote-actions';
import { closeAuth } from '../actions/auth-actions';
import { Measures } from './measure';
import LastUpdated from './last-updated';
import ProgressMeter from './progress-meter';
import Subscribe from './subscribe';
import AuthModal from './auth-modal';

import '../../scss/dashboard.css';
import macron from '../../images/macron.jpg';
// import macron2x from '../../images/macron@2x.jpg';
// import macron3x from '../../images/macron@3x.jpg';

const END_OF_TERM = '2020-05-14';
const START_OF_TERM = '2017-05-14';

const MAILCHIMP_ACTION = 'https://en-marche.us16.list-manage.com/subscribe/post?u=55827081e9c72c969a6fa0ea5&amp;id=ee94a72c73';
const FORM_PROPS = {
  messages: {
    inputPlaceholder: 'Enter your email',
    btnLabel: 'Sign Up',
    sending: 'Sending...',
  },
  action: MAILCHIMP_ACTION
};


const DashboardRow = ({ children }) =>
  <div className="dashboard-row">
    {children}
  </div>
  
const DashboardBox = ({ children, className }) =>
  <div className={`dashboard-box ${className || ''}`}>
    {children}
  </div>

const DashboardHeader = ({ locale }) =>
  <div className="dashboard-header">
    <div className="dashboard-blurb">
      <h2>Il l’a dit, il le fait</h2>
      <p>
        Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation.
      </p>
      
      <Link className="dashboard-header__link" to={`/${locale}/results`}>Voir les mesures en détail</Link>
    </div>
    <div className="dashboard-image">
      <img src={macron} alt="Macron" />
    </div>
  </div>

const DashboardBody = ({ children }) =>
  <div className="dashboard-body">
    {children}
  </div>

const DashboardTimer = ({ total, current }) =>
  <div className="dashboard-timer">
    <ProgressMeter reverse total={total} current={current} className="timeline">
      {current} jours restant au mandat
    </ProgressMeter>
  </div>

const Progressions = ({ measures, total }) =>
  <div className="dashboard-progressions">
    <ProgressMeter total={total} current={measures['IS_LAW']} className="fait">
      <span>{measures['IS_LAW']}</span> faites
    </ProgressMeter>
    <ProgressMeter total={total} current={measures['VOTED']} className="en-cours">
      <span>{measures['VOTED']}</span> en cours
    </ProgressMeter>
    <ProgressMeter total={total} current={measures['IN_PROGRESS']} className="venir">
      <span>{measures['IN_PROGRESS']}</span> à venir
    </ProgressMeter>
  </div>

class Dashboard extends Component {
  state = {
    totalDaysInTerm: moment(END_OF_TERM).diff(moment(START_OF_TERM), 'days'),
    daysRemainingInTerm: moment(END_OF_TERM).diff(moment(), 'days')
  }
  
  constructor(props) {
    super(props);
    props.getVotes();
  }
  
  render() {
    let { allMeasures, popular, status, locale } = this.props;
    let measures = compact(popular.map(({ itemId }) => allMeasures.measures[itemId]));
    
    return (
      <div className="dashboard">
        <DashboardHeader locale={locale} />
        
        <DashboardBody>
          <DashboardTimer total={this.state.totalDaysInTerm} current={this.state.daysRemainingInTerm} />
          <DashboardRow>
            <DashboardBox className="dashboard-progression">
              <h3 className="dashboard-box__title">La progression</h3>
              <LastUpdated className="dashboard-updated" />
              
              {!!Object.keys(status.measures).length &&
                <Progressions measures={status.measures} total={status.total} />}
            </DashboardBox>
            <DashboardBox className="dashboard-popular">
              <h3 className="dashboard-box__title">Les 5 mesures les plus attendues</h3>
              {!!allMeasures.items.length &&
                <Measures className="popular-measures" measures={measures} />}
            </DashboardBox>
          </DashboardRow>
          
          <DashboardRow>
            <DashboardBox>
              <h3 className="dashboard-box__title">Retrouvez le programme</h3>
              <p>
                Ce projet a été construit en 2016-2017 avec plus de 30 000 Françaises et Français de tous milieux sociaux, de tous âges, dans tous les territoires de France, au cours de 3 000 ateliers de nos comités locaux. <a href="https://en-march.fr" rel="noopener noreferrer" target="_blank">Le programme →</a>
              </p>
            </DashboardBox>
            <DashboardBox>
              <h3 className="dashboard-box__title">Pour ne rien manquer, inscrivez-vous à notre newsletter hebdomadaire :</h3>
              <Subscribe {...FORM_PROPS} />
            </DashboardBox>
          </DashboardRow>
        </DashboardBody>
        
        <AuthModal isOpen={this.props.openModal} closeModal={this.props.closeAuth} />
      </div>
    )
  }
  
}

export default connect(state => ({
  popular: state.popular.items,
  status: state.status,
  allMeasures: state.measures,
  locale: state.locale,
  openModal: state.auth.openModal
}), dispatch => ({
  getVotes: () => dispatch(getVoteCount()),
  closeAuth: () => dispatch(closeAuth()),
}))(Dashboard);
