const express = require('express');
const app = express();
const ticketRoutes = require('./routes/ticketRoutes');
const sequelize = require('./db'); // Настроенное подключение к БД

app.use(express.json());
app.use('/api/tickets', ticketRoutes);

sequelize.sync().then(() => {
    app.listen(3000, () => {
        console.log('Server is running on http://localhost:3000');
    });
});
