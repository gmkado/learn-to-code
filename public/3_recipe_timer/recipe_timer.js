// See https://www.taniarascia.com/javascript-mvc-todo-app/
class RecipeModel {
  constructor() {
    this.recipes = [];
  }

  addRecipe = () => {
    let newrecipe = { steps: [] };
    this.recipes.push(newrecipe);
    this.handleChange();
  };

  deleteRecipe = recipe => {
    this.recipes = this.arrayRemove(this.recipes, recipe);
    this.handleChange();
  };

  addStep = recipe => {
    let newstep = { instruction: "", time: 0 };
    recipe.steps.push(newstep);
    this.handleChange();
  };

  bindOnChange = handler => {
    this.handleChange = handler;
  };

  // utility function to remove element from array
  arrayRemove(arr, value) {
    return arr.filter(function(ele) {
      return ele != value;
    });
  }
}

// view
class RecipeView {
  constructor() {
    this.recipesView = document.querySelector(".recipes");
    this.addRecipeButton = document.getElementById("addRecipe");
    this.recipeTemplate = document.getElementById("recipeTemplate");
    this.stepTemplate = document.getElementById("stepTemplate");
    this.startTimeButton = document.getElementById("startTimer");    
  }

  displayRecipes = recipes => {
    // Delete all nodes
    while (this.recipesView.firstChild) {
      this.recipesView.removeChild(this.recipesView.firstChild);
    }

    recipes.forEach(r => {
      this.recipesView.appendChild(this.getRecipeView(r));
    });
  };

  getRecipeView(recipe) {
    let recipeView = recipeTemplate.content.cloneNode(true);
    let recipeStepsView = recipeView.querySelector(".recipe__steps");
    recipeView.querySelector(".recipe__title").textContent = "Recipe";

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
      recipeStepsView.appendChild(this.getStepView(s));
    });

    return recipeView;
  }

  getStepView(step) {
    let stepView = stepTemplate.content.cloneNode(true);
    stepView.querySelector(".step__text").textContent = step.instruction;
    stepView.querySelector(".step__time-input").textContent = step.time;

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

  bindStartTimer(handler) {
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

class RecipeController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    model.bindOnChange(this.handleModelChange);
    view.bindAddRecipe(this.handleAddRecipe);
    view.bindAddStep(this.handleAddStep);
    view.bindDeleteRecipe(this.handleDeleteRecipe);
    view.bindStartTimer(this.handleStartTime);
  }

  // we need to use arrow key to get the appropriate 'this'
  // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
  handleAddRecipe = () => {
    this.model.addRecipe();
  };

  handleAddStep = recipe => {
    this.model.addStep(recipe);
  };

  handleDeleteRecipe = recipe => {
    this.model.deleteRecipe(recipe);
  };

  handleModelChange = () => {
    this.view.displayRecipes(this.model.recipes);
  };

  handleStartTime = () =>{
    if(this.view.isValid()){
      // TODO: finish moving everything in here
    }
  }
}

const app = new RecipeController(new RecipeModel(), new RecipeView());

//#region button callbacks

function startTimer() {
  
  if (isValid) {
    // add up all the times and get a time-remaining
    let recipes = document
      .querySelector(".recipes")
      .querySelectorAll(".recipe");

    // list of step times for each recipe
    let recipeTimeMap = {};
    recipes.forEach(recipe => {
      // add up all the steps in the recipe
      recipeTimeMap[recipe] = sumOfStepTimes(recipe);

      // display the recipe
      recipe.querySelector(
        ".recipe__total-time"
      ).textContent = `Total time ${recipeTimeMap[recipe]}`;
    });

    console.log(Math.max(recipeTimeMap.values()));
  }
}

function sumOfStepTimes(recipe) {
  return Array.from(recipe.querySelectorAll(".step__time-input"))
    .map(stepTime => parseInt(stepTime.value))
    .reduce((t1, t2) => t1 + t2, 0);
}
//#endregion
