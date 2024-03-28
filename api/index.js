const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');
const env = require('dotenv');
const jwt = require('jsonwebtoken');
const cookie = require('cookie-parser');

if (require('fs').existsSync(__dirname + '/.env.local')) {
    env.config({ path: __dirname + '/.env.local' })
}
else {
    env.config();
}

const origin = process.env.APP_ORIGIN;
const secret = process.env.SECRET;
const uri = process.env.MONGODB_URI;

const salt = bcrypt.genSaltSync(10);
const app = express();
app.use(cors({ credentials: true, origin: origin }));
app.use(express.json());
app.use(cookie());
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

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const userDoc = await User.findOne({ username });
    const passOk = bcrypt.compareSync(password, userDoc.password);

    if (passOk) {
        jwt.sign({ username, id: userDoc._id }, secret, { expiresIn: '24h' }, (err, token) => {
            if (err) {
                res.status(500).json({ error: 'Failed to generate token' });
            }
            res.cookie('token', token).json({
                username,
                id: userDoc._id
            });
        });
    } else {
        res.status(400).json({ error: 'Invalid credentials' });
    }
});

app.get('/profile', async (req, res) => {
    const { token } = req.cookies;
    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            res.status(401).json({ error: 'Unauthorized' });
        }
        res.json(decoded);
    });
});

app.post('/logout', (req, res) => {
    res.clearCookie('token').json('ok');
});


app.listen(4000);
