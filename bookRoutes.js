const Router = require('express');
const router = new Router();
const controller = require('./bookController');
const authMiddleware = require('./authMiddleware');

router.post('/book', authMiddleware, controller.createBook);
router.get('/book/:id', authMiddleware, controller.getBook);
router.get('/book', authMiddleware, controller.getAllBooks);
router.put('/book', authMiddleware, controller.updateBook);
router.delete('/book/:id', authMiddleware, controller.deleteBook);

module.exports = router