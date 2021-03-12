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
    data: Buffer,
    contentType: String,
})

Track.methods.getReadableTrack = track => {
    return {
        '@context': track['@context'],
        '@type': track['@type'],
        user: track.user,
        name: track.name,
        audio: track.data.toString('base64'),
        contentType: track.contentType,
    }
}

/* Export schema */
module.exports = mongoose.model('track', Track)