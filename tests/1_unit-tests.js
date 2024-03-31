const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
const puzzlesAndSolutions =
  require("../controllers/puzzle-strings.js").puzzlesAndSolutions;
let solver = new Solver();

suite("Unit Tests", () => {
  //Logic handles a valid puzzle string of 81 characters
  test("Logic handles a valid puzzle string of 81 characters", function () {
    for (let i = 0; i < puzzlesAndSolutions.length; i++) {
      assert.equal(solver.validate(puzzlesAndSolutions[i][0]), "valid");
    }
  });

  //Logic handles a puzzle string with invalid characters (not 1-9 or .)
  test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", function () {
    for (let i = 0; i < puzzlesAndSolutions.length; i++) {
      let puzzle = puzzlesAndSolutions[i][0].replace("1", "A");
      assert.equal(solver.validate(puzzle), "Invalid characters in puzzle");
    }
  });

  //Logic handles a puzzle string that is not 81 characters in length
  test("Logic handles a puzzle string that is not 81 characters in length", function () {
    for (let i = 0; i < puzzlesAndSolutions.length; i++) {
      let puzzle = puzzlesAndSolutions[i][0].slice(0, 80);
      assert.equal(
        solver.validate(puzzle),
        "Expected puzzle to be 81 characters long"
      );
    }
  });

  //Logic handles a valid row placement
  test("Logic handles a valid row placement", function () {
    for (let i = 0; i < puzzlesAndSolutions.length; i++) {
      let puzzle = puzzlesAndSolutions[i][0];
      for (let j = 0; j < 9; j++) {
        assert.equal(solver.checkRowPlacement(puzzle, 0, j, puzzle[j]), true);
      }
    }
  });
});
