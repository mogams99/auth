const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const app = express();

// * Default app port and url
const port = 3012;
const url = `http//localhost:${port}`;

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

// ? Our routes
app.get('/', (req, res) => {
    res.send('This home page.');
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

app.get('/admin', (req, res) => {
    res.send('Admin page has login required.')
});

// * Check listen app
app.listen(3012, () => {
    console.log(`App listen on port: ${url}`);
});