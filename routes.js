const express = require("express");
const Router = express.Router();

Router.get("/api/alarmList", (req, res) => {
  res.send(listOfAlarms);
});
module.exports = Router;
