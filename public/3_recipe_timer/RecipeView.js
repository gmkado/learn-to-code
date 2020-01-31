class RecipeView {
  constructor() {
    this.recipesView = document.querySelector(".recipes");
    this.addRecipeButton = document.getElementById("addRecipe");
    this.recipeTemplate = document.getElementById("recipeTemplate");
    this.stepTemplate = document.getElementById("stepTemplate");
    this.startPauseButton = document.getElementById("startTimer");
    this.resetButton = document.getElementById("resetTimer");
  }

  formatTime(timeSec) {
    let min = Math.floor(timeSec / 60);
    let sec = timeSec % 60;
    return `${min}min${sec != 0 ? " " + sec.toString() + "sec" : ""}`;
  }

  updateStartText(totalTimeSec) {
    if (totalTimeSec < 0) {
      this.startPauseButton.value = "Start";
    } else {
      this.startPauseButton.value = `Start (${this.formatTime(totalTimeSec)})`;
    }
  }

  updatePauseText(currentTimeSec) {
    // start time button is also the pause timer
    this.startPauseButton.value = `Pause (${this.formatTime(currentTimeSec)})`;
  }

  done(){
    this.resetButton.value = 'Done! Reset?';
    this.setStartPauseVisible(false);
    this.setResetVisible(true);
  }

  reset(){
    this.setStartPauseVisible(true);
    this.setResetVisible(false);
    this.resetButton.value = 'Reset';
  }

  setStartPauseVisible(visible) {
    this.startPauseButton.style.display = visible ? "" : "None";
  }

  setResetVisible(visible) {
    this.resetButton.style.display = visible ? "" : "None";
  }

  displayRecipes(model, control) {
    // Delete all nodes
    while (this.recipesView.firstChild) {
      this.recipesView.removeChild(this.recipesView.firstChild);
    }
    var recipesTimeUpdater = () => {
      this.updateStartText(model.getTotalSeconds());
    };
    model.recipes.forEach(recipe => {
      this.recipesView.appendChild(
        this.getRecipeView(recipe, control, recipesTimeUpdater)
      );
    });

    if (control.cooking) {
      this.addRecipeButton.disabled = true;
    } else {
      this.addRecipeButton.disabled = false;
      recipesTimeUpdater(); // also redraw time field
    }

    this.startPauseButton.disabled = !this.isValid();
  }

  getRecipeView(recipe, control, recipesTimeUpdater) {
    let recipeView = recipeTemplate.content.cloneNode(true);
    let recipeStepsView = recipeView.querySelector(".recipe__steps");
    let recipeTitleView = recipeView.querySelector(".recipe__title");
    var recipeTimeUpdater = () => {
      recipeTitleView.textContent = `Recipe (${recipe.getTotalSeconds() /
        60} min)`;
      recipesTimeUpdater();
    };
    // the handler for this click event is set in bindAddStep
    let addStepButton = recipeView.querySelector(".recipe__add-step");
    addStepButton.addEventListener("click", event => {
      recipe.addStep();
    });
    // the handler for this click event is set in bindDeleteRecipe
    let deleteRecipeButton = recipeView.querySelector(".recipe__delete-recipe");
    deleteRecipeButton.addEventListener("click", event => {
      this.deleteRecipeHandler(recipe);
    });

    // add the step views
    recipe.steps.forEach(step => {      
      recipeStepsView.appendChild(this.getStepView(step, control, recipeTimeUpdater));
    });

    if (control.cooking) {
      addStepButton.disabled = true;
      deleteRecipeButton.disabled = true;
    } else {
      addStepButton.disabled = false;
      deleteRecipeButton.disabled = false;
      recipeTimeUpdater(); // also redraw time field
    }

    return recipeView;
  }

  getStepView(step, control, recipeTimeUpdater) {
    let stepView = stepTemplate.content.cloneNode(true);
    let stepTextInput = stepView.querySelector(".step__text");
    let stepTimeInput = stepView.querySelector(".step__time-input");
    let stepTimeLabel = stepView.querySelector(".step__time-label");
    let moveUpButton = stepView.querySelector(".step__move-up");
    let moveDownButton = stepView.querySelector(".step__move-down");
    let stepDeleteButton = stepView.querySelector(".step__delete");
    
    let stepList = step.recipe.steps;    

    stepTextInput.textContent = step.instruction;

    stepDeleteButton.onclick = ()=>{
      step.recipe.deleteStep(step);
    }

    moveUpButton.onclick = ()=>{
      step.recipe.moveUp(step);
    };

    moveDownButton.onclick = ()=>{
      step.recipe.moveDown(step);
    };

    stepTextInput.onchange = () => {
      step.instruction = stepTextInput.value;
    };

    stepTimeInput.onchange = () => {
      step.timeSec = stepTimeInput.valueAsNumber * 60; // input is minutes, convert to seconds
      step.timeLeftSec = step.timeSec; // input is minutes, convert to seconds
      this.startPauseButton.disabled = !this.isValid();
      recipeTimeUpdater();
    };    

    if (control.cooking) {
      // show the current step time
      stepTimeInput.value = step.timeLeftSec;
      stepTimeLabel.textContent = "sec";

      // allow user to edit text if paused
      if (control.paused) {
        stepTextInput.disabled = false;
      } else {
        stepTextInput.disabled = true;
      }
      stepTimeInput.disabled = true;
      moveUpButton.disabled = true;
      moveDownButton.disabled = true;
      stepDeleteButton.disabled = true;
      this.setStepColor(step, stepView);

    } else {
      stepTimeInput.value = step.timeSec / 60;
      stepTimeLabel.textContent = "min";
      stepTextInput.disabled = false;
      stepTimeInput.disabled = false;
      stepDeleteButton.disabled = false;

      /// enable arrow buttons if appropriate
      let stepIndex = stepList.indexOf(step);
      moveUpButton.disabled = stepIndex == 0;
      moveDownButton.disabled = stepIndex == stepList.length -1;
    }
    return stepView;
  }
  setStepColor(step, stepView) {
    let color;
    if (step.inProgress) {
      color = "DarkSeaGreen";
    }
    else if (step.isComplete) {
      color = "Gray";
    }
    else {
      color = "IndianRed";
    }
    stepView.children[0].style.background = color;
  }

  bindAddRecipe(handler) {
    this.addRecipeButton.addEventListener("click", event => {
      handler();
    });
  }
  bindDeleteRecipe(handler) {
    this.deleteRecipeHandler = handler;
  }
  bindStartStopTimer(handler) {
    this.startPauseButton.addEventListener("click", event => {
      handler();
    });
  }

  bindReset(handler) {
    this.resetButton.addEventListener("click", event => {
      handler();
    });
  }

  // loop through all the time entry elements and check if they're valid
  isValid() {
    let step_times = document.querySelectorAll(".step__time");

    if (step_times.length === 0) {
      return false;
    }

    return Array.from(step_times)
      .map(t => t.reportValidity())
      .reduce((valid1, valid2) => valid1 && valid2);
  }
}
