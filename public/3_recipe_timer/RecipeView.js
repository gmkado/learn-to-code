// view
class RecipeView {
  constructor() {
    this.recipesView = document.querySelector(".recipes");
    this.addRecipeButton = document.getElementById("addRecipe");
    this.recipeTemplate = document.getElementById("recipeTemplate");
    this.stepTemplate = document.getElementById("stepTemplate");
    this.startTimeButton = document.getElementById("startTimer");
    this._cooking = false;
  }
  get cooking() {
    return this._cooking;
  }
  // cooking property
  set cooking(value) {
    this._cooking = value;
    if (value) {
      // cooking has started
    }
    else {
      // cooking has stopped
    }
  }
  updateStartText(totalTimeSec) {
    this.startTimeButton.value = `Start timer (${totalTimeSec/60} min)`;
  }
  updateStopText(currentTimeSec) {
    this.startTimeButton.value = `Stop timer (${currentTimeSec} sec remaining)`;
  }
  displayRecipes(model) {
    // Delete all nodes
    while (this.recipesView.firstChild) {
      this.recipesView.removeChild(this.recipesView.firstChild);
    }
    var recipesTimeUpdater = () => {
      this.updateStartText(model.getTotalSeconds());
    };
    model.recipes.forEach(r => {
      this.recipesView.appendChild(this.getRecipeView(r, recipesTimeUpdater));
    });
  }
  ;
  getRecipeView(recipe, recipesTimeUpdater) {
    let recipeView = recipeTemplate.content.cloneNode(true);
    let recipeStepsView = recipeView.querySelector(".recipe__steps");
    let recipeTitleView = recipeView.querySelector(".recipe__title");
    var recipeTimeUpdater = () => {
      recipeTitleView.textContent = `Recipe (${recipe.getTotalSeconds()/60} min)`;
      recipesTimeUpdater();
    };
    // the handler for this click event is set in bindAddStep
    let addStepButton = recipeView.querySelector(".recipe__add-step");
    addStepButton.addEventListener("click", event => {
      this.addStepHandler(recipe);
    });
    // the handler for this click event is set in bindDeleteRecipe
    let deleteRecipeButton = recipeView.querySelector(".recipe__delete-recipe");
    deleteRecipeButton.addEventListener("click", event => {
      this.deleteRecipeHandler(recipe);
    });
    // add the step views
    recipe.steps.forEach(s => {
      recipeStepsView.appendChild(this.getStepView(s, recipeTimeUpdater));
    });
    return recipeView;
  }
  getStepView(step, recipeTimeUpdater) {
    let stepView = stepTemplate.content.cloneNode(true);
    let stepTextInput = stepView.querySelector(".step__text");
    let stepTimeMinutesInput = stepView.querySelector(".step__time-input");
    stepTextInput.textContent = step.instruction;
    stepTimeMinutesInput.value = step.timeSec / 60;

    // if (step.isComplete) {
    //   stepTextInput.style.color = 'rgb(0,255,0)';
    // }
    // else {
    //   stepTextInput.style.color = 'rgb(255,0,0)';
    // }
    
    stepTextInput.onchange = () => {
      step.instruction = stepTextInput.value;
    };
    stepTimeMinutesInput.onchange = () => {
      step.timeSec = stepTimeMinutesInput.valueAsNumber * 60; // input is minutes, convert to seconds
      recipeTimeUpdater();
    };
    return stepView;
  }
  bindAddRecipe(handler) {
    this.addRecipeButton.addEventListener("click", event => {
      handler();
    });
  }
  bindDeleteRecipe(handler) {
    this.deleteRecipeHandler = handler;
  }
  bindAddStep(handler) {
    this.addStepHandler = handler;
  }
  bindStartStopTimer(handler) {
    this.startTimeButton.addEventListener('click', event => {
      handler();
    });
  }
  // loop through all the time entry elements and check if they're valid
  isValid() {
    let step_times = document.querySelectorAll(".step__time");
    return Array.from(step_times)
      .map(t => t.reportValidity())
      .reduce((valid1, valid2) => valid1 && valid2);
  }
}
