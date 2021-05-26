const gameRepository = require('../pg/game.repo');
const validate = require('../util/validation');
const { notFound } = require('../error/httpError');

const getAllGames = _ => new Promise((resolve, reject) =>
    gameRepository.getAll()
        .then(games => resolve(games))
        .catch(error => reject(error))
);

const saveGame = game => new Promise((resolve, reject) => {
    validate.game(game)(
        game => {
            gameRepository.save(game.gameId, game.name)
                .then(savedGame => resolve(savedGame || { ...game, isActive: true }))
                .catch(error => reject(error));
        },
        error => reject(error))
        .catch(error => reject(error))
});

// TODO: Add request validation to all 
const getGamesByDiscordId = discordId => new Promise((resolve, reject) => {
    gameRepository.getByDiscordId(discordId)
        .then(games => resolve(games))
        .catch(error => reject(error));
});

const getGameByGameId = gameId => new Promise((resolve, reject) => {
    gameRepository.getByGameId(gameId)
        .then(game => Object.keys(game).length !== 0 ? resolve(game) : reject(notFound('Game')))
        .catch(error => reject(error));
});

const deleteGameByGameId = gameId => new Promise((resolve, reject) => {
    gameRepository.deleteByGameId(gameId)
        .then(game => Object.keys(game).length !== 0 ? resolve(game) : reject(notFound('Game')))
        .catch(error => reject(error));
});

const gameService = {
    saveGame,
    getAllGames,
    getGamesByDiscordId,
    getGameByGameId,
    deleteGameByGameId,
};

module.exports = gameService;