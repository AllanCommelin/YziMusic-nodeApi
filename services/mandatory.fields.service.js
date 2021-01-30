/*
    Define mandatory fields by context
*/
const MandatoryFieldsService = {
    register: [
        "email",
        "firstname",
        "lastname",
        "username",
        "password",
        "profilesTypes",
        "musicsTypes",
        "description",
        "location",
        "birthday",
        "facebookLink",
        "twitterLink",
        "instagramLink",
        "youtubeLink",
        "spotifyLink",
        "deezerLink",
        "appleMusicLink",
        "soundcloudLink",
        "likes",
        "banished",
        "profilePicture",
        "bannerPicture",
        "creationDate"
    ],
    login: ['email', 'password']
};

/* Export */
module.exports = MandatoryFieldsService;