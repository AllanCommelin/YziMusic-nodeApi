/* Import */
const mongoose = require('mongoose');
const { Schema } = mongoose;

/* Define Schema */
const Track = new Schema({
    // Schema.org
    '@context': { type: String, default: 'http://schema.org' },
    '@type': { type: String, default: 'AudioObject' },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    name: String,
    tag: String,
    date: String,
    data: Buffer,
    contentType: String,
})

Track.methods.getReadableTrack = track => {
    return {
        '@context': track['@context'],
        '@type': track['@type'],
        _id: track._id,
        user: track.user,
        tag: track.tag,
        name: track.name,
        date: track.date,
        audio: track.data.toString('base64'),
        contentType: track.contentType,
    }
}

/* Export schema */
module.exports = mongoose.model('track', Track)