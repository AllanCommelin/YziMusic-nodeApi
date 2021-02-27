/*
 Imports
 */
const express = require('express');
const upload = require('../services/upload.service');
const Mandatory = require('../services/mandatory.fields.service');
const { checkFields } = require('../services/request.service');
const { sendBodyError, sendFieldsError ,sendApiSuccessResponse, sendApiErrorResponse} = require('../services/response.service');
const Controllers = require('../controllers/index');

class RouterClass {
    constructor({ passport }){
        this.passport = passport;
        this.router = express.Router();
    }

    /*
        Define track routes
    */
    routes() {
        /**
         * POST /tracks
         */
        this.router.post('/upload/', this.passport.authenticate('jwt', { session: false }), upload.single('track'), (req, res) => {
            if( typeof req.file === 'undefined' || req.file === null || Object.keys(req.file).length === 0 ){
                return sendBodyError('/api/upload/track', 'POST', res, 'No data provided in the request body')
            } else {
                // Check body data
                const { ok, extra, miss } = checkFields( Mandatory.uploadTrack, req.file, true );
                // Error: bad fields provided
                if( !ok ){ return sendFieldsError('/api/upload/track', 'POST', res, 'Bad fields provided', miss, extra) }
                else{
                    Controllers.track.uploadTrack(req)
                        .then( apiResponse => sendApiSuccessResponse('/api/tracks/upload', 'POST', res, 'Request succeed', apiResponse) )
                        .catch( apiError => sendApiErrorResponse('/api/tracks/upload', 'POST', res, 'Request failed', apiError) );
                }
            }
        })

        /**
         * GET all tracks for user without data buffer /tracks
         */
        this.router.get('/', this.passport.authenticate('jwt', { session: false }), (req, res) => {
            Controllers.track.getAllByUser(req)
                .then( apiResponse => sendApiSuccessResponse('/api/tracks', 'get', res, 'Request succeed', apiResponse) )
                .catch( apiError => sendApiErrorResponse('/api/tracks', 'get', res, 'Request failed', apiError) );
        })

        /**
         * GET a specific track by track id /tracks/:id
         */
        this.router.get('/:_id', this.passport.authenticate('jwt', { session: false }), (req, res) => {
            Controllers.track.getTrackById(req)
                .then( apiResponse => {
                    const track = apiResponse.getReadableTrack(apiResponse)
                    sendApiSuccessResponse('/api/tracks/id', 'get', res, 'Request succeed', track)
                })
                .catch( apiError => sendApiErrorResponse('/api/tracks/id', 'get', res, 'Request failed', apiError) );
        })
    }

    init(){
        this.routes();
        return this.router;
    };
}


/*
Export
*/
module.exports = RouterClass;
//