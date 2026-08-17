const express = require('express');
const attemptRoutes = require('./routes/attemptRoutes');

const app = express();

app.use(express.json());
app.use(attemptRoutes);

module.exports = app;
