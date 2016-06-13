"use strict";

const express = require('express');
const colors = require('colors');

const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.json());

const logger = function (req, res, next) {
  console.log(colors.blue(new Date().toLocaleString()) + " : " + colors.green(req.method) + " : " + req.url);

  next();
};

app.use(logger);

app.use(express.static('public'));

app.use('/static', express.static(__dirname + '/node_modules/jquery/dist/'));

const port = 5000;

app.listen(port, function () {
  console.log(
    colors.red(new Date().toLocaleString()) + " : " +
    colors.cyan('Running on port: ' + port)
  );

});
