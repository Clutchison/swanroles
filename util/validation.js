const { Validator } = require('node-input-validator');
const { badRequest } = require('../error/httpError');

const rules = {
    discordId: 'required|minLength:17|maxLength:18|numeric',
    gameId: ['required', ['regex', '^[a-z-]+$']]
}

const validate = {
    user: user =>
        runValidation(new Validator(
            user,
            {
                discordId: rules.discordId,
                name: 'required|maxLength:32',
                discriminator: 'required|numeric'
            },
        )),
    game: game =>
        runValidation(new Validator(
            game,
            {
                gameId: rules.gameId,
                name: 'required|minLength:2|maxLength:50',
            }
        )),
    discordId: discordId =>
        runValidation(new Validator(
            { discordId },
            {
                discordId: rules.discordId,
            },
        )),
    addGameRequest: (discordId, gameId) =>
        runValidation(new Validator(
            { discordId, gameId },
            {
                discordId: rules.discordId,
                gameId: rules.gameId,
            },
        )),
        gameId: gameId => 
        runValidation(new Validator(
            { gameId },
            {
                gameId: rules.gameId,
            }
        ))
}

const runValidation = validator => success =>
    validator.check().then(matches => {
        if (matches) {
            const keys = Object.keys(validator.inputs);
            success(keys.length == 1 ?
                validator.inputs[keys[0]] :
                validator.inputs)
        }
        else throw badRequest(validator.errors)
    });

module.exports = validate;
