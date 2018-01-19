import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import { Link } from 'react-router-dom';
import compact from 'lodash/compact';
import { RadialChart } from 'react-vis';
import countBy from 'lodash/countBy';
import filter from 'lodash/filter';
import { withRouter } from 'react-router';
import T from 'i18n-react';

import { setLocale } from '../actions/translate-actions';
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
      <h2>{T.translate('projet.title', {context: locale})}</h2>
      <p>
        {T.translate('dashboard.blurb', {context: locale})} <strong>{T.translate('dashboard.blurbBold', {context: locale})}</strong>. <button onClick={openAbout} className="dashboard-blurb__link">{T.translate('dashboard.blurbLink', {context: locale})}</button>
      </p>

      <Link className="dashboard-header__link" to={`/${locale}/results`}>{T.translate('dashboard.blurbCta', {context: locale})}</Link>
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

const DashboardTimer = ({ total, current, locale }) =>
  <div className="dashboard-timer">
    <ProgressMeter reverse total={total} current={current} locale={locale} className="timeline">
      {T.translate('dashboard.countDownOne', {context: locale})} {current} {T.translate('dashboard.countDownTwo', {context: locale})}
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
    let { measures, locale } = this.props;
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
            <span className="pie-chart__legend-label">{T.translate('dashboard.measureDone', {context: locale})}</span>
            {measures['DONE']} {T.translate('dashboard.measure', {context: locale})}s
          </PieChartLegend>
          <PieChartLegend color={'#00bef9'}>
            <span className="pie-chart__legend-label">{T.translate('dashboard.measureInProgress', {context: locale})}</span>
            {measures['IN_PROGRESS']} {T.translate('dashboard.measure', {context: locale})}s
          </PieChartLegend>
          <PieChartLegend color={'#dedede'}>
            <span className="pie-chart__legend-label">{T.translate('dashboard.measureUpcoming', {context: locale})}</span>
            {measures['UPCOMING']} {T.translate('dashboard.measure', {context: locale})}s
          </PieChartLegend>
        </div>

        <div className="pie-chart__footer">
          <ToggleSwitch onChange={() => this.setState({ majorOnly: !majorOnly })}>
            {T.translate('dashboard.majorText', {context: locale})}
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

  componentWillReceiveProps(nextProps) {
    let { setLocale, locale, location, match: { params } } = this.props;
    // if locale from state does not match locale from url
    // use locale from state
    if (locale !== params.locale) {
      setLocale(locale, location, true);
    }
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
          <DashboardTimer total={this.state.totalDaysInTerm} current={this.state.daysRemainingInTerm} locale={locale} />
          <DashboardRow>
            <DashboardBox className="dashboard-progression">
              <h3 className="dashboard-box__title">{T.translate('dashboard.titleChart', {context: locale})}</h3>
              <LastUpdated className="dashboard-updated" />

              <PieChart measures={status.measures} locale={locale} />
            </DashboardBox>
            <DashboardBox className="dashboard-popular">
              <h3 className="dashboard-box__title">{T.translate('dashboard.titlePopular', {context: locale})}</h3>
              {!!allMeasures.items.length &&
                <Measures className="popular-measures" measures={measures} viewAll />}
              <div className="dashboard-box__cta">
                <Link to={`/${locale}/results`}>{T.translate('dashboard.linkPopular', {context: locale})} →</Link>
              </div>
            </DashboardBox>
          </DashboardRow>

          <DashboardRow>
            <DashboardBox>
              <h3 className="dashboard-box__title dashboard-box__title--small">{T.translate('dashboard.titlePlatform', {context: locale})}</h3>
              <p>
                {T.translate('dashboard.blurbPlatform', {context: locale})} <a href="https://en-marche.fr/programme" rel="noopener noreferrer" target="_blank">{T.translate('dashboard.linkPlatform', {context: locale})} →</a>
              </p>
            </DashboardBox>
            <DashboardBox>
              <h3 className="dashboard-box__title dashboard-box__title--small">{T.translate('dashboard.titleNewsletter', {context: locale})}</h3>
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
  setLocale: (...args) => dispatch(setLocale(...args)),
}))(withRouter(Dashboard));
