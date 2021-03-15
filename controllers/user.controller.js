/* Imports */
const Models = require('../models/index');
const path = require('path');
const fs = require('fs');

// Read one user
const readOne = req => {
    return new Promise( (resolve, reject) => {
        Models.user.findById( req.params._id, '-password')
            .populate({path:'tracks', select:'name _id'})
            .exec((err, data) => {
                err
                    ? reject(err)
                    : resolve(data.getUserFields(data));
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

// Update profile picture of one user
const updatePicture = req => {
    return new Promise( (resolve, reject) => {
        // Get path of picture
        const picturePath = path.join(path.dirname('server.js') + '/uploads/' + req.file.filename)
        // Create profilePicture
        let formData = {
            profilePicture: {
                data: fs.readFileSync(picturePath),
                contentType: req.file.mimetype
            }
        }
        Models.user.updateOne( { _id: req.params._id }, formData, (err, data) => {
            err
                ? reject(err)
                : resolve(data);
        })
        // Delete picture in uploads directory after create document in bdd
        fs.unlink(picturePath, (err) => {
            if (err) console.error(err)
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
    readMostRecent,
    updatePicture
};