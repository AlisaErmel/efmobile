const { Sequelize } = require('sequelize');

// Настройки базы данных (SQLite)
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'
});

module.exports = sequelize;
