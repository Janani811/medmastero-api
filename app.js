import createError from 'http-errors';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import { fileURLToPath } from "node:url";

import setInitialRoutes from "./routes/index.js"

const __dirname = fileURLToPath(import.meta.url);

// const indexRouter = require('./routes/index');
// const usersRouter = require('./routes/users');

const app = express();

dotenv.config({
  path: path.join(__dirname, '.env'),
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// parse various different custom JSON types as JSON
app.use(bodyParser.json({ type: 'application/*+json' }))

// parse some custom thing into a Buffer
app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }))

// parse an HTML body into a string
app.use(bodyParser.text({ type: 'text/html' }))


// Enable All CORS Requests
const allowedOrigins = [
  'http://localhost:4200',
];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.options('*', cors({ origin: allowedOrigins, credentials: true }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
setInitialRoutes(app)
// // POST /login gets urlencoded bodies
// app.post('/login', urlencodedParser, function (req, res) {
//   res.send('welcome, ' + req.body.username)
// })

// // POST /api/users gets JSON bodies
// app.post('/api/company', jsonParser, function (req, res) {
//   // create user in req.body
// });

// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
