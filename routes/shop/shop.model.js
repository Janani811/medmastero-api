import bookshelf from '../../db/bookshelf';

const Shop = bookshelf.Model.extend({
    tableName: 'shop',
    idAttributes: "sh_id"
}, {
    create,
    update,
    getOne,
    getAll,
    destroy,
});

// Create a Record
function create(data) {
    if (!data) {
        throw new Error('Invalid function call.');
    }
    return new this().save(data, { method: "insert" }).then((model) => model.toJSON());
}

// Update a Record
function update(query, data) {
    if (!data || !query) {
        throw new Error('Invalid function call.');
    }
    return new this().where(query).save(data, { method: "update", patch: true }).then((model) => model.toJSON());
}

// get one record based on condition
function getOne(where) {
    return new this()
        .where(where)
        .fetch({ require: false })
        .then((model) => (model ? model.toJSON() : null));
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

// hard delete
function destroy(args) {
    return this.query((qb) => {
        if (args) qb.where(args);
    }).destroy();
}

export default Shop;
