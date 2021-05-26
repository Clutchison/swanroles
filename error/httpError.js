const errFact = (name, httpCode, description) => {
    const err = {
        name,
        httpCode,
        description,
    };
    Error.call(err);
    Error.captureStackTrace(err);
    return err;
}

const httpError = {
    badRequest: (description) => errFact('Bad Request', 400, description),
    notFound: (item) => errFact('Not Found', 404, item + ' not found'),
    conflict: (description) => errFact('Conflict', 409, description),
    internalServerError: (description) => errFact('Internal Server Error', 500, description),
};

module.exports = httpError;
