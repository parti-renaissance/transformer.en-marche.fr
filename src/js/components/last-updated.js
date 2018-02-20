import React, { Component } from 'react';
import { map, compact } from 'lodash';
import moment from 'moment-timezone';
import { connect } from 'react-redux';
import T from 'i18n-react';

class LastUpdated extends Component {
  shouldComponentUpdate({measures:nextMeasures, locale:nextLocale}) {
    let { measures, locale } = this.props;
    return nextMeasures.items.length !== measures.items.length || nextLocale !== locale;
  }

  render() {
    let { measures: { measures }, className, locale } = this.props;
    let dates = map(measures, 'formattedUpdatedAt');
    compact(dates).sort().reverse();
    let diff = moment().diff(dates[0], 'days');
    let unit = 'day';
    if (diff < 1) {
      diff = moment().diff(dates[0], 'hours');
      unit = 'hour';
    }
    return <small className={className}>{T.translate(`lastUpdated.${unit}.${locale}`, {context: diff})}</small>
  }

}

export default connect(state => ({measures: state.measures}))(LastUpdated);
