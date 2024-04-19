const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const app = express();

// * Default app values
const port = 3012;
const url = `http//localhost:${port}`;
const secret = 'stupidity';

// ? Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1/auth-demo').then(res => {
    console.log('MongoDB is connected');
}).catch(err => {
    console.log(err);
})

// ? Import model
const User = require('./models/User');

// ! Config app
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret,
    resave: false,
    saveUninitialized: false
}));

const auth = (req, res, next) => {
    if (!req.session.userId) return res.redirect('/login');
    next();
}

const hasUser = (req, res, next) => {
    if (req.session.userId) return res.redirect('/admin');
    next();
}

// ? Our routes
app.get('/', (req, res) => {
    res.send('This is home page.');
});

app.get('/register', hasUser, (req, res) => {
    res.render('register');
});
app.post('/register', hasUser, async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = new User({
        username,
        password: hashedPassword
    });
    await user.save();
    res.redirect('/');
});

app.get('/login', hasUser, (req, res) => {
    res.render('login');
});
app.post('/login', hasUser, async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            req.session.userId = user._id;
            res.redirect('/admin');
        } else {
            res.redirect('/login');
        }
    } else {
        res.redirect('/login');
    }
});
app.post('/logout', auth, (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
})

app.get('/admin', auth, (req, res) => {
    res.render('admin');
});

app.get('/profile/settings', auth, (req, res) => {
    res.send(`This is profile settings page. User ID: ${req.session.userId}`);
});

// * Check listen app
app.listen(3012, () => {
    console.log(`App listen on port: ${url}`);
});