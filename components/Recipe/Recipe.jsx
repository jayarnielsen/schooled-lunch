import Link from 'next/link'
import { Component } from 'react'
import Textarea from 'react-textarea-autosize'
import Swiper from 'react-id-swiper'
// import merge from 'deepmerge';

import css from './Recipe.css'
import { stepsToIngredientTotals, formatIngredientTotal } from '../../util/recipeTools';

class Recipe extends Component {
  state = {
    active: {
      item: 0,
      step: 0,
    },
    recipe: this.props.recipe,
    editing: false,
  }

  // componentDidMount() {
  //   if(localStorage.getItem('recipeMods') !== null) {
  //     const mods = JSON.parse(localStorage.getItem('recipeMods'));
  //     let { recipe } = this.state
  //     Object.entries(mods.steps).forEach(([key, val]) => {
  //       recipe.steps[key] = merge(recipe.steps[key], val);
  //     })
  //   }
  // }

  toggleEdit = () => {
    if(this.state.editing === false) {
      this.setState({editing: true})
    } else {
      this.setState({editing: false})
    }
  }

  nextStep = () => {
    const { active, recipe } = this.state;
    if(recipe.items[active.item] && recipe.items[active.item].steps.length - 1 > active.step) {
      active.step++
    } else if (recipe.items[active.item + 1]) {
      active.item++
      active.step = 0
    }
    this.setState({ active })
  }

  prevStep = () => {
    const { active, recipe } = this.state;
    if(recipe.items[active.item] && active.step > 0) {
      active.step--
    } else if (recipe.items[active.item - 1]) {
      active.item--
      active.step = recipe.items[active.item].steps.length - 1;
    }
    this.setState({ active })
  }

  handleStepChange = (e) => {
    const { name, value } = e.target
    const { recipe, active } = this.state
    recipe.items[active.item].steps[active.step][name] = value


    // localStorage.setItem('recipeMods', JSON.stringify(merge(
    //   localStorage.getItem('recipeMods') !== null ? JSON.parse(localStorage.getItem('recipeMods')) : {},
    //   {
    //     steps: {
    //       [this.state.currentStep]: {
    //         [name]: value
    //       }
    //     }
    //   }
    // )))

    this.setState({recipe})
  }

  setActiveStep = (itemI, stepI) => {
    this.setState({
      active: {
        item: itemI,
        step: stepI,
      }
    })
  }

  render() {
    const { recipe, active, editing } = this.state

    const swiperParams = {
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      spaceBetween: 20,
    }

    return (
      <article className={css.recipe}>
        <div className={css.recipeMain}>
          {recipe.items.map(item => (
            <div key={item._id}>
              <h3>Ingredients for {item.name}</h3>
              <ul className={css.ingredients}>
                {stepsToIngredientTotals(item.steps).map((ingredient, i) => (
                  <li key={i}>
                    {formatIngredientTotal(ingredient)}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {recipe.items.map((item, itemI) => (
            <div key={item._id}>
              <h3>Directions for {item.name}</h3>
              <ol className={css.steps}>
                {item.steps.map((step, stepI) => (
                  <li
                    key={step._id}
                    data-active={active.item == itemI && active.step == stepI}
                    onClick={() => this.setActiveStep(itemI, stepI)}>
                    <div className={css.stepNum}>
                      <span>
                        {stepI + 1}.
                      </span>
                    </div>
                    <div className={css.stepDirections}>
                      {step.directions}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
        <aside className={css.recipeDetail}>
          <div className={css.sticky}>
            <header className={css.recipeDetailHeader}>
              <div className={css.recipeDetailToolbar}>
                <h6>{recipe.items[active.item].name} &gt; Step {active.step + 1}</h6>
                <div className={css.recipeActions}>
                  <button onClick={this.toggleEdit}>
                    <i className="material-icons">edit</i>
                  </button>
                  <button onClick={this.prevStep}>
                    <i className="material-icons">navigate_before</i>
                  </button>
                  <button onClick={this.nextStep}>
                    <i className="material-icons">navigate_next</i>
                  </button>
                </div>
              </div>

              {editing ? (
                <Textarea
                  name="directions"
                  value={recipe.items[active.item].steps[active.step].directions}
                  placeholder="Directions"
                  onChange={this.handleStepChange} />
              ) : (
                <p>
                  {recipe.items[active.item].steps[active.step].directions}
                </p>
              )}
            </header>
            <div className={css.recipeDetailContent}>
              <Swiper {...swiperParams}>
                <img src={`https://loremflickr.com/530/300/food,cooking,spaghetti?s=${active.step}_1`} />
                <img src={`https://loremflickr.com/530/300/food,cooking,spaghetti?s=${active.step}_2`} />
                <img src={`https://loremflickr.com/530/300/food,cooking,spaghetti?s=${active.step}_3`} />
              </Swiper>

              {recipe.items[active.item].steps[active.step].ingredients.length > 0 && (
                <div>
                  <h3>Ingredients Used</h3>
                  <ul className={css.ingredients}>
                    {recipe.items[active.item].steps[active.step].ingredients.map((ingredient, i) => (
                      <li key={i}>
                        {ingredient.quantity} {ingredient.unit} {ingredient.name}
                        {ingredient.processing && `, ${ingredient.processing}`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <h3>Notes</h3>
              {editing ? (
                <Textarea
                  name="notes"
                  value={recipe.items[active.item].steps[active.step].notes}
                  placeholder="Additional Notes"
                  onChange={this.handleStepChange} />
              ) : (
                <p>
                  {recipe.items[active.item].steps[active.step].notes}
                </p>
              )}
            </div>
          </div>
        </aside>
      </article>
    )
  }
}

export default Recipe;
