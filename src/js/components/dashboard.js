import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import { Link } from 'react-router-dom';
import compact from 'lodash/compact';

import { popularMeasures, progression } from '../actions/dashboard-actions';
import { Measures } from './measure';
import LastUpdated from './last-updated';
import ProgressMeter from './progress-meter';
import Subscribe from './subscribe';

import '../../scss/dashboard.css';
import macron from '../../images/macron.jpg';
// import macron2x from '../../images/macron@2x.jpg';
// import macron3x from '../../images/macron@3x.jpg';

const END_OF_TERM = '2020-05-14';
const START_OF_TERM = '2017-05-14';

const MAILCHIMP_ACTION = '';
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
    <ProgressMeter reverse total={total} current={current} colors={{bg: '#e0e0e0', fill: '#7181ff'}}>
      {current} jours restant au mandat
    </ProgressMeter>
  </div>

const Progressions = ({ measures }) =>
  <div className="dashboard-progressions">
    <ProgressMeter total={measures['fait'].total} current={measures['fait'].current} colors={{fill: '#50a384'}} >
      <span>{measures['fait'].current}</span> faites
    </ProgressMeter>
    <ProgressMeter total={measures['en cours'].total} current={measures['en cours'].current} colors={{fill: '#d35d4a'}}>
      <span>{measures['en cours'].current}</span> en cours
    </ProgressMeter>
    <ProgressMeter total={measures['a venir'].total} current={measures['a venir'].current} colors={{fill: '#5b7588'}}>
      <span>{measures['a venir'].current}</span> à venir
    </ProgressMeter>
  </div>

class Dashboard extends Component {
  constructor(props) {
    super(props);
    props.getPopular();
    props.getProgress();
  }
  
  render() {
    let { allMeasures, popular, progress, locale } = this.props;
    let measures = compact(popular.map(({ itemId }) => allMeasures.measures[itemId]));
  
    let totalDaysInTerm = moment(END_OF_TERM).diff(moment(START_OF_TERM), 'days');
    let daysRemainingInTerm = moment(END_OF_TERM).diff(moment(), 'days');
    
    return (
      <div className="dashboard">
        <DashboardHeader locale={locale} />
        
        <DashboardBody>
          <DashboardTimer total={totalDaysInTerm} current={daysRemainingInTerm} />
          <DashboardRow>
            <DashboardBox className="dashboard-progression">
              <h3 className="dashboard-box__title">La progression</h3>
              <LastUpdated className="dashboard-updated" />
              
              {!!Object.keys(progress.measures).length &&
              <Progressions measures={progress.measures} />}
            </DashboardBox>
            <DashboardBox className="dashboard-popular">
              <h3 className="dashboard-box__title">Les 5 mesures les plus attendues</h3>
              <Measures className="popular-measures" measures={measures} />
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
      </div>
    )
  }
  
}

export default connect(state => ({
  popular: state.popular.items,
  progress: state.progress,
  allMeasures: state.measures,
  locale: state.locale
}), dispatch => ({
  getPopular: () => dispatch(popularMeasures()),
  getProgress: () => dispatch(progression())
}))(Dashboard);
