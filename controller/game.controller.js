const express = require('express');
const router = express.Router();
const gameService = require('../service/game.service');
const userService = require('../service/user.service');
const sendError = require('../util/sendError');

router.route('/')
  // Get all Games 
  .get((req, res, next) => gameService.getAllGames()
    .then(games => res.status(200).send(games))
    .catch(error => sendError(res)(error)))
  // Save a Game 
  .post((req, res, next) =>
    gameService.saveGame(req.body)
      .then(games => res.status(200).send(games))
      .catch(error => sendError(res)(error)));

router.route('/:gameId')
  // Get Game by gameId 
  .get((req, res, next) => gameService.getGameByGameId(req.params.gameId)
    .then(game => res.status(200).send(game))
    .catch(error => sendError(res)(error)))
  // Delete a Game by gameId TODO
  .delete((req, res, next) => gameService.deleteGameByGameId(req.params.gameId)
    .then(game => res.status(200).send(game))
    .catch(error => sendError(res)(error)));

router.route('/:gameId/user')
  // Get all Users who have Game with gameId 
  .get((req, res, next) => userService.getAllWithGame(req.params.gameId)
    .then(users => res.status(200).send(users))
    .catch(error => sendError(res)(error)));

module.exports = router;
