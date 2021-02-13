/* Import */
const mongoose = require('mongoose');
const { Schema } = mongoose;
const jwt = require('jsonwebtoken');


/* Define Schema */
const User = new Schema({
    // Schema.org
    '@context': { type: String, default: 'http://schema.org' },
    '@type': { type: String, default: 'Person' },

    // Define unique email
    email: { unique: true, type: String },
    firstname: String,
    lastname: String,
    username: String,
    likes: { type: Number, default: 0 },
    password: String,
    profilesTypes: Array,
    musicsTypes: Array,
    description: String,
    location: String,
    birthday: String,
    facebookLink: String,
    twitterLink: String,
    instagramLink: String,
    youtubeLink: String,
    spotifyLink: String,
    deezerLink: String,
    appleMusicLink: String,
    soundcloudLink: String,
    profilePicture: { data: Buffer, contentType: String },
    // Define default values
    creationDate: { type: Date, default: new Date() },
    banished: { type: Boolean, default: false }
})

/* Methods */
User.methods.generateJwt = user => {
    // Set expiration token
    const expiryToken = new Date();
    expiryToken.setDate( expiryToken.getDate() + 59 );

    // Set token
    const jwtObject = {
        user: user,
        // Set timeout
        expireIn: '10s',
        exp: parseInt(expiryToken.getTime() / 100, 10)
    }

    return jwt.sign(jwtObject, process.env.JWT_SECRET);
}
// Return user property Without password
User.methods.getUserFields = user => {
    return {
        _id: user._id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        likes: user.likes,
        profilesTypes: user.profilesTypes,
        musicsTypes: user.musicsTypes,
        description: user.description,
        location: user.location,
        birthday: user.birthday,
        facebookLink: user.facebookLink,
        twitterLink: user.twitterLink,
        instagramLink: user.instagramLink,
        youtubeLink: user.youtubeLink,
        spotifyLink: user.spotifyLink,
        deezerLink: user.deezerLink,
        appleMusicLink: user.appleMusicLink,
        soundcloudLink: user.soundcloudLink,
        profilePicture: user.profilePicture,
        creationDate: user.creationDate,
        banished: user.banished
    }
}

/* Export schema */
module.exports = mongoose.model('user', User)