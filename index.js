const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./router');

const app = express();
const port = process.env.PORT || 8080;
const mongoUrl = process.env.MONGODB_URL;

// DB Setup
mongoose.connect(mongoUrl);

// App Setup
app.use(express.static(__dirname));
app.use(bodyParser.json({ type: '*/*' }));
router(app);

app.listen(port);
