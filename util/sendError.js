const sendError = (res) => (error) =>
    res.status(error.httpCode || 500)
        .send(error.description || error.message || 'Internal Server Error');

module.exports = sendError;