// See https://www.taniarascia.com/javascript-mvc-todo-app/
class RecipeModel{
  constructor() {
    this.steps = [];
    this.currentIndex = 0; // start at beginning of list
  }

  addStep() {
    let newstep = { instruction: "", timeSec: 0, timeLeftSec:0};
    this.steps.push(newstep);
  }

  // Loop through all the steps and sum the time
  getTotalSeconds(){
    return this.steps.map(s => s.timeSec).reduce((t1, t2) => t1 + t2, 0);
  }

  decrementCurrentStep() {
    if(this.currentIndex < this.steps.length) {
      let currentStep = this.steps[this.currentIndex];
      if(currentStep.timeLeftSec > 0) {
        currentStep.timeLeftSec--;
      }else{
        this.currentIndex ++;
        // recursively call this function to check the index and time left on this step
        this.decrementCurrentStep();
      }
    }else{
      this.done = true;
    }

  }
}

class RecipesModel {
  constructor() {
    let sampleRecipe = new RecipeModel();
    sampleRecipe.steps = [
      { instruction: "abc", timeSec: 60, timeLeftSec: 60, isComplete:false},
      { instruction: "def", timeSec: 60, timeLeftSec: 60, isComplete:false}
    ];
    this.recipes = [sampleRecipe];      
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
  getTotalSeconds() {
    // ... is spread syntax https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
    return Math.max(...this.recipes.map(r => r.getTotalSeconds()));
  }

  bindOnChange(handler) {
    this.handleChange = handler;
  }  


  updateCurrentTime(currentCountdownSec) {
    this.recipes.forEach(r => {
      if (r.done) return;
      // translate to elapsed time in the recipe
      let recipeTimeElapsed = r.getTotalSeconds() - currentCountdownSec;
      if(recipeTimeElapsed > 0){
        r.decrementCurrentStep();
      }
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