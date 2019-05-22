const express = require('express'),
  app = express(),
  mongoose = require('mongoose'),
  routes = require('./routes/posts');

mongoose
  .connect(process.env.MONGODB_URL, { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to Database');
  });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin,X-Requested-With,Content-Type,Accept'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,POST,PUT,DELETE,PATCH,OPTIONS'
  );
  next();
});

app.use('/posts', routes);

module.exports = app;
