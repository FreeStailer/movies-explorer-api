function centralErrorsHandler(err, req, res, next) {
    const { statusCode = 500, message } = err;

    res.status(statusCode).send({
        message: statusCode === 500 ? `На сервере беда, ошибка ${err}` : message,
    });
}

module.exports = centralErrorsHandler;