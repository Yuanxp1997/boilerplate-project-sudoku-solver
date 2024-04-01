class SudokuSolver {
  validate(puzzleString) {
    if (puzzleString.length !== 81) {
      return "Expected puzzle to be 81 characters long";
    }
    if (puzzleString.match(/[^0-9.]/)) {
      return "Invalid characters in puzzle";
    }
    return "valid";
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const rowStart = row * 9;
    const rowEnd = rowStart + 9;
    const rowValues = puzzleString.slice(rowStart, rowEnd);
    const valid = !rowValues.includes(value);
    return valid;
  }

  checkColPlacement(puzzleString, row, column, value) {
    const colValues = [];
    for (let i = 0; i < 9; i++) {
      colValues.push(puzzleString[column + i * 9]);
    }
    const valid = !colValues.includes(value.toString());
    return valid;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const regionRow = Math.floor(row / 3) * 3;
    const regionCol = Math.floor(column / 3) * 3;
    const regionValues = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        regionValues.push(
          puzzleString[regionCol + col + (regionRow + row) * 9]
        );
      }
    }
    const valid = !regionValues.includes(value.toString());
    return valid;
  }

  solve(puzzleString) {
    // Check if the puzzle is valid
    if (this.validate(puzzleString) !== "valid") {
      return false;
    }
    // Check if the puzzle is finally solved
    if (!puzzleString.includes(".")) {
      return puzzleString;
    }
    // Find the first empty cell
    const puzzleArray = puzzleString.split("");
    const emptyIndex = puzzleArray.indexOf(".");
    const row = Math.floor(emptyIndex / 9);
    const col = emptyIndex % 9;
    // Try each value from 1 to 9
    for (let value = 1; value <= 9; value++) {
      if (
        this.checkRowPlacement(puzzleArray.join(""), row, col, value) &&
        this.checkColPlacement(puzzleArray.join(""), row, col, value) &&
        this.checkRegionPlacement(puzzleArray.join(""), row, col, value)
      ) {
        puzzleArray[emptyIndex] = value.toString();
        // Pass the new puzzle to the next recursion
        const result = this.solve(puzzleArray.join(""));
        // If get anything, return it
        if (result) {
          return result;
        }
        // If not, reset the value to "." and try the next value
        puzzleArray[emptyIndex] = ".";
      }
    }
    // If no value works, return nothing
  }
}

module.exports = SudokuSolver;
