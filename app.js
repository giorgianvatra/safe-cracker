console.log("Welcome to the Safe Cracker game!");
console.log("--------------------------------------");
console.log("To play the game, aadd the bet in the input field.");
console.log("You will  open boxes to match carts.");
console.log("You win when you match 2 multipliers.");
console.log("The multiplier will be applied to your bet amount.");

class Game {
  constructor() {
    this.choices = [];
    this.tableNumbers = [];
    this.betAmount = 0;
    this.matchedChoicesToMultiply = [];
    this.spinCount = 0;
    this.inputCallback = null;
  }

  generateChoices() {
    const choices = [15, 16, 17, 18, 19, 20];
    const matchedChoicesToMultiply = [];

    while (matchedChoicesToMultiply.length < 9) {
      const randomIndex = Math.floor(Math.random() * choices.length);
      const multiplier = choices[randomIndex];

      if (matchedChoicesToMultiply.filter((m) => m === multiplier).length < 3) {
        matchedChoicesToMultiply.push(multiplier);
      }
    }

    return matchedChoicesToMultiply;
  }

  drawCard() {
    console.log("------------------------------");
    for (let i = 0; i < 3; i++) {
      let row = "| ";
      for (let j = 0; j < 3; j++) {
        row += this.tableNumbers[i * 3 + j] + " | ";
      }
      console.log(row);
      console.log("------------------------------");
    }
  }

  promptInp(question) {
    return new Promise((resolve) => {
      const inputElement = document.createElement("input");
      inputElement.setAttribute("type", "text");
      inputElement.style.display = "none";
      document.body.appendChild(inputElement);

      const handleKeyDown = (event) => {
        if (event.key === "Enter") {
          resolve(inputElement.value.trim());
          inputElement.remove();
        }
      };

      this.inputCallback = handleKeyDown;
      inputElement.addEventListener("keydown", this.inputCallback);

      inputElement.style.display = "block";
      inputElement.focus();
    });
  }

  startGame() {
    this.promptInp("Enter your bet amount: ")
      .then((betAmountInput) => {
        this.betAmount = parseFloat(betAmountInput);

        console.log("--------------------------------------");
        console.log("Game Starts!");
        console.log("--------------------------------------");
        console.log("Game Field:");
        this.drawCard();

        this.promptForSpin();
      })
      .catch((error) => console.error(error));
  }

  promptForSpin() {
    this.promptInp("Press [ENTER] to spin\n").then(() => {
      this.playGame();
    });
  }

  playGame() {
    if (this.spinCount < 4 && this.matchedChoicesToMultiply.length < 2) {
      const randomIndex = Math.floor(Math.random() * this.tableNumbers.length);
      const boxNumber = this.tableNumbers[randomIndex];
      const multiplier = this.choices[randomIndex];

      console.log("--------------------------------------");
      console.log(`Spin ${this.spinCount + 1}: Box ${boxNumber} is opened.`);
      console.log("--------------------------------------");

      this.tableNumbers[randomIndex] = multiplier;
      this.drawCard();

      this.checkForDuplicates(boxNumber, multiplier);
      this.spinCount++;
      this.promptForSpin();
    } else {
      this.endGame();
    }
  }

  checkForDuplicates(boxNumber, multiplier) {
    if (this.choices.filter((m) => m === multiplier).length === 3) {
      this.matchedChoicesToMultiply.push(multiplier);
      console.log(`Congratulations! You matched multiplier ${multiplier}.`);
    }
  }

  endGame() {
    console.log("--------------------------------------");
    if (this.matchedChoicesToMultiply.length === 2) {
      const totalMultiplier = this.matchedChoicesToMultiply.reduce(
        (accumulator, currentValue) => accumulator * currentValue
      );
      const winAmount = this.betAmount * totalMultiplier;
      console.log(
        `Congratulations! You matched 2 cards. Your total win amount is: $${winAmount.toFixed(
          2
        )} `
      );
    } else {
      console.log("Game over! You did not match 2 cards.");
    }
    console.log("--------------------------------------");
  }
}

const game = new Game();
game.choices = game.generateChoices();
game.tableNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
game.startGame();
