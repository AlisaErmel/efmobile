const { Sequelize } = require('sequelize');
const TicketModel = require('./Ticket'); // Import the Ticket model function

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite3',
});

const Ticket = TicketModel(sequelize); // Call the function to define the Ticket model

module.exports = { sequelize, Ticket };
