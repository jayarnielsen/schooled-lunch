import React from 'react';
import { Component } from 'react';
import css from './Ingredient.css';
import { MdClear, MdRefresh, MdCheck } from 'react-icons/md';

const ingredientFields = ['quantity', 'unit', 'name', 'processing'];

const renderIngredientWithMods = (ingredient, ingredientMods) => {
  const formatted = [];

  ingredientFields.forEach((fieldName, i) => {
    if (
      'processing' === fieldName &&
      (ingredientMods.hasOwnProperty(fieldName) || ingredient[fieldName])
    ) {
      formatted.push(
        <span className={css.separator} key={'separator' + i}>
          ,
        </span>
      );
    }

    if (ingredientMods.hasOwnProperty(fieldName)) {
      if (ingredient[fieldName])
        formatted.push(<del key={'del' + i}>{ingredient[fieldName]}</del>);

      formatted.push(<ins key={'ins' + i}>{ingredientMods[fieldName]}</ins>);
    } else if (ingredient[fieldName]) {
      formatted.push(<span key={i}>{ingredient[fieldName]}</span>);
    }
  });
  return formatted;
};

const renderRemovedIngredient = ingredient => {
  const removedIngredient = [];

  ingredientFields.forEach(fieldName => {
    if (ingredient[fieldName])
      removedIngredient.push(
        'name' === fieldName && ingredient['processing']
          ? ingredient[fieldName] + ','
          : ingredient[fieldName]
      );
  });

  return <del>{removedIngredient.join(' ')}</del>;
};

class Ingredient extends Component {
  getIngredientValue = fieldName => {
    const { ingredient, ingredientMods } = this.props;

    if (ingredientMods.hasOwnProperty(fieldName))
      return ingredientMods[fieldName];

    return ingredient[fieldName];
  };

  handleSave = e => {
    e.stopPropagation();
    // TODO: actually save the changes??
    this.props.setEditingId(null);
  };

  handleSelect = e => {
    e.stopPropagation();
    this.props.setEditingId(this.props.ingredient._id);
  };

  handleRemove = e => {
    e.stopPropagation();
    this.props.removeAction(this.props.ingredient);
  };

  handleRestore = e => {
    e.stopPropagation();
    this.props.restoreAction(this.props.ingredient);
  };

  render() {
    const { ingredient, editing, removed, ingredientMods } = this.props;

    return (
      <li
        className={css.ingredient}
        data-editing={editing}
        onClick={this.handleSelect}
      >
        {editing ? (
          <fieldset>
            <input
              name="quantity"
              value={this.getIngredientValue('quantity')}
              placeholder={ingredient.quantity ? ingredient.quantity : 'Qty'}
            />
            <input
              name="unit"
              value={this.getIngredientValue('unit')}
              placeholder={ingredient.unit ? ingredient.unit : 'Unit'}
            />
            <input
              name="name"
              value={this.getIngredientValue('name')}
              placeholder={ingredient.name ? ingredient.name : 'Name'}
            />
            <input
              name="processing"
              value={this.getIngredientValue('processing')}
              placeholder={
                ingredient.processing ? ingredient.processing : 'Process'
              }
            />
          </fieldset>
        ) : (
          <div className={css.ingredientText}>
            {removed
              ? renderRemovedIngredient(ingredient)
              : renderIngredientWithMods(ingredient, ingredientMods)}
          </div>
        )}

        {removed && !editing && (
          <button data-test-btn-state="restore" onClick={this.handleRestore}>
            <MdRefresh />
          </button>
        )}

        {!removed && !editing && (
          <button data-test-btn-state="remove" onClick={this.handleRemove}>
            <MdClear />
          </button>
        )}

        {editing && (
          <button data-test-btn-state="save" onClick={this.handleSave}>
            <MdCheck />
          </button>
        )}
      </li>
    );
  }
}

export default Ingredient;
