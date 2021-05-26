const { game } = require('../util/validation');
const { query, getAll, getOne } = require('./pool');

// TODO: Properly handle duplicate key constraints
const queries = {
    save: 'INSERT INTO game (game_id, name, active) VALUES ($1, $2, true) RETURNING game_id, name, active',
    getAll: 'SELECT game_id, active, name FROM game',
    getByGameId: 'SELECT game_id, active, name FROM game WHERE game_id = $1',
    deleteByGameId: 'DELETE FROM game WHERE game_id = $1 RETURNING game_id, name, active',
    getByDiscordId: `SELECT g.game_id, g.active, g.name FROM game g
                        INNER JOIN user_game ug ON ug.game_id = g.id
                        INNER JOIN discord_user u ON ug.user_id = u.id
                        WHERE u.discord_id = $1`,
    getAllJoinDiscordId: `SELECT g.game_id, g.active, g.name, u.discord_id FROM game g
                        INNER JOIN user_game ug ON ug.game_id = g.id
                        INNER JOIN discord_user u ON ug.user_id = u.id`,
};

const gameMapping = {
    game_id: 'gameId',
    active: 'active',
    name: 'name',
};

const gameDiscordIdMapping = {
    ...gameMapping,
    discord_id: 'discordId',
}

const getOneGame = getOne(gameMapping);
const getAllGames = getAll(gameMapping);

const gameRepository = {
    save: (...args) => query(queries.save, args).then(results => getOneGame(results)),
    getAll: _ => query(queries.getAll).then(results => getAllGames(results)),
    getByDiscordId: id => query(queries.getByDiscordId, [id]).then(results => getAllGames(results)),
    getByGameId: id => query(queries.getByGameId, [id]).then(results => getOneGame(results)),
    deleteByGameId: id => query(queries.deleteByGameId, [id]).then(results => getOneGame(results)),
    getAllMappedToDiscordId: _ => query(queries.getAllJoinDiscordId)
        .then(results => getAll(gameDiscordIdMapping)(results).reduce(mapGamesToDiscordId, {})),
};

const mapGamesToDiscordId = (acc, row) => {
    const game = { gameId: row.gameId, active: row.active, game: row.name };
    const array = acc[row.discordId] || [];
    const obj = { ...acc };
    obj[row.discordId] = [...array, game];
    return obj;
};

module.exports = gameRepository;