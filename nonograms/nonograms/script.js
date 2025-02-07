document.addEventListener("DOMContentLoaded", () => {
  const mainContent = document.createElement("div");
  mainContent.id = "main-content";
  document.body.appendChild(mainContent);

  while (document.body.firstChild !== mainContent) {
    mainContent.appendChild(document.body.firstChild);
  }

  document.body.style.backgroundImage =
    "url('https://images.unsplash.com/photo-1551487595-20c34cc5a5f4')";
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
  document.body.style.backgroundAttachment = "fixed";
  // Create the theme toggle button
  const themeToggle = document.createElement("button");
  themeToggle.id = "theme-toggle";
  themeToggle.className = "theme-toggle";
  mainContent.appendChild(themeToggle);

  const icon = document.createElement("i");
  icon.className = "fas fa-adjust";
  themeToggle.appendChild(icon);

  // add title to the game
  const title = document.createElement("h1");
  title.textContent = "Nonogram";
  title.classList.add("title", "title-light");
  document.body.appendChild(title);

  const modal = document.createElement("div");
  modal.id = "winModal";
  modal.className = "modal";

  const modalContent = document.createElement("div");
  modalContent.className = "modal-content";

  const winMessage = document.createElement("p");
  winMessage.id = "winMessage";

  const closeButton = document.createElement("div");
  closeButton.textContent = "OK";
  closeButton.className = "ok-btn";

  modalContent.appendChild(winMessage);
  modalContent.appendChild(closeButton);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  //CHANGE THEME
  function updateTheme(theme) {
    document.body.className = theme + "-theme";
  }

  const savedTheme = localStorage.getItem("theme") || "light";
  updateTheme(savedTheme);

  themeToggle.addEventListener("click", () => {
    const currentTheme = document.body.classList.contains("light-theme")
      ? "light"
      : "dark";
    const newTheme = currentTheme === "light" ? "dark" : "light";
    updateTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  });

  // generate puzzle grid
  // Array of puzzles
  const puzzles = [
    {
      name: "Cross Pattern",
      cluesTop: [[1, 1], [5], [1, 1], [1], []],
      cluesLeft: [[1], [3], [1, 1], [3], [1]],
      solution: [
        [0, 1, 0, 0, 0],
        [1, 1, 1, 0, 0],
        [0, 1, 0, 1, 0],
        [1, 1, 1, 0, 0],
        [0, 1, 0, 0, 0],
      ],
    },
    {
      name: "Double Cross",
      cluesTop: [[5], [1, 1, 1], [3], [], []],
      cluesLeft: [[2], [1, 1], [3], [1, 1], [2]],
      solution: [
        [1, 1, 0, 0, 0],
        [1, 0, 1, 0, 0],
        [1, 1, 1, 0, 0],
        [1, 0, 1, 0, 0],
        [1, 1, 0, 0, 0],
      ],
    },
    {
      name: "Central Block",
      cluesTop: [[1], [1, 1], [3], [2], [1]],
      cluesLeft: [[1], [1, 1], [3], [1, 1], [1]],
      solution: [
        [0, 1, 0, 0, 0],
        [1, 0, 0, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 1, 0, 1],
        [0, 0, 1, 0, 0],
      ],
    },

    {
      name: "Diagonal Stripes",
      cluesTop: [[3], [2, 2], [1], [], []],
      cluesLeft: [[1], [2], [1, 1], [2], [1]],
      solution: [
        [0, 1, 0, 0, 0],
        [1, 1, 0, 0, 0],
        [1, 0, 1, 0, 0],
        [1, 1, 0, 0, 0],
        [0, 1, 0, 0, 0],
      ],
    },
    {
      name: "Vertical Lines",
      cluesTop: [[3], [1, 1], [3], [0], []],
      cluesLeft: [[1], [1, 1], [1, 1], [1, 1], [1]],
      solution: [
        [0, 1, 0, 0, 0],
        [1, 0, 1, 0, 0],
        [1, 0, 1, 0, 0],
        [1, 0, 1, 0, 0],
        [0, 1, 0, 0, 0],
      ],
    },
  ];

  // Puzzle Selector
  const puzzleLabel = document.createElement("label");
  puzzleLabel.htmlFor = "puzzleSelector";
  puzzleLabel.textContent = "Choose a template";
  document.body.appendChild(puzzleLabel);

  const puzzleSelector = document.createElement("select");
  puzzleSelector.id = "puzzleSelector";
  puzzleSelector.classList = "puzzle-selector";
  document.body.appendChild(puzzleSelector);

  let currentPuzzle = null;

  puzzles.forEach((puzzle, index) => {
    const puzzleOption = document.createElement("option");
    puzzleOption.value = index;
    puzzleOption.textContent = puzzle.name;
    puzzleSelector.appendChild(puzzleOption);
  });

  // Event listener for the puzzle selector
  puzzleSelector.addEventListener("change", () => {
    const selectedPuzzleIndex = puzzleSelector.value;
    const selectedPuzzle = puzzles[selectedPuzzleIndex];
    currentPuzzle = selectedPuzzle;
    createGameField(selectedPuzzle);
    clearInterval(timerInterval);
    elapsedTime = 0;
    timerDisplay.textContent = "0:00";
    timerStarted = false;
    puzzleSelector.disabled = false;
  });

  // Buttons
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");
  document.body.appendChild(buttonContainer);

  // random game button
  const randomGameButton = document.createElement("button");
  randomGameButton.textContent = "Random";
  randomGameButton.id = "random-game-btn";
  randomGameButton.classList.add("random-btn");
  // body.append(randomGameButton);
  buttonContainer.appendChild(randomGameButton);

  // Timer Display
  const timerDisplay = document.createElement("div");
  timerDisplay.id = "timer-display";
  timerDisplay.textContent = "0:00";
  timerDisplay.classList.add("stop-watch");
  buttonContainer.appendChild(timerDisplay);

  // Reset Button
  const resetButton = document.createElement("button");
  resetButton.textContent = "Reset";
  resetButton.classList.add("reset-btn");
  buttonContainer.appendChild(resetButton);

  // Create and append the "Save game" button
  const saveGameBtn = document.createElement("button");
  saveGameBtn.id = "save-game-btn";
  saveGameBtn.classList.add("save-game-btn");
  saveGameBtn.textContent = "SAVE";
  buttonContainer.appendChild(saveGameBtn);

  // Create and append the "Continue last game" button
  const continueGameBtn = document.createElement("button");
  continueGameBtn.id = "continue-game-btn";
  continueGameBtn.classList.add("continue-game-btn");

  continueGameBtn.textContent = "CONTINUE";
  buttonContainer.appendChild(continueGameBtn);

  const showSolution = document.createElement("button");
  showSolution.id = "showSolution-btn";
  showSolution.textContent = "Solution";
  showSolution.classList.add("solution-button");
  buttonContainer.appendChild(showSolution);

  let startTime;
  let elapsedTime = 0;
  let timerInterval;
  let timerStarted = false;

  function startStopwatch() {
    if (!timerStarted) {
      startTime = Date.now() - elapsedTime;
      timerInterval = setInterval(() => {
        elapsedTime = Date.now() - startTime;
        updateTimerDisplay();
      }, 1000);
      timerStarted = true;
    }
  }

  function stopStopwatch() {
    clearInterval(timerInterval);
    timerStarted = false;
  }

  function updateTimerDisplay() {
    const seconds = Math.floor(elapsedTime / 1000);
    const minutes = Math.floor(seconds / 60);
    const displaySeconds = seconds % 60;
    timerDisplay.textContent = `${minutes}:${displaySeconds
      .toString()
      .padStart(2, "0")}`;
  }

  // Create Game Field
  function createGameField(puzzle) {
    const existingGrid = document.querySelector(".game-container");
    if (existingGrid) {
      existingGrid.remove();
    }
    const gameField = document.createElement("div");
    gameField.className = "game-container";

    // Clue containers
    const topCluesContainer = document.createElement("div");
    topCluesContainer.className = "top-clues-container";
    puzzle.cluesTop.forEach((clue, index) => {
      const clueDiv = document.createElement("div");
      clueDiv.textContent = clue.join(" ");
      clueDiv.classList.add("clue");
      if ((index + 1) % 5 === 0) {
      }
      topCluesContainer.appendChild(clueDiv);
    });

    const leftCluesContainer = document.createElement("div");
    leftCluesContainer.className = "left-clues-container";
    puzzle.cluesLeft.forEach((clue, index) => {
      const clueDiv = document.createElement("div");
      clueDiv.textContent = clue.join(" ");
      clueDiv.classList.add("clue");
      if ((index + 1) % 5 === 0) {
      }
      leftCluesContainer.appendChild(clueDiv);
    });

    // Add clue containers to game field
    gameField.appendChild(topCluesContainer);
    gameField.appendChild(leftCluesContainer);

    // Create grid
    const gridContainer = document.createElement("div");
    gridContainer.classList.add("main-grid");

    puzzle.solution.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const cellDiv = document.createElement("div");
        cellDiv.classList.add("cell");
        cellDiv.dataset.row = rowIndex;
        cellDiv.dataset.col = colIndex;

        // Sound effects
        const markCrossSound = new Audio("sounds/cross.wav");
        markCrossSound.volume = 1.0;
        const markCellSound = new Audio("sounds/black.mp3");
        markCellSound.volume = 1.0;
        const unmarkCellSound = new Audio("sounds/unmark.mp3");
        unmarkCellSound.volume = 1.0;

        // Left-click event to toggle filled state (black cell)
        cellDiv.addEventListener("click", () => {
          if (!timerStarted) {
            startStopwatch();
            timerStarted = true;
          }

          if (cellDiv.classList.contains("crossed-cell")) {
            // If the cell is crossed, remove the cross and mark it as filled (black)
            cellDiv.classList.remove("crossed-cell");
            cellDiv.classList.add("filled");
            markCellSound.currentTime = 0;
            markCellSound.play().catch((error) => {
              console.error("Error playing mark sound:", error);
            });
          } else if (cellDiv.classList.contains("filled")) {
            // If the cell is filled, unmark it (empty)
            cellDiv.classList.remove("filled");
            unmarkCellSound.currentTime = 0;
            unmarkCellSound.play().catch((error) => {
              console.error("Error playing unmark sound:", error);
            });
          } else {
            // If the cell is neither filled nor crossed, mark it as filled (black)
            cellDiv.classList.add("filled");
            markCellSound.currentTime = 0;
            markCellSound.play().catch((error) => {
              console.error("Error playing mark sound:", error);
            });
          }

          checkGameEnd(puzzle);
        });

        // Right-click to toggle crossed (X) or empty (white)
        cellDiv.addEventListener("contextmenu", (event) => {
          event.preventDefault();

          if (!timerStarted) {
            startStopwatch();
            timerStarted = true;
          }

          if (cellDiv.classList.contains("filled")) {
            // If the cell is filled (black), turn it into crossed (X)
            cellDiv.classList.remove("filled");
            cellDiv.classList.add("crossed-cell");
            markCrossSound.currentTime = 0; // Reset to the beginning of the sound
            markCrossSound.play().catch((error) => {
              console.error("Error playing cross sound:", error);
            });
          } else if (cellDiv.classList.contains("crossed-cell")) {
            // If the cell is crossed, remove the cross and play the "empty" sound
            cellDiv.classList.remove("crossed-cell");
            unmarkCellSound.currentTime = 0;
            unmarkCellSound.play().catch((error) => {
              console.error("Error playing unmark sound:", error);
            });
          } else {
            // If the cell is not filled, mark it as crossed (X)
            cellDiv.classList.add("crossed-cell");
            markCrossSound.currentTime = 0;
            markCrossSound.play().catch((error) => {
              console.error("Error playing cross sound:", error);
            });
          }
        });

        gridContainer.appendChild(cellDiv);

        // Dividers for every 5 cells (both rows and columns)
        if ((rowIndex + 1) % 5 === 0) {
        }
        if ((colIndex + 1) % 5 === 0) {
        }
      });
    });

    gameField.appendChild(gridContainer);
    document.body.appendChild(gameField);
  }

  closeButton.onclick = function () {
    modal.style.display = "none";
    mainContent.classList.remove("blur");
    document.body.classList.remove("no-scroll");
    puzzleSelector.disabled = false;
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
      mainContent.classList.remove("blur");
      document.body.classList.remove("no-scroll");
    }
  };

  const winGameSound = new Audio("sounds/win.wav");
  winGameSound.volume = 1.0;

  const initialPuzzle = puzzles[0];
  createGameField(initialPuzzle);

  // Game End Check
  function checkGameEnd(puzzle) {
    const cells = document.querySelectorAll(".cell");
    let isSolved = true;

    cells.forEach((cell) => {
      const row = cell.dataset.row;
      const col = cell.dataset.col;
      const isFilled = cell.classList.contains("filled");
      if (isFilled !== Boolean(puzzle.solution[row][col])) {
        isSolved = false;
      }
    });

    if (isSolved) {
      stopStopwatch();
      const seconds = Math.floor(elapsedTime / 1000);
      console.log("Game solved, attempting to play sound");

      setTimeout(() => {
        winGameSound.currentTime = 0;
        winGameSound
          .play()
          .then(() => {
            console.log("Sound played successfully");
          })
          .catch((error) => {
            console.error("Error playing sound:", error);
          });
      }, 1000);

      setTimeout(() => {
        const modal = document.getElementById("winModal");
        const winMessage = document.getElementById("winMessage");
        winMessage.textContent = `Great! You have solved the nonogram in ${seconds} seconds!`;
        modal.style.display = "flex";
        mainContent.classList.add("blur");
        document.body.classList.add("no-scroll");
      }, 1000);
    }
  }

  resetButton.addEventListener("click", () => {
    puzzleSelector.disabled = false;
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
      cell.classList.remove("filled");
      cell.classList.remove("crossed-cell");
      cell.textContent = "";
      cell.style.backgroundColor = "";
      cell.style.color = "";
    });
    stopStopwatch();
    timerDisplay.textContent = "0:00";
    elapsedTime = 0;

    let stopwatchStarted = false;
    cells.forEach((cell) => {
      cell.addEventListener("click", function startStopwatchOnce() {
        if (!stopwatchStarted) {
          startStopwatch();
          stopwatchStarted = true;
        }
        cell.removeEventListener("click", startStopwatchOnce);
      });
    });
  });

  // Show Solution
  showSolution.addEventListener("click", () => {
    const selectedPuzzle = currentPuzzle || puzzles[puzzleSelector.value];
    const cells = document.querySelectorAll(".cell");

    cells.forEach((cell) => {
      cell.classList.remove("filled");
      cell.classList.remove("crossed-cell");
    });

    cells.forEach((cell) => {
      const row = cell.dataset.row;
      const col = cell.dataset.col;
      if (selectedPuzzle.solution[row][col]) {
        cell.classList.add("filled");
      }
    });

    stopStopwatch();
    timerStarted = false;
    timerDisplay.textContent = "0:00";
  });

  function getRandomPuzzle() {
    const randomIndex = Math.floor(Math.random() * puzzles.length);
    return { puzzle: puzzles[randomIndex], index: randomIndex };
  }

  randomGameButton.addEventListener("click", () => {
    clearInterval(timerInterval);
    timerStarted = false;

    elapsedTime = 0;
    timerDisplay.textContent = "0:00";

    const { puzzle: randomPuzzle, index: randomIndex } = getRandomPuzzle();
    currentPuzzle = randomPuzzle;
    createGameField(currentPuzzle);
    puzzleSelector.value = randomIndex;
    puzzleSelector.disabled = false;
    timerDisplay.style.display = "block";
  });

  // Save game state to localStorage
  saveGameBtn.addEventListener("click", () => {
    clearInterval(timerInterval);
    timerStarted = false;

    const cells = document.querySelectorAll(".cell");
    const gameState = {
      filledCells: [],
      crossedCells: [],
      elapsedTime: elapsedTime,
      selectedPuzzleIndex: puzzleSelector.value, // Save the selected puzzle index
    };

    cells.forEach((cell) => {
      if (cell.classList.contains("filled")) {
        gameState.filledCells.push({
          row: cell.dataset.row,
          col: cell.dataset.col,
        });
      } else if (cell.classList.contains("crossed-cell")) {
        gameState.crossedCells.push({
          row: cell.dataset.row,
          col: cell.dataset.col,
        });
      }
    });

    localStorage.setItem("nonogramGameState", JSON.stringify(gameState));
    alert("Game saved!");
  });

  // Continue last game
  continueButton.addEventListener("click", () => {
    const savedGameState = localStorage.getItem("nonogramGameState");

    if (savedGameState) {
      const gameState = JSON.parse(savedGameState);

      // Ensure the selected puzzle exists in the puzzles array
      const selectedPuzzle = puzzles[gameState.selectedPuzzleIndex];
      if (!selectedPuzzle) {
        alert("The saved puzzle is unavailable.");
        return;
      }

      // Create the game field based on the selected puzzle
      createGameField(selectedPuzzle);
      puzzleSelector.value = gameState.selectedPuzzleIndex;

      // Restore filled and crossed cells
      const cells = document.querySelectorAll(".cell");
      cells.forEach((cell) => {
        const row = cell.dataset.row;
        const col = cell.dataset.col;

        // Check if the cell was filled or crossed in the saved state
        const filledCell = gameState.filledCells.find(
          (cellData) => cellData.row == row && cellData.col == col,
        );
        const crossedCell = gameState.crossedCells.find(
          (cellData) => cellData.row == row && cellData.col == col,
        );

        if (filledCell) {
          cell.classList.add("filled");
        } else if (crossedCell) {
          cell.classList.add("crossed-cell");
        }
      });

      // Restore elapsed time and start the stopwatch
      elapsedTime = gameState.elapsedTime || 0;
      timerDisplay.textContent = formatTime(elapsedTime);
      startStopwatch(); // Start the stopwatch with the restored time

      function formatTime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const displaySeconds = seconds % 60;
        return `${minutes}:${displaySeconds.toString().padStart(2, "0")}`;
      }
    } else {
      alert("No saved game found!");
    }
  });
});
