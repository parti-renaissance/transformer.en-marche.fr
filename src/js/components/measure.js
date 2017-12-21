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
  IN_PROGRESS: 'À venir',
  IS_LAW: 'Fait',
  VOTED: 'En cours'
}

const slugify = str => str.toLowerCase().replace(/\s/g, '-');

const ShareMeasure = ({measure}) => {
  if (!measure.link) {
    return null;
  } else {
    return (
      <div className="share-measure">
        <FacebookShareButton url={measure.link} quote={measure.socialMediaCopy}>
          <FacebookIcon round={true} size={40} iconBgStyle={{fill: '#6f81ff'}}/>
        </FacebookShareButton>
        <TwitterShareButton url={measure.link} title={measure.socialMediaCopy}>
          <TwitterIcon round={true} size={40} iconBgStyle={{fill: '#6f81ff'}}/>
        </TwitterShareButton>
      </div>
    );
  }
}

const LinkOrDiv = ({ measure, children }) => {
  if (measure.link) {
    return (
      <a
       href={measure.link}
       target="_blank"
       rel="noreferrer noopener"
       className={`measure ${slugify(STATUS_MAP[measure.status])}`}>
       {children}
      </a>
    );
  } else {
    return (
      <div className={`measure ${slugify(STATUS_MAP[measure.status])}`}>
        {children}
      </div>
    );
  }
}

export const Measure = ({measure, voteUp, voteDown, token}) =>
  <LinkOrDiv measure={measure}>
    <div className="measure-body">
      <div className="measure-status">
        {STATUS_MAP[measure.status]}
      </div>
      <div className="measure-name">
        {measure.title}
      </div>
      
      <div className="measure-vote">
        <span>{measure.count}</span>
        <VoteButton
          isActive={measure.isActive}
          voteDown={() => voteDown(measure.objectID, token)}
          voteUp={() => voteUp(measure.objectID, token)}
        />
      </div>
    </div>
    
    <ShareMeasure measure={measure} />
  </LinkOrDiv>

  
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

export const Measures = connect(state => ({
  token: state.auth.token
}), dispatch => ({
  voteUp: (...args) => dispatch(voteUp(...args)),
  voteDown: (...args) => dispatch(voteDown(...args))
}))(({ measures, ...props }) =>
  <div className="measure-list">
    {measures.slice(0,5).map((measure, i) => <Measure key={i} measure={measure} {...props} />)}
    {measures.length > 6 ? <CollapsibleMeasures measures={measures} {...props} /> : null}
  </div>
);
