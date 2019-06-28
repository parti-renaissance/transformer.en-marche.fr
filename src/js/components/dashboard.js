import React, {Component} from 'react';
import {connect} from 'react-redux';
import moment from 'moment-timezone';
import {Link} from 'react-router-dom';
import compact from 'lodash/compact';
import {RadialChart} from 'react-vis';
import countBy from 'lodash/countBy';
import filter from 'lodash/filter';
import {withRouter} from 'react-router';
import T from 'i18n-react';


import {setLocale} from '../actions/translate-actions';
import {getVoteCount} from '../actions/vote-actions';
import {openAbout} from '../actions/about-actions';
import {Measures} from './measure';
import LastUpdated from './last-updated';
import ProgressMeter from './progress-meter';
import Subscribe from './subscribe';
import ToggleSwitch from './toggle-switch';

import '../../scss/dashboard.css';
import macron from '../../images/cover-program.png';

const rootPath = process.env.REACT_APP_ROOT_PATH || ''; // for access assets when running on a nested path, i.e. github 
const END_OF_TERM = '2022-05-13';
const START_OF_TERM = '2017-05-14';

const MAILCHIMP_ACTION = process.env.REACT_APP_MAILCHIMP_ACTION;
const FORM_PROPS = {
  messages: {
    inputPlaceholder: {
      fr: 'Entrez votre e-mail',
      en: 'Enter your e-mail'
    },
    btnLabel: {
      fr: 'S\'inscrire',
      en: 'Subscribe'
    },
    sending: {
      fr: 'En cours...',
      en: 'Sending...'
    },
    missingEmail: {
      fr: 'Entrez votre e-mail ci-dessus !',
      en: 'Enter your e-mail address!'
    },
    invalidEmail: {
      fr: 'Votre e-mail doit être valide.',
      en: 'Your email is not valid.'
    }
  },
  action: MAILCHIMP_ACTION
};


const DashboardRow = ({children}) =>
  <div className="dashboard-row">
    {children}
  </div>

const DashboardBox = ({children, className}) =>
  <div className={`dashboard-box ${ className || '' }`}>
    {children}
  </div>



const DashboardHeader = ({locale, openAbout}) =>
  <div className="dashboard-header">
    <div className="dashboard-image">
      <Link to={`/${ locale }/results`}>
        <img src={macron} alt="Macron" />
      </Link>
    </div>
  </div>

const DashboardBody = ({children}) =>
  <div className="dashboard-body">
    {children}
  </div>

const DashboardTimer = ({total, current, locale}) =>
  <div className="dashboard-timer">
    <ProgressMeter reverse total={total} current={current} locale={locale} className="timeline">
      <div>
      { T.translate( 'dashboard.countDownOne', { context: locale })}
      <Link to={ `${ locale }/results` }>
        { T.translate( 'dashboard.countDownTwo', { context: locale })}
      </Link>
      { T.translate( 'dashboard.countDownThree', { context: locale })}
      </div>
     
      <div>
        <span>{current}jours</span><span> restants</span>
      </div>
    </ProgressMeter>
  </div>

const PieChartLegend = ({children, color}) =>
  <div className="pie-chart__legend-item">
    <div className="pie-chart__legend-circle" style={{color}}></div>
    {children}
  </div>

class PieChart extends Component {
  state = {
    value: false,
    majorOnly: true
  }

  generateData(measures, locale) {
    return [ {
      angle: measures[ 'DONE' ],
      label: T.translate('measures.statuses', {context: `${ locale }.DONE`}),
      style: {fill: '#2bca9e', stroke: 'none'},
    }, {
      angle: measures[ 'IN_PROGRESS' ],
      label: T.translate('measures.statuses', {context: `${ locale }.IN_PROGRESS`}),
      style: {fill: '#00bef9', stroke: 'none'},
    }, {
      angle: measures[ 'UPCOMING' ],
      label: T.translate('measures.stauses', {context: `${ locale }.UPCOMING`}),
      style: {fill: '#dedede', stroke: 'none'},
    } ]
  }

  render() {
    let {measures, locale} = this.props;
    let {majorOnly} = this.state;
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
          data={this.generateData(measures, locale)}
          width={132}
          height={132} />

        <div className="pie-chart__legend">
          <PieChartLegend color={'#2bca9e'}>
            <span className="pie-chart__legend-label">{T.translate('dashboard.measureDone', {context: locale})}</span>
            {measures[ 'DONE'] }{ T.translate( 'dashboard.measure',{ context: locale}) }s
          </PieChartLegend>
          <PieChartLegend color={'#00bef9'}>
            <span className="pie-chart__legend-label">{T.translate('dashboard.measureInProgress', {context: locale})}</span>
            {measures[ 'IN_PROGRESS'] }{ T.translate( 'dashboard.measure',{ context: locale}) }s
          </PieChartLegend>
          <PieChartLegend color={'#dedede'}>
            <span className="pie-chart__legend-label">{T.translate('dashboard.measureUpcoming', {context: locale})}</span>
            {measures[ 'UPCOMING'] }{ T.translate( 'dashboard.measure',{ context: locale}) }s
          </PieChartLegend>
        </div>

        <div className="pie-chart__footer">
          <ToggleSwitch initialChecked={true} onChange={() => this.setState({majorOnly: !majorOnly})}>
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

  constructor (props) {
    super(props);
    props.getVotes();
  }


  componentWillReceiveProps(nextProps) {
    let {setLocale, locale, location, match: {params}} = this.props;
    // if locale from state does not match locale from url
    // use locale from state
    if (locale !== params.locale) {
      setLocale(locale, location, true);
    }
  }

  render() {
    let {allMeasures, popular, status, locale, openAbout} = this.props;
    let measures = compact(popular.map(({itemId}) => allMeasures.measures[ itemId]) );

    return (
      <div className="dashboard">
        <DashboardRow>
          <DashboardHeader
            locale={locale}
            openAbout={openAbout}
          />
        </DashboardRow>


        <DashboardRow>
          <DashboardBody>
            <DashboardRow>
              <DashboardTimer total={this.state.totalDaysInTerm} current={this.state.daysRemainingInTerm} locale={locale} />

              <DashboardBox className="dashboard-progression">
                <h3 className="dashboard-box__title">{T.translate('dashboard.titleChart', {context: locale})}</h3>
                <LastUpdated className="dashboard-updated" locale={locale} />

                <PieChart measures={status.measures} locale={locale} />
              </DashboardBox>
              <DashboardBox className="dashboard-popular">
                <h3 className="dashboard-box__title">{T.translate('dashboard.titlePopular', {context: locale})}</h3>
                {!!allMeasures.items.length &&
                  <Measures className="popular-measures" measures={measures} viewAll />}
                <div className="dashboard-box__cta">
                  <Link to={`/${ locale }/results`}>{T.translate('dashboard.linkPopular', {context: locale})} →</Link>
                </div>
              </DashboardBox>
            </DashboardRow>

            <DashboardRow>
              <DashboardBox className="dashboard-em">
              <div>
              <img src={`${rootPath}/assets/svg/icn_prgm_em.svg`} alt="bilan" />
              </div>
              <div>
              <h3 className="dashboard-box__title dashboard-box__title--small">{ T.translate( 'dashboard.titlePlatform', { context: locale } )}</h3>
                <p>
                  { T.translate( 'dashboard.blurbPlatform', { context: locale })}
                  <a href="https://en-marche.fr/emmanuel-macron/le-programme" className="dashboard-box__link" rel="noopener noreferrer" target="_blank">{ T.translate( 'dashboard.linkPlatform', { context: locale })}→</a>
                </p>
              </div>
              </DashboardBox>
              <DashboardBox className="dashboard-renaissance">
              <div>
                <img src={ `${rootPath}/assets/svg/icn_prgm_renaissance.svg` }alt="bilan" />
              </div>
              <div>
              <h3 className="dashboard-box__title dashboard-box__title--small">{ T.translate( 'dashboard.titleEuropeanProject', { context: locale } )}</h3>
                <p>
                  { T.translate( 'dashboard.blurbEuropeanProject', { context: locale })}
                  <a href="https://storage.googleapis.com/en-marche-fr/pole_idees/Programme%20Renaissance%20E%CC%81lections%20europe%CC%81ennes.pdf" className="dashboard-box__link" rel="noopener noreferrer" target="_blank">{ T.translate( 'dashboard.europeanProjectLink', { context: locale })}→</a>
                </p>
              </div>
                
              </DashboardBox>
            </DashboardRow>

            <DashboardBox className="dashboard-appraisal">
              <div>
                <h2>Bilan des 2 ans du quinquennat</h2>
                <p>Consultez les différentes actions qui ont été réalisées depuis 2 ans<br /> dans votre commune et ses environs.</p>
                <a href="https://en-marche.fr/programme" className="dashboard-box__link" rel="noopener noreferrer" target="_blank">Ce qui a changé près de chez vous→</a>
              </div>
              <div>
                <img src={`${ rootPath }/assets/svg/illu_two-years_city.svg`} alt="bilan" />
              </div>
            </DashboardBox>
            <DashboardBox className="dashboard-email">
              <h3 className="dashboard-box__title dashboard-box__title--small">{T.translate('dashboard.titleNewsletter', {context: locale})}</h3>
              <Subscribe locale={locale} {...FORM_PROPS} />
            </DashboardBox>

          </DashboardBody>
        </DashboardRow>

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
