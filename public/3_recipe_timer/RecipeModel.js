// See https://www.taniarascia.com/javascript-mvc-todo-app/
class RecipeModel{
  constructor(changeHandler) {
    this.steps = [];
    this.handleChange = changeHandler;
    this.reset();
  }
  
  addStep(instruction ='', timeSec = '') {
    let newstep = {recipe: this, instruction: instruction, timeSec: timeSec, timeLeftSec:timeSec};
    this.steps.push(newstep);
    this.handleChange();
    return newstep;
  }
  
  deleteStep(step){    
    this.steps = this.steps.filter(s=> s!=step);
    this.handleChange();
  }

  moveUp(step) {
    let index = this.steps.indexOf(step);
    if(index == 0) {
      return;  // can't move up, we're at the top
    }

    let temp = this.steps[index - 1];
    this.steps[index - 1] = step;
    this.steps[index] = temp;
    this.handleChange();
  }

  moveDown(step) {
    let index = this.steps.indexOf(step);
    if(index == this.steps.length - 1) {
      return;  // can't move down, we're at the bottom
    }

    let temp = this.steps[index + 1];
    this.steps[index + 1] = step;
    this.steps[index] = temp;
    this.handleChange();
  }

  reset(){
    this.steps.forEach(step => {
      step.timeLeftSec = step.timeSec;
      step.isComplete = false;
      step.inProgress = false;
    });
    this.currentIndex = 0; // start at beginning of list
  }

  // Loop through all the steps and sum the time
  getTotalSeconds(){
    return this.steps.map(s => s.timeSec).reduce((t1, t2) => t1 + t2, 0);
  }

  decrementCurrentStep() {
    if(this.currentIndex > this.steps.length) {
      return;
    }

    let currentStep = this.steps[this.currentIndex];
    if(currentStep.timeLeftSec > 0) {
      currentStep.inProgress = true;
      currentStep.timeLeftSec--;
    }else{
      currentStep.inProgress = false;
      currentStep.isComplete = true;
      this.currentIndex ++;
      // recursively call this function to check the index and time left on this step
      this.decrementCurrentStep();
    }   
  }
}

class RecipesModel {
  constructor() {    
    this.recipes = [];      
    this.currentTime = 0;
  }

  addRecipe () {
    let newrecipe = new RecipeModel(this.handleChange);
    this.recipes.push(newrecipe);
    this.handleChange();
    return newrecipe;
  }

  deleteRecipe (recipe) {
    this.recipes = this.arrayRemove(this.recipes, recipe);
    this.handleChange();
  }

  // total time is the max recipe time
  getTotalSeconds() {
    // ... is spread syntax https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
    return Math.max(...this.recipes.map(r => r.getTotalSeconds()));
  }

  bindOnChange(handler) {
    this.handleChange = handler;
  }  


  updateCurrentTime(currentCountdownSec) {    
    this.recipes.forEach(r => {
      // translate to elapsed time in the recipe
      let recipeTimeElapsed = r.getTotalSeconds() - currentCountdownSec;
      if(recipeTimeElapsed > 0){
        r.decrementCurrentStep();
      }
    });

    this.handleChange();
  }

  reset() {
    this.recipes.forEach(recipe => {
      recipe.reset();
    });
    this.handleChange();
  }

  // utility function to remove element from array
  arrayRemove(arr, value) {
    return arr.filter(function(ele) {
      return ele != value;
    });
  }
}