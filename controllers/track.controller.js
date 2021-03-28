/* Imports */
const Models = require('../models/index');
const path = require('path');
const fs = require('fs');

// uploadTrack
const uploadTrack = req => {
    return new Promise(  (resolve, reject) => {
        // Get path of track
        const trackPath = path.join(path.dirname('server.js') + '/uploads/' + req.file.filename)
        // Create track object
        console.log(req.body.name)
        let track = {
            user: req.user._id,
            name: req.body.name,
            tag: req.body.tag,
            date: req.body.date,
            data: fs.readFileSync(trackPath),
            contentType: req.file.mimetype,
        }
        Models.track.create(track, async (err, data) => {
            if (err) reject(err)
            const user = await Models.user.findById(req.user._id)
            user.tracks.push(data._id)
            user.save()
            resolve(data)
        })
        // Delete track in uploads directory after create document in bdd
        fs.unlink(trackPath, (err) => {
            if (err) console.error(err)
        })
    })
};

const getAllByUser = req => {
    return new Promise((resolve, reject) => {
        Models.track.find({user: req.user._id}, '-data',  (err, data) => {
            err ? reject(err) : resolve(data);
        })
    })
}

const getTrackById = req => {
    return new Promise((resolve, reject) => {
        Models.track.findById( req.params._id)
            .populate({path: 'user', select: 'username _id'})
            .exec((err, data) => {
            err ? reject(err) : resolve(data);
        })
    })
}

const deleteTrack = req => {
    return new Promise((resolve, reject) => {
        Models.track.findByIdAndRemove(req.params._id, async (err, data) => {
            if (err) {
                reject(err)
            } else {
                const user = await Models.user.findById(req.user._id)
                if (!user) reject('Can\'t find user')
                else {
                    const index = user.tracks.findIndex(track => track._id === req.params._id)
                    if (!index) reject('User don\'t have this track')
                    else {
                        user.tracks.splice(index, 1);
                        user.save()
                    }
                }
            }
            err ? reject(err) : resolve(data);
        })
    })
}

module.exports = {
    uploadTrack,
    getAllByUser,
    getTrackById,
    deleteTrack
};