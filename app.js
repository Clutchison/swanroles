const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const sendError = require('./util/sendError')
const { notFound } = require('./error/httpError');

// Import routers
const indexRouter = require('./controller/index.controller');
const usersRouter = require('./controller/user.controller');
const gameRouter = require('./controller/game.controller');

const app = express();

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Controller routing
app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/game', gameRouter);

// Handle bad paths
app.use((req, res, next) => sendError(res)(notFound(req.path)));

module.exports = app;
