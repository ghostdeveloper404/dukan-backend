'use strict';

const app = require('./app');
require('./services/mongodb');
require('dotenv').config();

// Connect to MongoDB

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
