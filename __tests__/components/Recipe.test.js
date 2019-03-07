import { shallow } from 'enzyme';
import React from 'react';

import Recipe from 'schooled-lunch/client/components/Recipe';
import generateId from 'schooled-lunch/client/utils/generateId';

let props, localStoreId;

beforeEach(() => {
  props = {
    recipe: {
      _id: generateId(),
      title: 'Spaghetti and Meatballs',
      author: {
        _id: generateId(),
        name: 'Test McTester'
      },
      time: 'medium',
      skill: 'easy',
      description: "It's food!",
      course: 'main',
      items: [
        {
          _id: generateId(),
          name: 'Food thingy',
          steps: [
            {
              _id: generateId(),
              directions: 'Do the first thing',
              ingredients: [
                {
                  _id: generateId(),
                  name: 'wine',
                  quantity: 1,
                  unit: 'cup'
                }
              ]
            },
            {
              _id: generateId(),
              directions: 'Do the second thing',
              ingredients: [
                {
                  _id: generateId(),
                  name: 'wine',
                  quantity: 1,
                  unit: 'cup'
                }
              ]
            }
          ]
        },
        {
          _id: generateId(),
          name: 'Sauce',
          steps: []
        }
      ]
    }
  };
  localStoreId = `MOD-${props.recipe.id}`;
  localStorage.clear();
  localStorage.setItem.mockClear();
});

describe('It saves alterations', () => {
  test('saves an alteration to localstorage', () => {
    const wrapper = shallow(<Recipe {...props} />);
    const instance = wrapper.instance();
    instance.saveAlteration(props.recipe, 'title', 'Milk Steak');
    expect(localStorage.setItem).toHaveBeenCalled();
    expect(JSON.parse(localStorage.__STORE__[localStoreId])).toEqual(
      expect.objectContaining({
        alterations: expect.arrayContaining([
          expect.objectContaining({
            sourceId: props.recipe.id,
            field: 'title',
            value: 'Milk Steak'
          })
        ])
      })
    );
  });

  test('does not save alterations that are same as source', () => {
    const wrapper = shallow(<Recipe {...props} />);
    const instance = wrapper.instance();
    instance.saveAlteration(props.recipe, 'title', props.recipe.title);
    expect(localStorage.setItem).toHaveBeenCalledTimes(0);
  });

  test('removes an alteration if updated value is same as source', () => {
    const wrapper = shallow(<Recipe {...props} />);
    const instance = wrapper.instance();
    const originalTitle = String(props.recipe.title);

    instance.saveAlteration(props.recipe, 'title', 'Milk Steak');
    expect(
      JSON.parse(localStorage.__STORE__[localStoreId]).alterations
    ).toHaveLength(1);

    instance.saveAlteration(props.recipe, 'title', originalTitle);
    expect(
      JSON.parse(localStorage.__STORE__[localStoreId]).alterations
    ).toHaveLength(0);
  });
});

describe('It saves removals', () => {
  test('saves removal to localstorage', () => {
    const wrapper = shallow(<Recipe {...props} />);
    const instance = wrapper.instance();

    instance.saveRemoval(props.recipe.items[0]);
    expect(localStorage.setItem).toHaveBeenCalled();
    expect(JSON.parse(localStorage.__STORE__[localStoreId])).toEqual(
      expect.objectContaining({
        removals: expect.arrayContaining([props.recipe.items[0].id])
      })
    );
  });
});

describe('It saves sorting', () => {
  test('saves sorting to localstorage', () => {
    const wrapper = shallow(<Recipe {...props} />);
    const instance = wrapper.instance();
    const { recipe } = instance.state;

    instance.saveSorting(recipe.id, recipe.items, recipe.items.length - 1, 0);
    expect(localStorage.setItem).toHaveBeenCalled();
    expect(
      JSON.parse(localStorage.__STORE__[localStoreId]).sortings[0].order[0]
    ).toEqual(recipe.items[recipe.items.length - 1].id);
  });

  test('removes sorting mod if same as source', () => {
    const wrapper = shallow(<Recipe {...props} />);
    const instance = wrapper.instance();
    const { recipe } = instance.state;

    instance.saveSorting(recipe.id, recipe.items, recipe.items.length - 1, 0);
    expect(
      JSON.parse(localStorage.__STORE__[localStoreId]).sortings
    ).toHaveLength(1);

    instance.saveSorting(recipe.id, recipe.items, 0, recipe.items.length - 1);
    expect(
      JSON.parse(localStorage.__STORE__[localStoreId]).sortings
    ).toHaveLength(0);
  });
});

describe('It creates additions', () => {
  test('creates a new ingredient', () => {
    const wrapper = shallow(<Recipe {...props} />);
    const instance = wrapper.instance();
    const { additions } = instance.state.modification;

    instance.createIngredient(props.recipe.items[0].steps[0].id);

    expect(additions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          _id: expect.any(String),
          parentId: props.recipe.items[0].steps[0].id,
          kind: 'Ingredient'
        })
      ])
    );
  });

  test('creates a new step', () => {
    const wrapper = shallow(<Recipe {...props} />);
    const instance = wrapper.instance();
    const { additions } = instance.state.modification;

    instance.createStep(props.recipe.items[0].id);

    expect(additions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          _id: expect.any(String),
          parentId: props.recipe.items[0].id,
          kind: 'Step'
        })
      ])
    );
  });

  test('creates a new item', () => {
    const wrapper = shallow(<Recipe {...props} />);
    const instance = wrapper.instance();
    const { additions } = instance.state.modification;

    instance.createItem();

    expect(additions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          _id: expect.any(String),
          parentId: props.recipe.id,
          kind: 'Item'
        })
      ])
    );
  });
});
