const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");
const puzzleAndSolutions =
  require("../controllers/puzzle-strings").puzzlesAndSolutions;

chai.use(chaiHttp);

suite("Functional Tests", () => {
  //Solve a puzzle with valid puzzle string: POST request to /api/solve
  test("Solve a puzzle with valid puzzle string: POST request to /api/solve", function (done) {
    chai
      .request(server)
      .post("/api/solve")
      .send({
        puzzle:
          "53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(
          res.body.solution,
          "534678912672195348198342567859761423426853791713924856961537284287419635345286179"
        );
        done();
      });
  });

  //Solve a puzzle with missing puzzle string: POST request to /api/solve
  test("Solve a puzzle with missing puzzle string: POST request to /api/solve", function (done) {
    chai
      .request(server)
      .post("/api/solve")
      .send({})
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Required field missing");
        done();
      });
  });

  //Solve a puzzle with invalid characters: POST request to /api/solve
  test("Solve a puzzle with invalid characters: POST request to /api/solve", function (done) {
    chai
      .request(server)
      .post("/api/solve")
      .send({
        puzzle:
          "53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..7A",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Invalid characters in puzzle");
        done();
      });
  });

  //Solve a puzzle with incorrect length: POST request to /api/solve
  test("Solve a puzzle with incorrect length: POST request to /api/solve", function (done) {
    chai
      .request(server)
      .post("/api/solve")
      .send({
        puzzle:
          "53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(
          res.body.error,
          "Expected puzzle to be 81 characters long"
        );
        done();
      });
  });

  //Solve a puzzle that cannot be solved: POST request to /api/solve
  test("Solve a puzzle that cannot be solved: POST request to /api/solve", function (done) {
    chai
      .request(server)
      .post("/api/solve")
      .send({
        puzzle:
          "53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....89979",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Puzzle cannot be solved");
        done();
      });
  });

  //Check a puzzle placement with all fields: POST request to /api/check
  test("Check a puzzle placement with all fields: POST request to /api/check", function (done) {
    let puzzle = puzzleAndSolutions[0][0];
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: puzzle,
        coordinate: "A2",
        value: "3",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, true);
        done();
      });
  });

  //Check a puzzle placement with single placement conflict: POST request to /api/check
  test("Check a puzzle placement with single placement conflict: POST request to /api/check", function (done) {
    let puzzle = puzzleAndSolutions[0][0];
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: puzzle,
        coordinate: "A2",
        value: "7",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, false);
        assert.equal(res.body.conflict.length, 1);
        done();
      });
  });

  //Check a puzzle placement with multiple placement conflicts: POST request to /api/check
  test("Check a puzzle placement with multiple placement conflicts: POST request to /api/check", function (done) {
    let puzzle = puzzleAndSolutions[0][0];
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: puzzle,
        coordinate: "A2",
        value: "1",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, false);
        assert.equal(res.body.conflict.length, 2);
        done();
      });
  });

  //Check a puzzle placement with all placement conflicts: POST request to /api/check
  test("Check a puzzle placement with all placement conflicts: POST request to /api/check", function (done) {
    let puzzle = puzzleAndSolutions[0][0];
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: puzzle,
        coordinate: "A2",
        value: "2",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, false);
        assert.equal(res.body.conflict.length, 3);
        done();
      });
  });

  //Check a puzzle placement with missing required fields: POST request to /api/check
  test("Check a puzzle placement with missing required fields: POST request to /api/check", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({
        coordinate: "A2",
        value: "2",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Required field(s) missing");
        done();
      });
  });

  //Check a puzzle placement with invalid characters: POST request to /api/check
  test("Check a puzzle placement with invalid characters: POST request to /api/check", function (done) {
    let puzzle = puzzleAndSolutions[0][0];
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: puzzle,
        coordinate: "A2",
        value: "A",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Invalid value");
        done();
      });
  });

  //Check a puzzle placement with incorrect length: POST request to /api/check
  test("Check a puzzle placement with incorrect length: POST request to /api/check", function (done) {
    let puzzle = puzzleAndSolutions[0][0];
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: puzzle + "1",
        coordinate: "A2",
        value: "2",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(
          res.body.error,
          "Expected puzzle to be 81 characters long"
        );
        done();
      });
  });

  //Check a puzzle placement with invalid placement coordinate: POST request to /api/check
  test("Check a puzzle placement with invalid placement coordinate: POST request to /api/check", function (done) {
    let puzzle = puzzleAndSolutions[0][0];
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: puzzle,
        coordinate: "A10",
        value: "2",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Invalid coordinate");
        done();
      });
  });

  //Check a puzzle placement with invalid placement value: POST request to /api/check
  test("Check a puzzle placement with invalid placement value: POST request to /api/check", function (done) {
    let puzzle = puzzleAndSolutions[0][0];
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle: puzzle,
        coordinate: "A2",
        value: "10",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Invalid value");
        done();
      });
  });
});
