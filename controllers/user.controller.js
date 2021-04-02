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
            const users = data.map(user => user.getUserFields(user))
            err ? reject(err) : resolve(users);
        })
    })
};

// Read 10 must liked users
const readMostLiked = () => {
    return new Promise( (resolve, reject) => {
        Models.user.find({}, '-password', {sort: {'likes': 'desc'}, limit: 10}, (err, data) => {
            const users = data.map(user => user.getUserFields(user))
            err ? reject(err) : resolve(users);
        })
    })
}

// Read 10 must recent users
const readMostRecent = () => {
    return new Promise( (resolve, reject) => {
        Models.user.find({}, '-password', {sort: {'creationDate': 'desc'}, limit: 10}, (err, data) => {
            const users = data.map(user => user.getUserFields(user))
            err ? reject(err) : resolve(users);
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

// Like one user
const likeUser = req => {
    return new Promise( async (resolve, reject) => {
        const user = await Models.user.findById(req.body.userId)
        if (!user) reject('Don\'t find user')
        user.likes.push(req.user._id)
        user.save()

        resolve(user.getUserFields(user))
    })
};
// Like one user
const unlikeUser = req => {
    return new Promise( async (resolve, reject) => {
        const user = await Models.user.findById(req.body.userId)
        if (!user) reject('Don\'t find user')
        const index = user.likes.findIndex(user => user._id === req.user._id)
        if (!index) reject('Auth user don\'t like this user')
        user.likes.splice(index, 1);
        user.save()
        resolve(user.getUserFields(user))
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
                ? reject( err )
                : resolve( data );
        })
    })
}

// Search user
const searchUsers = req => {
    return new Promise( (resolve, reject) => {
        // Todo add filter by profile types and music types
        Models.user.aggregate([{
            $match: {
                $or: [
                    { username: {$regex: req.query.search, $options: "i"}},
                    { firstname: {$regex: req.query.search, $options: "i"}},
                    { lastname: {$regex: req.query.search, $options: "i"}},
                ]
            }
        }]).exec((err, data) => {
            data.forEach(user => {
                user.profilePicture = user.profilePicture.data ? {
                    contentType: user.profilePicture.contentType,
                    picture: user.profilePicture.data.toString('base64')
                } : null
            })
            err ? reject(err) : resolve(data);
        });
    })
}

module.exports = {
    readOne,
    readAll,
    updateOne,
    deleteOne,
    readMostLiked,
    readMostRecent,
    updatePicture,
    likeUser,
    unlikeUser,
    searchUsers
};