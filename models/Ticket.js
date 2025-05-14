const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Ticket = sequelize.define('Ticket', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Новое', 'В работе', 'Завершено', 'Отменено'),
        defaultValue: 'Новое',
    },
    resolutionText: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    cancellationReason: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
});

module.exports = Ticket;
