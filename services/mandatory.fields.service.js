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
        "banished",
        "profilePicture",
        "creationDate"
    ],
    userUpdate: [
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
    ],
    login: ['email', 'password'],
    userUpdatePicture: [
        "fieldname",
        "originalname",
        "encoding",
        "mimetype",
        "destination",
        "filename",
        "path",
        "size",
    ],
    uploadTrack: [
        "fieldname",
        "originalname",
        "encoding",
        "mimetype",
        "destination",
        "filename",
        "path",
        "size",
    ],
    userLike: [
        "userId"
    ]
};

/* Export */
module.exports = MandatoryFieldsService;