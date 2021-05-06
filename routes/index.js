const router = require('express').Router();
const userRouter = require('./users');
const moviesRouter = require('./movies');
const NotFoundError = require('../utils/notfound-error.js');

router.use('/', userRouter);
router.use('/', moviesRouter);
router.use('/*', () => {
    throw new NotFoundError('Страница не найдена');
});

module.exports = router;