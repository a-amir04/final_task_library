const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./db');

const authRouter = express.Router();
const {secret} = require("./config")
// Регистрация пользователя
authRouter.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Проверка, что пользователь с таким именем не существует
    const checkUserQuery = 'SELECT * FROM users WHERE username = $1';
    const checkUserValues = [username];
    const user = await pool.query(checkUserQuery, checkUserValues);

    if (user.rows.length > 0) {
      return res.status(400).json({ message: 'Пользователь уже существует' });
    }

    // Хеширование пароля
    const saltRounds = 5;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Создание нового пользователя
    const createUserQuery = 'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id';
    const createUserValues = [username, hashedPassword];
    const newUser = await pool.query(createUserQuery, createUserValues);

    // Создание JWT-токена
    const token = jwt.sign({ id: newUser.rows[0].id }, secret);

    res.json({ token });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Авторизация пользователя
authRouter.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Проверка, что пользователь существует
    const checkUserQuery = 'SELECT * FROM users WHERE username = $1';
    const checkUserValues = [username];
    const user = await pool.query(checkUserQuery, checkUserValues);

    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Неверное имя пользователя или пароль' });
    }

    // Проверка пароля
    const isPasswordValid = await bcrypt.compare(password, user.rows[0].password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Неверное имя пользователя или пароль' });
    }

    // Создание JWT-токена
    const token = jwt.sign({ id: user.rows[0].id }, secret);
    res.json({ token });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = authRouter;