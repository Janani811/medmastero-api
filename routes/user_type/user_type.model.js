import bookshelf from '../../db/bookshelf.js';

const UserType = bookshelf.Model.extend({
    tableName: 'user_type',
    idAttributes: "ut_id"
}, {
    getOne,
    getAll
});

// get one record based on condition
function getOne(args) {
    return this.query((qb) => {
        if (args) {
            qb.where(args);
        }
        qb.select("*");
    }).fetch().then((model) => (model ? model.toJSON() : null));
}

// get all records - if args , returns records based where condition, else return all records
function getAll(args) {
    return this.query((qb) => {
        if (args) {
            qb.where(args);
        }
        qb.select("*");
    }).fetchAll().then((model) => (model ? model.toJSON() : []));
}

export default UserType;
