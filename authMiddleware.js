const jwt = require('jsonwebtoken');
const {secret} = require('./config')

// Middleware для проверки авторизации
const authMiddleware = (req, res, next) => {
  // Получение JWT-токена из заголовка Authorization
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Отсутствует токен авторизации' });
  }

  try {
    // Проверка и декодирование JWT-токена
    const decoded = jwt.verify(token, secret);

    // Добавление информации о пользователе в объект запроса
    req.user = decoded;

    // Переход к следующему middleware или обработке маршрута
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Недействительный токен авторизации' });
  }
};

module.exports = authMiddleware;