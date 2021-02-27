/* Import */
const mongoose = require('mongoose');
const { Schema } = mongoose;

/* Define Schema */
const Track = new Schema({
    // Schema.org
    '@context': { type: String, default: 'http://schema.org' },
    '@type': { type: String, default: 'AudioObject' },
    user_id: mongoose.Schema.Types.ObjectId,
    name: String,
    data: Buffer,
    contentType: String,
})

Track.methods.getReadableTrack = track => {
    return {
        '@context': track['@context'],
        '@type': track['@type'],
        user_id: track.user_id,
        name: track.name,
        audio: track.data.toString('base64'),
        contentType: track.contentType,
    }
}

/* Export schema */
module.exports = mongoose.model('track', Track)