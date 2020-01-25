// See https://www.taniarascia.com/javascript-mvc-todo-app/
class RecipeModel {
  constructor() {
    this.recipes = [];
  }

  addRecipe(){
    let newrecipe = {steps:[]};
    this.recipes.push(newrecipe);
    this.changeHandler();
  }

  addStep(recipe) {
    let newstep = {instruction:'', time:0};
    recipe.steps.push(newstep);
    this.changeHandler();
  }

  bindOnChange(handler){
    this.changeHandler = handler;
  }
}

// view
class RecipeView{
  constructor(){
    this.recipesView = document.querySelector(".recipes");
    this.addRecipeButton = document.querySelector('#addRecipe');
    this.recipeTemplate = document.getElementById("recipeTemplate");
    this.stepTemplate = document.getElementById("stepTemplate");    
  }

  displayRecipes(recipes) {
    // Delete all nodes
    while (this.recipesView.firstChild) {
      this.recipesView.removeChild(this.recipesView.firstChild);
    }

    recipes.forEach(r=>{
      this.recipesView.appendChild(this.getRecipeView(r));
    });
  }

  getRecipeView(recipe) {
    let recipeView = recipeTemplate.content.cloneNode(true);
    let recipeStepsView = recipeView.querySelector(".recipe__steps");
    recipeView.querySelector(".recipe__title").textContent = "Recipe";
    
    // the handler for this click event is set in bindAddStep
    let addStepButton = recipeView.querySelector('.recipe__add-step');
    addStepButton.addEventListener('click', event=>{
      this.addStepHandler(recipe);
    });

    // add the step views
    recipe.steps.forEach(s=>{
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

  bindAddRecipe(handler){
    this.addRecipeButton.addEventListener('click', event=>{
      handler();
    })
  }

  bindAddStep(handler){
    this.addStepHandler = handler;
  }
}

class RecipeController{
  constructor(model, view){
    this.model = model;
    this.view = view;

    model.bindOnChange(this.handleModelChange);
    view.bindAddRecipe(this.handleAddRecipe);
    view.bindAddStep(this.handleAddStep);
  }

  handleAddRecipe =() => {
    this.model.addRecipe();
  }

  handleAddStep = (recipe) => {
    this.model.addStep(recipe);
  }

  handleModelChange = () => {
    this.view.displayRecipes(this.model.recipes);
  }
}

const app = new RecipeController(new RecipeModel(), new RecipeView())

//#region button callbacks




function deleteRecipe(e) {
  let recipeCol = e.target.parentNode;
  recipeCol.parentNode.removeChild(recipeCol);
}

function startTimer() {
  let step_times = document.querySelectorAll(".step__time");
  let isValid = Array.from(step_times)
    .map(t => t.reportValidity())
    .reduce((valid1, valid2) => valid1 && valid2);
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

    console.log(Math.max(recipeTimeMap.values()))
  }
}

function sumOfStepTimes(recipe){
  return Array.from(recipe.querySelectorAll(".step__time-input"))
    .map(stepTime => parseInt(stepTime.value))
    .reduce((t1, t2) => t1 + t2, 0);
}
//#endregion