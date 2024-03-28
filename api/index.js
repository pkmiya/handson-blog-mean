const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');
const env = require('dotenv');
const jwt = require('jsonwebtoken');
const cookie = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });
const fs = require('fs');

const localenv = __dirname + '/.env.local'
if (fs.existsSync(localenv)) {
    env.config({ path: localenv })
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
app.use('/uploads', express.static(__dirname + '/uploads'));
mongoose.connect(uri);

const User = require('./models/User');
const Post = require('./models/Post');

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

app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
    const { originalname, path } = req.file;

    // get extension type
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];

    // rename file with extension
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);


    // send response to database
    // get user info
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) {
            res.status(401).json({ error: 'Unauthorized' });
        }
        const { title, summary, content } = req.body;
        const postDoc = await Post.create({
            title,
            summary,
            content,
            cover: newPath,
            author: info.id,
        });
        res.json(postDoc);
    });
});

app.get('/post', async (req, res) => {
    const posts = await Post.find()
        .populate('author', ['username'])
        .sort({ createdAt: -1 })
        .limit(10);
    res.json(posts);
});

app.get('/post/:id', async (req, res) => {
    const { id } = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);

    res.json(postDoc);
});

app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
    let newPath = null;
    if (req.file) {
        const { originalname, path } = req.file;

        // get extension type
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];

        // rename file with extension
        newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
    }

    // send response to database
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) {
            res.status(401).json({ error: 'Unauthorized' });
        }

        const { title, summary, content, id } = req.body;
        const postDoc = await Post.findById(id);

        const isAuthor = postDoc.author.equals(info.id);
        if (!isAuthor) {
            res.status(401).json({ error: 'Unauthorized' });
        }

        await postDoc.updateOne({
            title,
            summary,
            content,
            cover: newPath || postDoc.cover,
        });

        res.json(postDoc);
    });
});


app.listen(4000);
