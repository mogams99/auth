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

// ? Our routes
app.get('/', (req, res) => {
    res.send('This is home page.');
});

app.get('/register', (req, res) => {
    res.render('register');
});
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = new User({
        username,
        password: hashedPassword
    });
    await user.save();
    res.redirect('/');
});

app.get('/login', (req, res) => {
    res.render('login');
});
app.post('/login', async (req, res) => {
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

app.get('/admin', (req, res) => {
    if (!req.session.userId) res.redirect('/login');
    res.send('This is admin page.')
});

// * Check listen app
app.listen(3012, () => {
    console.log(`App listen on port: ${url}`);
});