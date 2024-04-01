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
    let puzzle = puzzlesAndSolutions[0][0].slice(1);
    assert.equal(
      solver.validate(puzzle),
      "Expected puzzle to be 81 characters long"
    );
  });

  //Logic handles a valid row placement
  test("Logic handles a valid row placement", function () {
    let puzzle = puzzlesAndSolutions[0][0];
    assert.isTrue(solver.checkRowPlacement(puzzle, 0, 1, 3));
  });

  //Logic handles an invalid row placement
  test("Logic handles an invalid row placement", function () {
    let puzzle = puzzlesAndSolutions[0][0];
    assert.isFalse(solver.checkRowPlacement(puzzle, 0, 0, 5));
  });

  //Logic handles a valid column placement
  test("Logic handles a valid column placement", function () {
    let puzzle = puzzlesAndSolutions[0][0];
    assert.isTrue(solver.checkColPlacement(puzzle, 0, 1, 3));
  });

  //Logic handles an invalid column placement
  test("Logic handles an invalid column placement", function () {
    let puzzle = puzzlesAndSolutions[0][0];
    assert.isFalse(solver.checkColPlacement(puzzle, 1, 0, 1));
  });

  //Logic handles a valid region (3x3 grid) placement
  test("Logic handles a valid region (3x3 grid) placement", function () {
    let puzzle = puzzlesAndSolutions[0][0];
    assert.isTrue(solver.checkRegionPlacement(puzzle, 0, 0, 3));
    assert.isTrue(solver.checkRegionPlacement(puzzle, 5, 5, 5));
  });

  //Logic handles an invalid region (3x3 grid) placement
  test("Logic handles an invalid region (3x3 grid) placement", function () {
    let puzzle = puzzlesAndSolutions[0][0];
    assert.isFalse(solver.checkRegionPlacement(puzzle, 0, 0, 1));
    assert.isFalse(solver.checkRegionPlacement(puzzle, 5, 5, 3));
  });

  //Valid puzzle strings pass the solver
  test("Valid puzzle strings pass the solver", function () {
    let puzzle = puzzlesAndSolutions[0][0];
    let result = solver.solve(puzzle);
    assert.isString(result);
    assert.notInclude(result, ".");
    assert.lengthOf(result, 81);
    assert.match(result, /^[1-9]+$/);
  });
  //Invalid puzzle strings fail the solver
  test("Invalid puzzle strings fail the solver", function () {
    let puzzle = puzzlesAndSolutions[0][0].replace("1", "A");
    assert.isFalse(solver.solve(puzzle));
  });

  //Solver returns the expected solution for an incomplete puzzle
  test("Solver returns expected solution", function () {
    for (let i = 0; i < puzzlesAndSolutions.length; i++) {
      let puzzle = puzzlesAndSolutions[i][0];
      let solution = puzzlesAndSolutions[i][1];
      assert.equal(solver.solve(puzzle), solution);
    }
  });
});
