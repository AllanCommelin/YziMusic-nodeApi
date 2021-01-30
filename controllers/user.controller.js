/* Imports */
const Models = require('../models/index');

// Read one user
const readOne = req => {
    return new Promise( (resolve, reject) => {
        Models.user.findById( req.params._id, '-password', (err, data) => {
            err
                ? reject(err)
                : resolve(data);
        })
    })
};

// Read all users
const readAll = () => {
    return new Promise( (resolve, reject) => {
        Models.user.find({}, '-password', (err, data) => {
            err
                ? reject(err)
                : resolve(data);
        })
    })
};

// Read 10 must liked users
const readMostLiked = () => {
    return new Promise( (resolve, reject) => {
        Models.user.find({}, '-password', {sort: {'likes': 'desc'}, limit: 10}, (err, data) => {
            err
                ? reject(err)
                : resolve(data);
        })
    })
}

// Read 10 must recent users
const readMostRecent = () => {
    return new Promise( (resolve, reject) => {
        Models.user.find({}, '-password', {sort: {'creationDate': 'desc'}, limit: 10}, (err, data) => {
            err
                ? reject(err)
                : resolve(data);
        })
    })
}

// Update one user
const updateOne = req => {
    return new Promise( (resolve, reject) => {
        Models.user.updateOne( { _id: req.params._id }, req.body, (err, data) => {
            err
                ? reject(err)
                : resolve(data);
        })
    })
};

// Delete one user
const deleteOne = req => {
    return new Promise( (resolve, reject) => {
        Models.user.findByIdAndDelete( req.params._id, (err, data) => {
            err
                ? reject( res.json( err ) )
                : resolve( res.json(data) );
        })
    })
}

module.exports = {
    readOne,
    readAll,
    updateOne,
    deleteOne,
    readMostLiked,
    readMostRecent
};