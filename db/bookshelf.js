const bookshelfJs = require('bookshelf');
const knexJs = require('knex');

const knexOptions = require('./knexfile');

const knex = knexJs(knexOptions);

const bookshelf = bookshelfJs(knex);

module.exports = bookshelf;