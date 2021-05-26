const { query, getAll, getOne } = require('./pool');

const userQueries = {
    save: 'INSERT INTO discord_user (discord_id, name, discriminator) VALUES ($1, $2, $3) RETURNING discord_id, name, discriminator',
    getAll: 'SELECT discord_id, name, discriminator FROM discord_user',
    getByDiscordId: 'SELECT discord_id, name, discriminator from discord_user WHERE discord_id = $1',
    getAllWithGame: `SELECT u.name, u.discriminator, u.discord_id FROM discord_user u 
                        JOIN user_game ug ON u.id = ug.user_id
                        JOIN game g ON ug.game_id = g.id
                        WHERE g.game_id = $1`,
    addGameToUser: `INSERT INTO user_game (user_id, game_id) VALUES
                        ((SELECT id from discord_user where discord_id = $1),
                        (SELECT id from game where game_id = $2))`,
};

const userMapping = {
    name: 'name',
    discriminator: 'discriminator',
    discord_id: 'discordId',
}

const getOneUser = getOne(userMapping);
const getAllUsers = getAll(userMapping);

const userRepository = {
    save: (...args) => query(userQueries.save, args).then(results => getOneUser(results)),
    getAll: _ => query(userQueries.getAll).then(results => getAllUsers(results)),
    getByDiscordId: id => query(userQueries.getByDiscordId, [id]).then(results => getOneUser(results)),
    getAllWithGame: gameId => query(userQueries.getAllWithGame, [gameId]).then(results => getAllUsers(results)),
    addGameToUser: (discordId, gameId) => query(userQueries.addGameToUser, [discordId, gameId]).then(results => results),
};

module.exports = userRepository;