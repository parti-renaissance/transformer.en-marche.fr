import React, { Component } from 'react';
import Collapsible from 'react-collapsible';
import { connect } from 'react-redux';
import { ChevronDown, ChevronUp } from 'react-feather';
import { ShareButtons, generateShareIcon } from 'react-share';

import '../../scss/measure.css';
import VoteButton from './vote-button';
import { voteUp, voteDown } from '../actions/vote-actions';

const { FacebookShareButton, TwitterShareButton } = ShareButtons;
const FacebookIcon = generateShareIcon('facebook');
const TwitterIcon = generateShareIcon('twitter');

const STATUS_MAP = {
  UPCOMING: 'À venir',
  DONE: 'Fait',
  IN_PROGRESS: 'En cours',
  DEFERRED: 'Modifié',
}

// eslint-disable-next-line
const slugify = str => str.toLowerCase().replace(/[\s_]/g, '-');

const shareCopy = measure => `Je soutiens la mesure "${measure}" sur https://transformer-la-france.fr`;

const ShareMeasure = ({measure}) => {
  if (!measure.link) {
    return null;
  } else {
    return (
      <div className="share-measure">
        <FacebookShareButton url={measure.link} quote={shareCopy(measure.title)}>
          <FacebookIcon round={true} size={40} iconBgStyle={{fill: '#6f81ff'}}/>
        </FacebookShareButton>
        <TwitterShareButton url={measure.link} title={shareCopy(measure.title)}>
          <TwitterIcon round={true} size={40} iconBgStyle={{fill: '#6f81ff'}}/>
        </TwitterShareButton>
      </div>
    );
  }
}

const LinkOrDiv = ({ link, className, children }) => {
  if (link) {
    return (
      <a
       href={link}
       target="_blank"
       rel="noreferrer noopener"
       className={className}>
       {children}
      </a>
    );
  } else {
    return (
      <div className={className}>
        {children}
      </div>
    );
  }
}

export class Measure extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: props.measure.count,
    };
  }

  componentWillReceiveProps({ active:nextActive }) {
    if (nextActive !== this.state.isActive) {
      this.setState({ isActive: nextActive });
    }
  }

  voteFulfilled(direction, action) {
    let { count = 0 } = this.state;
    if (!!action) { // success
      this.setState({
        count: direction === 'up' ? count + 1 : count - 1,
        isActive: direction === 'up',
        pending: false
      });
    } else {
      this.setState({ pending: false });
    }
  }

  vote(id, token, direction) {
    let { voteUp, voteDown } = this.props;
    this.setState({ pending: true });

    let promise;
    if (direction === 'up') {
      promise = voteUp(id, token);
    } else {
      promise = voteDown(id, token);
    }
    promise.then(this.voteFulfilled.bind(this, direction));
  }

  render() {
    let { measure, token } = this.props;
    let { isActive } = this.state;
    return (
      <div className="measure-wrapper">
        <LinkOrDiv
         link={measure.link}
         className={`measure-body ${slugify(measure.status)} is-major`}>
          <div className="measure-status">
            {STATUS_MAP[measure.status]}
          </div>
          <div className="measure-name">
            {measure.title}
          </div>
        </LinkOrDiv>

        { this.state.pending
          ?
            <div className="measure-pending" />
          :
          <div className="measure-vote">
            <span>{this.state.count}</span>
            <VoteButton
              classNames='is-major'
              isActive={typeof isActive === 'undefined' ?  measure.isActive : isActive}
              voteDown={this.vote.bind(this, measure.id, token, 'down')}
              voteUp={this.vote.bind(this, measure.id, token, 'up')}
            />
          </div>
        }

        <ShareMeasure measure={measure} />
      </div>

    );
  }
}


const Trigger = ({ count, nodeRef }) =>
  <span ref={nodeRef}>
    <ChevronUp className="up" /><ChevronDown className="down" /><span className="up">Moins</span><span className="down">Plus</span>&nbsp;de mesures<span className="down">&nbsp;({count})</span>
  </span>

class CollapsibleMeasures extends Component {
  onOpen() {
    this.trigger.parentElement.parentElement.classList.add('to-bottom');
  }

  onClose() {
    setTimeout(() => {
      this.trigger.parentElement.parentElement.classList.remove('to-bottom');
    }, 400);
  }

  render() {
    let { measures } = this.props;
    return (
      <Collapsible
       onOpening={this.onOpen.bind(this)}
       onClosing={this.onClose.bind(this)}
       trigger={<Trigger nodeRef={e => this.trigger = e} count={measures.length - 3} />}
       classParentString="measure-accordion"
       triggerClassName="measure-accordion__trigger"
       lazyRender={true}
       >
        {measures.slice(3).map(measure => <Measure key={measure.id} measure={measure} {...this.props} />)}
      </Collapsible>
    );
  }
}

export const NoMeasure = ({theme}) =>
  <p className="no-measure">Il n'y a pas de mesures répondant à cette combinaison de filtres.</p>

class Measures extends Component {

  render() {
    let { measures, viewAll } = this.props;
    if (viewAll) {
      return (
        <div className="measure-list">
          {measures.map(measure => <Measure key={measure.id} measure={measure} {...this.props} />)}
        </div>
      );
    } else {
      return (
        <div className="measure-list">
          {measures.slice(0,3).map(measure => <Measure key={measure.id} measure={measure} {...this.props} />)}
          {measures.length > 3 ? <CollapsibleMeasures measures={measures} {...this.props} /> : null}
        </div>
      );
    }
  }
}

Measures = connect(state => ({
  token: state.auth.token
}), dispatch => ({
  voteUp: (...args) => dispatch(voteUp(...args)),
  voteDown: (...args) => dispatch(voteDown(...args))
}))(Measures);

export { Measures };
