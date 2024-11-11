import bookshelfJs from 'bookshelf';
import knexJs from 'knex';
import knexOptions from './knexfile.js';

const knex = knexJs(knexOptions);

const bookshelf = bookshelfJs(knex);

export default bookshelf;