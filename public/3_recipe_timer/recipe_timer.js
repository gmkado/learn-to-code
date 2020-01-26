// See https://www.taniarascia.com/javascript-mvc-todo-app/
class RecipeModel{
  constructor() {
    this.steps = [];
  }

  addStep() {
    let newstep = { instruction: "", time: 0 };
    this.steps.push(newstep);
  }

  // Loop through all the steps and sum the time
  getTotalTime(){
    return this.steps.map(s => s.time).reduce((t1, t2) => t1 + t2, 0);
  }
}

class RecipesModel {
  constructor() {
    this.recipes = [];
    this.currentTime = 0;
  }

  addRecipe () {
    let newrecipe = new RecipeModel();
    this.recipes.push(newrecipe);
    this.handleChange();
  }

  deleteRecipe (recipe) {
    this.recipes = this.arrayRemove(this.recipes, recipe);
    this.handleChange();
  }

  addStep (recipe) {
    recipe.addStep();
    this.handleChange();
  }

  // total time is the max recipe time
  getTotalTime() {
    // ... is spread syntax https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
    return Math.max(...this.recipes.map(r => r.getTotalTime()));
  }

  bindOnChange(handler) {
    this.handleChange = handler;
  }  

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
    this._cooking = false;
  }

  get cooking(){
    return this._cooking;
  }

  // cooking property
  set cooking(value){
    this._cooking = value;
    if(value) {
      // cooking has started
    }else{
      // cooking has stopped
    }
  }

  updateStartText(totalTime) {
    this.startTimeButton.value = `Start timer (${totalTime} min)`;
  }

  updateStopText(currentTime) {
    this.startTimeButton.value = `Stop timer (${currentTime} sec remaining)`;
  }

  displayRecipes(model) {
    // Delete all nodes
    while (this.recipesView.firstChild) {
      this.recipesView.removeChild(this.recipesView.firstChild);
    }

    var recipesTimeUpdater = ()=>{
      this.updateStartText(model.getTotalTime());
    }
    model.recipes.forEach(r => {
      this.recipesView.appendChild(this.getRecipeView(r, recipesTimeUpdater));
    });    
  };

  getRecipeView(recipe, recipesTimeUpdater) {
    let recipeView = recipeTemplate.content.cloneNode(true);
    let recipeStepsView = recipeView.querySelector(".recipe__steps");
    let recipeTitleView = recipeView.querySelector(".recipe__title");
    
    var recipeTimeUpdater = () => {
      recipeTitleView.textContent = `Recipe (${recipe.getTotalTime()} min)`;
      recipesTimeUpdater();
    }

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
    let stepTimeInput = stepView.querySelector(".step__time-input");
    
    stepTextInput.textContent = step.instruction;
    stepTimeInput.value = step.time;

    stepTextInput.onchange = ()=>{
      step.instruction = stepTextInput.value;      
    };

    stepTimeInput.onchange = ()=>{
      step.time = stepTimeInput.valueAsNumber;
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

class RecipeController {  
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.cooking = false;

    model.bindOnChange(this.handleModelChange);
    view.bindAddRecipe(this.handleAddRecipe);
    view.bindAddStep(this.handleAddStep);
    view.bindDeleteRecipe(this.handleDeleteRecipe);
    view.bindStartStopTimer(this.handleStartStopTime);
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
    this.view.displayRecipes(this.model);
  };

  handleStartStopTime = () =>{
    if(this.view.cooking) {
      this.view.cooking = false;
      clearInterval(this.timerId);
      this.view.updateStartText(this.model.getTotalTime());
    }else{
      // Check that input fields are valid before starting
      if(this.view.isValid()){
        this.view.cooking = true;
        this.currentTimeSec = this.model.getTotalTime() * 60;
        this.timerId = setInterval(this.onTick, 1000); 
      }
    }    
  }

  onTick = () => {
    // update the time
    this.currentTimeSec--;
    this.view.updateStopText(this.currentTimeSec);
  }
}

const app = new RecipeController(new RecipesModel(), new RecipeView());
