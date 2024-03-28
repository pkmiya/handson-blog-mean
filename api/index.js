const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');
const env = require('dotenv');

const salt = bcrypt.genSaltSync(10);
const app = express();
app.use(cors());
app.use(express.json());

env.config();
const uri = process.env.MONGODB_URI;
mongoose.connect(uri);

const User = require('./models/User');

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const userDoc = await User.create({
            username,
            password: bcrypt.hashSync(password, salt)
        });
        res.json(userDoc);
    } catch (e) {
        res.status(400).json({ error: e });
    }
});

app.listen(4000);
