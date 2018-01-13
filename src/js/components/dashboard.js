import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import { Link } from 'react-router-dom';
import compact from 'lodash/compact';
import { RadialChart } from 'react-vis';
import countBy from 'lodash/countBy';
import filter from 'lodash/filter';

import { getVoteCount } from '../actions/vote-actions';
import { openAbout } from '../actions/about-actions';
import { Measures } from './measure';
import LastUpdated from './last-updated';
import ProgressMeter from './progress-meter';
import Subscribe from './subscribe';
import ToggleSwitch from './toggle-switch';

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

const DashboardHeader = ({ locale, openAbout }) =>
  <div className="dashboard-header">
    <div className="dashboard-blurb">
      <h2>On l&apos;a dit, on le fait</h2>
      <p>
        La transformation du pays est en marche ! Suivez l&apos;application du programme d&apos;Emmanuel Macron et <strong>votez en faveur des mesures qui vous tiennent à cœur</strong>. <button onClick={openAbout} className="dashboard-blurb__link">En savoir plus.</button>
      </p>

      <Link className="dashboard-header__link" to={`/${locale}/results`}>Découvrir ce qui me concerne</Link>
    </div>
    <div className="dashboard-image">
      <Link to={`/${locale}/results`}>
        <img src={macron} width="400" height="543" alt="Macron" />
      </Link>
    </div>
  </div>

const DashboardBody = ({ children }) =>
  <div className="dashboard-body">
    {children}
  </div>

const DashboardTimer = ({ total, current }) =>
  <div className="dashboard-timer">
    <ProgressMeter reverse total={total} current={current} className="timeline">
      Encore {current} jours pour transformer la France.
    </ProgressMeter>
  </div>

const PieChartLegend = ({ children, color }) =>
  <div className="pie-chart__legend-item">
    <div className="pie-chart__legend-circle" style={{color}}></div>
    {children}
  </div>

class PieChart extends Component {
  state = {
    value: false,
    majorOnly: true
  }

  render() {
    let { measures } = this.props;
    let { majorOnly } = this.state;
    if (majorOnly) {
      measures = filter(measures, 'major');
    }
    measures = countBy(measures, 'status');
    return (
      <div className="pie-chart">
        <RadialChart
          animation
          className='pie-chart__chart'
          innerRadius={40}
          radius={64}
          data={[
            {angle: measures['DONE'], label: 'Fait', style: {fill: '#2bca9e', stroke: 'none'}},
            {angle: measures['IN_PROGRESS'], label: 'En cours', style: {fill: '#00bef9', stroke: 'none'}},
            {angle: measures['UPCOMING'], label: 'À venir', style: {fill: '#dedede', stroke: 'none'}},
          ]}
          width={132}
          height={132} />

        <div className="pie-chart__legend">
          <PieChartLegend color={'#2bca9e'}>
            <span className="pie-chart__legend-label">Faites</span>
            {measures['DONE']} mesures
          </PieChartLegend>
          <PieChartLegend color={'#00bef9'}>
            <span className="pie-chart__legend-label">En cours</span>
            {measures['IN_PROGRESS']} mesures
          </PieChartLegend>
          <PieChartLegend color={'#dedede'}>
            <span className="pie-chart__legend-label">À venir</span>
            {measures['UPCOMING']} mesures
          </PieChartLegend>
        </div>
        
        <div className="pie-chart__footer">
          <ToggleSwitch onChange={() => this.setState({ majorOnly: !majorOnly })}>
            Voir seulement les principaux engagements :
          </ToggleSwitch>
        </div>

      </div>
    )
  }
}


class Dashboard extends Component {
  state = {
    totalDaysInTerm: moment(END_OF_TERM).diff(moment(START_OF_TERM), 'days'),
    daysRemainingInTerm: moment(END_OF_TERM).diff(moment(), 'days'),
  }

  constructor(props) {
    super(props);
    props.getVotes();
  }

  render() {
    let { allMeasures, popular, status, locale, openAbout } = this.props;
    let measures = compact(popular.map(({ itemId }) => allMeasures.measures[itemId]));

    return (
      <div className="dashboard">
        <DashboardHeader
          locale={locale}
          openAbout={openAbout}
        />

        <DashboardBody>
          <DashboardTimer total={this.state.totalDaysInTerm} current={this.state.daysRemainingInTerm} />
          <DashboardRow>
            <DashboardBox className="dashboard-progression">
              <div className="dashboard-progression__link">
                <h3 className="dashboard-box__title">Mise en œuvre du Contrat avec la Nation</h3>
                <LastUpdated className="dashboard-updated" />

                <PieChart measures={status.measures} />
              </div>
            </DashboardBox>
            <DashboardBox className="dashboard-popular">
              <h3 className="dashboard-box__title">Les 3 mesures les plus importantes pour vous</h3>
              {!!allMeasures.items.length &&
                <Measures className="popular-measures" measures={measures} viewAll />}
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
  openAbout: state.openAbout
}), dispatch => ({
  getVotes: () => dispatch(getVoteCount()),
  openAbout: () => dispatch(openAbout()),
}))(Dashboard);
