"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    const puzzle = req.body.puzzle;
    const coordinate = req.body.coordinate;
    const value = req.body.value;
    // Check for missing fields
    if (!puzzle || !coordinate || !value) {
      return res.json({ error: "Required field(s) missing" });
    }
    // Check for invalid puzzle
    const valid = solver.validate(puzzle);
    if (valid !== "valid") {
      return res.json({ error: valid });
    }
    // Check for invalid coordinate
    if (!/^[A-I][1-9]$/.test(coordinate)) {
      return res.json({ error: "Invalid coordinate" });
    }
    // Check for invalid value
    if (!/^[1-9]$/.test(value)) {
      return res.json({ error: "Invalid value" });
    }
    const row = coordinate[0].charCodeAt(0) - "A".charCodeAt(0);
    const col = parseInt(coordinate.slice(1)) - 1;

    // check if the coordinate is already filled with the value
    if (puzzle[row * 9 + col] === value) {
      return res.json({ valid: true });
    }
    const conflict = [];
    if (!solver.checkRowPlacement(puzzle, row, col, value)) {
      conflict.push("row");
    }
    if (!solver.checkColPlacement(puzzle, row, col, value)) {
      conflict.push("column");
    }
    if (!solver.checkRegionPlacement(puzzle, row, col, value)) {
      conflict.push("region");
    }
    if (conflict.length === 0) {
      return res.json({ valid: true });
    }
    res.json({ valid: false, conflict });
  });

  app.route("/api/solve").post((req, res) => {
    const puzzle = req.body.puzzle;
    if (!puzzle) {
      return res.json({ error: "Required field missing" });
    }
    const valid = solver.validate(puzzle);
    if (valid !== "valid") {
      return res.json({ error: valid });
    }
    const solution = solver.solve(puzzle);
    if (!solution) {
      return res.json({ error: "Puzzle cannot be solved" });
    }
    res.json({ solution });
  });
};
