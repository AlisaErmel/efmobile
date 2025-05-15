// Imports
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const ticketRoutes = require('./routes/ticketRoutes');
const { sequelize } = require('./models');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/tickets', ticketRoutes);

// Sync database and start server (if not in test mode)
(async () => {
    try {
        await sequelize.sync();
        console.log("Database synced successfully.");

        if (process.env.NODE_ENV !== 'test') {
            app.listen(PORT, () => {
                console.log(`Server is running on http://localhost:${PORT}`);
            });
        }
    } catch (error) {
        console.error("Database sync failed:", error.message);
    }
})();

// Export the app for testing
module.exports = app;
