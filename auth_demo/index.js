const express = require('express');
const app = express();
const port = 3012;
const url = `http//localhost:${port}`;

// ? import model
const User = require('./models/User');

// ! config app
app.set('view engine', 'ejs');
app.set('views', 'views');

// ? our routes
app.get('/register', (req, res) => {
    res.render('register');
});
app.get('/admin', (req, res) => {
    res.send('Admin page has login required.')
});

app.listen(3012, () => {
    console.log(`App listen on port: ${url}`);
});