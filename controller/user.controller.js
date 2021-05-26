const express = require('express');
const router = express.Router();
const userService = require('../service/user.service');
const sendError = require('../util/sendError');

router.route('/')
  // Get all Users 
  .get((req, res, next) => userService.getAllUsers(req.body)
    .then(user => res.status(200).send(user))
    .catch(error => sendError(res)(error)))
  // Save a User 
  .post((req, res) => userService.saveUser(req.body)
    .then(user => res.status(201).send(user))
    .catch(error => sendError(res)(error)));

router.route('/:discordId')
  // Get a User by Discord Id 
  .get((req, res) => userService.getUserByDiscordId(req.params.discordId)
    .then(user => res.status(200).send(user))
    .catch(error => sendError(res)(error)));

router.route('/:discordId/add-game')
  // Add a Game to a User
  .post((req, res) => {
    const { discordId: discordId } = req.params;
    const { gameId } = req.body;
    userService.addGameToUser(discordId, gameId)
      .then(user => res.status(200).send(user))
      .catch(error => sendError(res)(error));
  });

module.exports = router;
