const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');

// Endpoints
router.post('/create', ticketController.createTicket);
router.put('/take/:id', ticketController.takeTicket);
router.put('/complete/:id', ticketController.completeTicket);
router.put('/cancel/:id', ticketController.cancelTicket);
router.get('/list', ticketController.getTickets);
router.put('/cancel-all-in-progress', ticketController.cancelAllInProgress);

module.exports = router;