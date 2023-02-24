import cardStyles from "./card.module.css";
import React from 'react';
export default class Card extends React.Component {
  render() {
    let cardImageDataStyle = {
      backgroundImage: `url(data:image/png;base64,${this.props.imageUrl})`
    }
    return (
      <div className={cardStyles.card + " " + cardStyles[this.props.result?.color]}>
        <div className={cardStyles.cardHeader}>
          {this.props.result?.name}
          <ManaDisplay manaCost={this.props.result?.mana_cost} />
        </div>
        <div className={cardStyles.cardImage} style={cardImageDataStyle} ></div>
        <div className={cardStyles.nameTypeAndRarity}>
          {this.props.result?.type} - {this.props.result?.subType}
          <span className="material-symbols-outlined" style={{ color: { "Common": "black", "Uncommon": "#b1d8e6", "Rare": "#f4e500", "Mythic Rare": "#f8981c" }[this.props.result?.rarity], textDecoration: "outline" }}>swords</span>
        </div>
        <div className={cardStyles.description}>
          {this.props.result?.description}
          <ul>
            {this.props.result?.abilities.map(ability => (<li>{ability.ability}</li>))}
          </ul>
        </div>
        <div className={cardStyles.strengthAndDefense}>{this.props.result?.strength}/{this.props.result?.defense}</div>
      </div>
    );
  }
}

export class ManaDisplay extends React.Component {
  render() {
    return (
          <div className={cardStyles.mana}>
            <div className={cardStyles.colorlessMana}>{this.props.manaCost?.colorless}</div>
            <div className={cardStyles.coloredMana}>
              <ColoredManaDisplay manaCost={this.props.manaCost} icon="nature" color="green"/>
              {Array.from({ length: this.props.manaCost?.blue }, (value, index) => <div className={cardStyles.blueMana}><span className={cardStyles.icon + " material-symbols-outlined"}>water_drop</span></div>)}
              {Array.from({ length: this.props.manaCost?.red }, (value, index) => <div className={cardStyles.redMana}><span className={cardStyles.icon + " material-symbols-outlined"}>local_fire_department</span></div>)}
              {Array.from({ length: this.props.manaCost?.black }, (value, index) => <div className={cardStyles.blackMana}><span className={cardStyles.icon + " material-symbols-outlined"}>skull</span></div>)}
              {Array.from({ length: this.props.manaCost?.white }, (value, index) => <div className={cardStyles.whiteMana}><span className={cardStyles.icon + " material-symbols-outlined"}>air</span></div>)}
            </div>
          </div>
    );
  }
}

export class ColoredManaDisplay extends React.Component {
  render() {
    let color = this.props.color;
    let icon = this.props.icon;
    return Array.from({ length: !this.props.manaCost ? 'colorless' : this.props.manaCost[color] }, (value, index) => <div className={cardStyles.greenMana}><span className={cardStyles.icon + " material-symbols-outlined"}>{icon}</span></div>);
  }
}