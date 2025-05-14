const Ticket = require('../models/Ticket');
const { Op } = require('sequelize');

module.exports = {
    // 1. Создать обращение
    createTicket: async (req, res) => {
        const { subject, description } = req.body;
        try {
            const ticket = await Ticket.create({ subject, description });
            res.status(201).json(ticket);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // 2. Взять в работу
    takeTicket: async (req, res) => {
        const { id } = req.params;
        try {
            const ticket = await Ticket.findByPk(id);
            if (!ticket) return res.status(404).json({ message: "Обращение не найдено" });

            ticket.status = 'В работе';
            await ticket.save();
            res.status(200).json(ticket);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // 3. Завершить обработку
    completeTicket: async (req, res) => {
        const { id } = req.params;
        const { resolutionText } = req.body;
        try {
            const ticket = await Ticket.findByPk(id);
            if (!ticket) return res.status(404).json({ message: "Обращение не найдено" });

            ticket.status = 'Завершено';
            ticket.resolutionText = resolutionText;
            await ticket.save();
            res.status(200).json(ticket);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // 4. Отмена обращения
    cancelTicket: async (req, res) => {
        const { id } = req.params;
        const { cancellationReason } = req.body;
        try {
            const ticket = await Ticket.findByPk(id);
            if (!ticket) return res.status(404).json({ message: "Обращение не найдено" });

            ticket.status = 'Отменено';
            ticket.cancellationReason = cancellationReason;
            await ticket.save();
            res.status(200).json(ticket);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // 5. Получить список с фильтрацией по дате
    getTickets: async (req, res) => {
        const { startDate, endDate } = req.query;
        const filter = {};

        if (startDate && endDate) {
            filter.createdAt = {
                [Op.between]: [new Date(startDate), new Date(endDate)],
            };
        }

        try {
            const tickets = await Ticket.findAll({ where: filter });
            res.status(200).json(tickets);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // 6. Отмена всех обращений в статусе "В работе"
    cancelAllInProgress: async (req, res) => {
        try {
            await Ticket.update(
                { status: 'Отменено', cancellationReason: 'Массовая отмена' },
                { where: { status: 'В работе' } }
            );
            res.status(200).json({ message: "Все обращения в работе отменены" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};
