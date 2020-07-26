const execa = require("execa");
const express = require("express");
const { body, validationResult } = require("express-validator");
const Raven = require("raven");
const path = require("path");

const app = express();

if (process.env.SENTRY_DSN) {
  // The request handler must be the first middleware on the app
  app.use(Raven.requestHandler());
}

app.use(express.json());

const apiValidators = [
  body("input").not().isEmpty(),
  body("output").not().isEmpty(),
];

app.post("/convert", apiValidators, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, error: errors.array() });
  }

  const args = ["-o", req.body.output, req.body.input];

  try {
    const { all } = await execa(
      path.resolve(__dirname, "../bin/engrafo"),
      args,
      { all: true }
    );
    res.json({ success: true, logs: all });
  } catch (err) {
    // Some other error
    if (err.exitCode === undefined || err.all === undefined) {
      throw err;
    }
    res
      .status(500)
      .json({ success: false, logs: err.all, exitCode: err.exitCode });
  }
});

if (process.env.SENTRY_DSN) {
  // The error handler must be before any other error middleware
  app.use(Raven.errorHandler());
}

module.exports.app = app;
