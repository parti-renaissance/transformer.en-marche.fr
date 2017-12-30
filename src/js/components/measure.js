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
  IN_PROGRESS: 'En cours'
}

const slugify = str => str.toLowerCase().replace(/[\s_]/g, '-');

const shareCopy = measure => `Je soutiens la mesure "${measure}" sur https://transformerlafrance.fr`;

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

export const Measure = ({measure, voteUp, voteDown, token}) =>
  <div className="measure-wrapper">
    <LinkOrDiv link={measure.link} className={`measure-body ${slugify(measure.status)}`}>
      <div className="measure-status">
        {STATUS_MAP[measure.status]}
      </div>
      <div className="measure-name">
        {measure.title}
      </div>
    </LinkOrDiv>
    
    <div className="measure-vote">
      <span>{measure.count || 0}</span>
      <VoteButton
        isActive={measure.isActive}
        voteDown={() => voteDown(measure.id, token)}
        voteUp={() => voteUp(measure.id, token)}
      />
    </div>
  
    <ShareMeasure measure={measure} />
  </div>

  
const Trigger = ({ count, nodeRef }) =>
  <span ref={nodeRef}>
    <ChevronUp className="up" /><ChevronDown className="down" />Plus de mesures ({count})
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
       trigger={<Trigger nodeRef={e => this.trigger = e} count={measures.length - 6} />}
       classParentString="measure-accordion"
       triggerClassName="measure-accordion__trigger"
       >
        {measures.slice(6).map((measure, i) => <Measure key={i} measure={measure} />)}
      </Collapsible>
    );
  }
}
  
export const NoMeasure = ({theme}) =>
  <p className="no-measure">Il n&apos;y a pas de réformes specifiques au profil de {theme}. Voir toutes les réformes sur le thème {theme}.</p>

let Measures = ({ measures, ...props }) =>
  <div className="measure-list">
    {measures.slice(0,3).map((measure, i) => <Measure key={i} measure={measure} {...props} />)}
    {measures.length > 3 ? <CollapsibleMeasures measures={measures} {...props} /> : null}
  </div>

Measures = connect(state => ({
  token: state.auth.token
}), dispatch => ({
  voteUp: (...args) => dispatch(voteUp(...args)),
  voteDown: (...args) => dispatch(voteDown(...args))
}))(Measures);

export { Measures };
