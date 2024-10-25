require("dotenv").config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const my_mongoose = require('./db');
const userApi = require('./controllers/user_controller_api');
const upload_jpg = require('./controllers/upload_controller_api');

app.use('/user', userApi);
app.use('/image', upload_jpg); // Corrected this line

app.listen(4500, () => console.log('EXPRESS Server Started at Port No: 4500'));
