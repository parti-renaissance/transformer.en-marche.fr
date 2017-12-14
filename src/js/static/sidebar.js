import React, { Component } from 'react';
import { SearchBox } from 'react-instantsearch/dom';
import { connectRefinementList, connectMenu } from 'react-instantsearch/connectors';
import { reject } from 'lodash';

import Color from 'color';

import LastUpdated from './last-updated';

import '../../scss/sidebar.css';
import '../../scss/filter-button.css';

const BUTTON_COLORS = [
  {
    // yellow
    bg: Color('#ffd402'),
    color: Color('#ff6955'),
  },
  {
    // teal
    bg: Color('#97e5fd'),
    color: Color('#00bef9'),
  },
  {
    // purple
    bg: Color('#bec0ff'),
    color: Color('#6f81ff'),
  },
  {
    // red
    bg: Color('#f9bcbc'),
    color: Color('#ff3856'),
  },
  // {
  //   // dark gray
  //   bg: Color('#b6b6b6'),
  //   color: Color('#444444'),
  // },
];

const addColors = (items = []) => {
  items.map((props, i) => {
    let index = i % BUTTON_COLORS.length;
    let { bg, color } = BUTTON_COLORS[index];
    props.style = {
      backgroundColor: bg.rgb().alpha(0.2).string(),
      color: color.rgb().string(),
    };
    return props;
  });
  return items;
};

const FilterButton = ({isRefined, label, value, onClick, style, buttonRef}) =>
  <button
   className={`filter-button ${isRefined && 'is-active'}`}
   onClick={onClick}
   style={style}
   ref={buttonRef}>
    <span>{label}</span>
  </button>


class RefinementListItem extends Component {
  state = {}
  
  measureButton() {
    let textWidth = this.button.children[0].getBoundingClientRect().width;
    this.setState({style: {flexBasis: textWidth + 24}});
  }
  
  componentDidMount() {
    this.measureButton();
  }
  
  componentWillReceiveProps() {
    this.measureButton();
  }
  
  render() {
    let { props, state } = this;
    return (
      <li className={`refinement-list__item ${props.className}`} style={state.style}>
        <FilterButton {...props} onClick={() => props.refine(props.value)} buttonRef={e => this.button = e} />
      </li>
    )
  }
}

const MoreRefinementsButton = ({ onClick }) =>
  <li className="refinement-list__item refinement-list__item-more">
    <button
     className="filter-button"
     onClick={onClick}
     style={{backgroundColor: 'rgba(182, 182, 182, 0.2)', color: '#444444'}}
     >Voir tous les thèmes</button>
  </li>

const OtherRefinements = connectRefinementList(({ refine, items, exclude }) => {
  return reject(items, item => exclude.includes(item.label)).map((props, i) => {
    props.refine = refine;
    return <RefinementListItem key={props.label} {...props} className="refinement-list__item-other" />
  });
});

const RefinementList = connectRefinementList(({refine, items, viewMore}) => {
  let list = items.map((props, i) => {
    props.refine = refine;
    return <RefinementListItem key={props.label} {...props} />
  });
  list.push(<MoreRefinementsButton key='moreRefinements' onClick={viewMore} />);
  list.push(<OtherRefinements
             key='otherRefinements'
             exclude={items.map(i => i.label)}
             attributeName="title"
             transformItems={addColors} />);
             
  return <ul className='refinement-list'>{list}</ul>
});

const Menu = connectMenu(({refine, items}) => {
  let list = items.map((props, i) => {
    return (
      <li key={i} className="refinement-list__item">
        <FilterButton {...props} onClick={() => refine(props.value)} />
      </li>
    )
  });
  return <ul className="refinement-list">{list}</ul>
});
  

class Sidebar extends Component {
  state = {}
  
  seeMoreRefinements() {
    this.setState({ viewingMore: true });
  }
  
  render() {
    let { measures } = this.props;
    let { viewingMore } = this.state;
    return (
      <aside className={`sidebar ${viewingMore ? 'sidebar-more' : ''}`}>
        <h3 className="sidebar-title">Je m&apos;interesse à...</h3>
        <RefinementList
         attributeName="isFeatured"
         operator="or"
         transformItems={addColors}
         viewMore={this.seeMoreRefinements.bind(this)} />
        
        <h3 className="sidebar-title">Je suis...</h3>
        <Menu attributeName="measures.profiles.title" transformItems={addColors} />

        <SearchBox translations={{placeholder: 'Filtrer par mot-clé'}}/>
        
        <div className="sidebar-footer">
          <LastUpdated measures={measures} />
        </div>
      </aside>
    );
  }
}

export default Sidebar;
