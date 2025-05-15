const request = require('supertest');
const app = require('../app');
const { Ticket } = require('../models');

describe('Ticket API Endpoints', () => {

    // Clear the database before each test and create sample tickets
    beforeEach(async () => {
        await Ticket.destroy({ where: {} }); // Clear the table

        // Create tickets with different statuses for testing
        await Ticket.bulkCreate([
            {
                id: 1,
                subject: 'New Ticket',
                description: 'In progress ticket',
                status: 'В работе',
                createdAt: new Date('2025-01-01'),
                updatedAt: new Date()
            },
            {
                id: 2,
                subject: 'Ticket 2',
                description: 'Another in progress ticket',
                status: 'В работе',
                createdAt: new Date('2025-02-01'),
                updatedAt: new Date()
            },
            {
                id: 3,
                subject: 'Ticket 3',
                description: 'New ticket',
                status: 'Новый',
                createdAt: new Date('2025-03-01'),
                updatedAt: new Date()
            }
        ]);
    });

    it('should create a new ticket', async () => {
        const response = await request(app)
            .post('/api/tickets/create')
            .send({ subject: 'Test Ticket', description: 'This is a test' });

        expect(response.statusCode).toBe(201);
        expect(response.body.subject).toBe('Test Ticket');
    });

    it('should take a ticket in progress', async () => {
        const response = await request(app)
            .put('/api/tickets/take/1');

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
        const cancelAllResponse = await request(app)
            .post('/api/tickets/cancel-all-in-progress');

        expect(cancelAllResponse.statusCode).toBe(200);
        expect(cancelAllResponse.body.length).toBeGreaterThan(0);
        expect(cancelAllResponse.body[0].status).toBe('Отменено');
    });

    it('should filter tickets by date range', async () => {
        await request(app)
            .post('/api/tickets/create')
            .send({
                subject: 'Old Ticket',
                description: 'Old ticket description',
                createdAt: '2025-01-01'
            });

        await request(app)
            .post('/api/tickets/create')
            .send({
                subject: 'New Ticket',
                description: 'New ticket description',
                createdAt: '2025-12-01'
            });

        const response = await request(app)
            .get('/api/tickets/list')
            .query({ startDate: '2025-01-01', endDate: '2025-12-31' });

        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(5);
        expect(response.body[0].subject).toBe('New Ticket');
        expect(response.body[1].subject).toBe('Old Ticket');
    });
});
""
