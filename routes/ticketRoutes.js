const express = require('express');
const { Ticket } = require('../models');
const { Op } = require('sequelize');
const router = express.Router();

// Создать тикет
router.post('/create', async (req, res) => {
    const { subject, description } = req.body;
    try {
        const ticket = await Ticket.create({
            subject,
            description,
            status: 'Новый',
            createdAt: req.body.createdAt ? new Date(req.body.createdAt) : new Date(),
            updatedAt: new Date()
        });
        res.status(201).json(ticket);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при создании тикета' });
    }
});

// Взять тикет в работу
router.put('/take/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const ticket = await Ticket.findByPk(id);
        if (!ticket) {
            return res.status(404).json({ message: 'Тикет не найден' });
        }
        ticket.status = 'В работе';
        await ticket.save();
        res.status(200).json(ticket);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при взятии тикета в работу' });
    }
});

// Завершить тикет
router.put('/complete/:id', async (req, res) => {
    const { id } = req.params;
    const { resolutionText } = req.body;
    try {
        const ticket = await Ticket.findByPk(id);
        if (!ticket) {
            return res.status(404).json({ message: 'Тикет не найден' });
        }
        ticket.status = 'Завершено';
        ticket.resolutionText = resolutionText;
        await ticket.save();
        res.status(200).json(ticket);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при завершении тикета' });
    }
});

// Отменить тикет
router.put('/cancel/:id', async (req, res) => {
    const { id } = req.params;
    const { cancellationReason } = req.body;
    try {
        const ticket = await Ticket.findByPk(id);
        if (!ticket) {
            return res.status(404).json({ message: 'Тикет не найден' });
        }
        ticket.status = 'Отменено';
        ticket.cancellationReason = cancellationReason;
        await ticket.save();
        res.status(200).json(ticket);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при отмене тикета' });
    }
});

// Получить все тикеты по диапазону дат
router.get('/list', async (req, res) => {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        return res.status(400).json({ message: 'Необходимы startDate и endDate' });
    }

    try {
        const tickets = await Ticket.findAll({
            where: {
                createdAt: {
                    [Op.between]: [new Date(startDate), new Date(endDate)],
                },
            },
            order: [['createdAt', 'ASC']]  // <-- Ensuring order by date
        });
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении тикетов' });
    }
});



// Отменить все тикеты в работе
router.post('/cancel-all-in-progress', async (req, res) => {
    try {
        const ticketsInProgress = await Ticket.findAll({ where: { status: 'В работе' } });

        if (ticketsInProgress.length === 0) {
            return res.status(404).json({ message: 'Нет тикетов в работе' });
        }

        await Ticket.update({ status: 'Отменено' }, { where: { status: 'В работе' } });
        const updatedTickets = await Ticket.findAll({ where: { status: 'Отменено' } });
        return res.status(200).json(updatedTickets);

    } catch (error) {
        res.status(500).json({ message: 'Ошибка при отмене тикетов в работе' });
    }
});



module.exports = router;
