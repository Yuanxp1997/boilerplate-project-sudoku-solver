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
    return !rowValues.includes(value);
  }

  checkColPlacement(puzzleString, row, column, value) {}

  checkRegionPlacement(puzzleString, row, column, value) {}

  solve(puzzleString) {}
}

module.exports = SudokuSolver;
