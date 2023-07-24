const db = require('./db')

class BookController {
    // Добавляем новую книгу в БД
    async createBook(req, res) {
        const {name} = req.body;
        const newBook = await db.query('INSERT INTO books(name) VALUES ($1) RETURNING *', [name]);
        res.json(newBook.rows[0]);
    }
    // Достаём одну книгу из БД
    async getBook(req, res) {
        const id = req.params.id;
        const book = await db.query('SELECT * FROM books WHERE id = $1', [id]);
        res.json(book.rows[0])
    }
    // Достаём все книги из БД
    async getAllBooks(req, res) {
        const book = await db.query('SELECT * FROM books');
        res.json(book.rows)
    }
    // Обновляем данные книги из БД
    async updateBook(req, res) {
        const {id, name} = req.body;
        const book = await db.query('UPDATE books SET name = $1 WHERE id = $2 RETURNING *', [name, id]);
        res.json(book.rows[0]);
    }
    // Удаляем книгу из БД
    async deleteBook(req, res) {
        const id = req.params.id;
        const book = await db.query('DELETE FROM books WHERE id = $1', [id]);
        res.send("Succesfully deleted");
    }
}

module.exports = new BookController();