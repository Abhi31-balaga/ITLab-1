const express = require('express');
const examRoutes = require('./routes/examRoutes');

const app = express();

app.use(express.json());
app.use('/api', examRoutes);

module.exports = app;
