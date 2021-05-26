const { notFound } = require('../error/httpError')
const userRepository = require('../pg/user.repo');
const gameRepository = require('../pg/game.repo');
const gameService = require('./game.service');
const validate = require('../util/validation');
const { getGamesByDiscordId, getGameByGameId } = require('./game.service');

const getAllUsers = _ => new Promise((resolve, reject) =>
    userRepository.getAll()
        .then(users => {
            gameRepository.getAllMappedToDiscordId()
                .then(gameMap => resolve(mapGamesToUsers(users)(gameMap)));
        })
        .catch(error => reject(error))
);

const saveUser = user => new Promise((resolve, reject) => {
    validate.user(user)(
        user => {
            const { discordId, name, discriminator } = user;
            userRepository.save([discordId, name, discriminator])
                .then(savedUser => resolve(savedUser || user)) // TODO: Figure out why user isn't returned
                .catch(error => reject(error));
        },
        error => reject(error))
});

const getUserByDiscordId = (discordId) => new Promise((resolve, reject) => {
    validate.discordId(discordId)(
        validatedId => retrieveUser(validatedId)
            .then(user => resolve(user))
            .catch(error => reject(error)))
        .catch(error => reject(error));
});

const addGameToUser = (discordId, gameId) => new Promise((resolve, reject) => {
    validate.addGameRequest(discordId, gameId)(gameRequest =>
        retrieveUser(gameRequest.discordId)
            .then(user => getGameByGameId(gameId)
                .then(game => userRepository.addGameToUser(user.discordId, game.gameId)
                    .then(_ => resolve(getUserByDiscordId(discordId)))
                    .catch(error => reject(error)))
                .catch(error => reject(error)))
            .catch(error => reject(error)))
        .catch(error => reject(error));
});

const getAllWithGame = gameId => new Promise((resolve, reject) =>
    validate.gameId(gameId)(gameId =>
        gameService.getGameByGameId(gameId)
            .then(userRepository.getAllWithGame(gameId)
                .then(users => resolve(users))
                .catch(error => reject(error)))
            .catch(error => reject(error)))
        .catch(error => reject(error)));

const mapGamesToUsers = users => gameMap => {
    const arr = []
    users.map(u => arr.push({ ...u, games: gameMap[u.discordId] }))
    return arr;
};

const retrieveUser = id => new Promise((resolve, reject) =>
    userRepository.getByDiscordId(id)
        .then(user => {
            if (!user) throw notFound('User with id: ' + id);
            getGamesByDiscordId(id)
                .then(games => resolve({ ...user, games }))
                .catch(error => reject(error));
        }).catch(error => reject(error)));

const userService = {
    saveUser,
    getAllUsers,
    getUserByDiscordId,
    addGameToUser,
    getAllWithGame,
};

module.exports = userService;