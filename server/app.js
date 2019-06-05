const express = require('express'),
  app = express(),
  mongoose = require('mongoose'),
  path = require('path'),
  routes = require('./routes/posts'),
  users = require('./routes/user');

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(() => {
    console.log('Connected to Database');
  });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/images', express.static(path.join('server/images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin,X-Requested-With,Content-Type,Accept,Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,POST,PUT,DELETE,PATCH,OPTIONS'
  );
  next();
});

app.use('/posts', routes);
app.use('/user', users);

module.exports = app;
