const request = require('supertest');
const app = require('../app');
const sequelize = require('../db');

beforeAll(async () => {
    await sequelize.sync({ force: true });
});

describe('Ticket API Endpoints', () => {
    it('should create a new ticket', async () => {
        const response = await request(app)
            .post('/api/tickets/create')
            .send({ subject: 'Test Ticket', description: 'This is a test' });

        expect(response.statusCode).toBe(201);
        expect(response.body.subject).toBe('Test Ticket');
    });

    it('should take a ticket in progress', async () => {
        const response = await request(app).put('/api/tickets/take/1');
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe('В работе');
    });

    it('should complete a ticket', async () => {
        const response = await request(app)
            .put('/api/tickets/complete/1')
            .send({ resolutionText: 'Resolved successfully' });

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe('Завершено');
    });

    it('should cancel a ticket', async () => {
        const response = await request(app)
            .put('/api/tickets/cancel/1')
            .send({ cancellationReason: 'No longer needed' });

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe('Отменено');
    });

    it('should cancel all tickets in progress', async () => {
        await request(app).post('/api/tickets/create').send({ subject: 'Another Ticket', description: 'Test' });
        await request(app).put('/api/tickets/take/2');
        const response = await request(app).put('/api/tickets/cancel-all-in-progress');

        expect(response.statusCode).toBe(200);
    });

    it('should filter tickets by date range', async () => {
        // Создаем два обращения с разными датами
        await request(app).post('/api/tickets/create').send({ subject: 'Old Ticket', description: 'Old ticket description' });
        await request(app).post('/api/tickets/create').send({ subject: 'New Ticket', description: 'New ticket description' });

        // Получаем все обращения в диапазоне
        const response = await request(app).get('/api/tickets/list?startDate=2025-05-01&endDate=2025-05-31');

        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBeGreaterThanOrEqual(1);
        expect(response.body.some(ticket => ticket.subject === 'New Ticket')).toBe(true);
    });
});
""
