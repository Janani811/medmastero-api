const dotenv = require('dotenv');
const path = require('path');
const bookshelfJs = require('bookshelf');
const knexJs = require('knex');

const knexOptions = require('../knexfile');

const knex = knexJs(knexOptions);
dotenv.config({
  path: path.join(__dirname, '.env'),
});
const bookshelf = bookshelfJs(knex);

module.exports = bookshelf;