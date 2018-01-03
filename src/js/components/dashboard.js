import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import { Link } from 'react-router-dom';
import compact from 'lodash/compact';

import { getVoteCount } from '../actions/vote-actions';
import { Measures } from './measure';
import LastUpdated from './last-updated';
import ProgressMeter from './progress-meter';
import Subscribe from './subscribe';

import '../../scss/dashboard.css';
import macron from '../../images/cover-program.png';

const END_OF_TERM = '2022-05-13';
const START_OF_TERM = '2017-05-14';

const MAILCHIMP_ACTION = process.env.REACT_APP_MAILCHIMP_ACTION;
const FORM_PROPS = {
  messages: {
    inputPlaceholder: 'Entrez votre e-mail',
    btnLabel: 'S\'inscrire',
    sending: 'En cours...',
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
      <h2>On le dit, on le fait</h2>
      <p>
        La transformation du pays est en marche ! Suivez l'application du programme d'Emmanuel Macron et <strong>votez en faveur des mesures que vous attendez le plus</strong>.
      </p>

      <Link className="dashboard-header__link" to={`/${locale}/results`}>Découvrir ce qui me concerne</Link>
    </div>
    <div className="dashboard-image">
      <img src={macron} width="280" height="381" alt="Macron" />
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
    <ProgressMeter total={total} current={measures['DONE']} className="fait">
      <span>{measures['DONE']}</span> faites
    </ProgressMeter>
    <ProgressMeter total={total} current={measures['IN_PROGRESS']} className="en-cours">
      <span>{measures['IN_PROGRESS']}</span> en cours
    </ProgressMeter>
    <div className="progress a-venir">
      Et ce n'est qu'un debut ! Encore <strong>{measures['UPCOMING']}</strong> à venir.
    </div>
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
              <h3 className="dashboard-box__title">Progression des mesures majeures</h3>
              <LastUpdated className="dashboard-updated" />

              {!!Object.keys(status.measures).length &&
                <Progressions measures={status.measures} total={status.total} />}
            </DashboardBox>
            <DashboardBox className="dashboard-popular">
              <h3 className="dashboard-box__title">Les 5 mesures les plus attendues</h3>
              {!!allMeasures.items.length &&
                <Measures className="popular-measures" measures={measures} />}
              <div className="dashboard-box__cta">
                <Link to={`/${locale}/results`}>Toutes les mesures →</Link>
              </div>
            </DashboardBox>
          </DashboardRow>

          <DashboardRow>
            <DashboardBox>
              <h3 className="dashboard-box__title dashboard-box__title--small">Demandez le programme</h3>
              <p>
                Ce projet a été construit en 2016-2017 avec plus de 30 000 Françaises et Français de tous milieux sociaux, de tous âges, dans tous les territoires de France, au cours de 3 000 ateliers de nos comités locaux. <a href="https://en-marche.fr/programme" rel="noopener noreferrer" target="_blank">Le programme →</a>
              </p>
            </DashboardBox>
            <DashboardBox>
              <h3 className="dashboard-box__title dashboard-box__title--small">Pour être les premiers informés, inscrivez-vous à la newsletter hebdomadaire du mouvement :</h3>
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
  status: state.status,
  allMeasures: state.measures,
  locale: state.locale,
}), dispatch => ({
  getVotes: () => dispatch(getVoteCount()),
}))(Dashboard);
