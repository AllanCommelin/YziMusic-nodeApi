/* Imports */
const express = require('express');
const Mandatory = require('../services/mandatory.fields.service');
const { checkFields } = require('../services/request.service');
const { sendBodyError, sendFieldsError ,sendApiSuccessResponse, sendApiErrorResponse} = require('../services/response.service');
// Controllers
const Controllers = require('../controllers/index');


/*
    Define user routes
*/
class RouterClass {
    constructor({ passport }){
        this.passport = passport;
        this.router = express.Router();
    }

    routes(){
        //  READ ALL USERS
        this.router.get('/', (req, res) => {
            Controllers.user.readAll()
                .then( apiResponse => sendApiSuccessResponse('/api/user', 'POST', res, 'Request succeed', apiResponse) )
                .catch( apiError => sendApiErrorResponse('/api/user', 'POST', res, 'Request failed', apiError) );
        });

        //  READ ONE USER
        this.router.get('/:_id', (req, res) => {
            Controllers.user.readOne(req)
                .then( apiResponse => sendApiSuccessResponse('/api/user', 'POST', res, 'Request succeed', apiResponse) )
                .catch( apiError => sendApiErrorResponse('/api/user', 'POST', res, 'Request failed', apiError) );
        });

        //  UPDATE ONE USER : Auth require
        this.router.put('/:_id', this.passport.authenticate('jwt', { session: false }), (req, res) => {
            if( typeof req.body === 'undefined' || req.body === null || Object.keys(req.body).length === 0 ){
                return sendBodyError('/api/user', 'POST', res, 'No data provided in the request body')
            } else {
                // Check body data
                const { ok, extra, miss } = checkFields( Mandatory.user, req.body );
                // Error: bad fields provided
                if( !ok ){ return sendFieldsError('/api/user', 'POST', res, 'Bad fields provided', miss, extra) }
                else{
                    Controllers.user.updateOne(req)
                        .then( apiResponse => sendApiSuccessResponse('/api/user', 'POST', res, 'Request succeed', apiResponse) )
                        .catch( apiError => sendApiErrorResponse('/api/user', 'POST', res, 'Request failed', apiError) );
                }
            }
        });

        //  DELETE ONE USER : Auth require
        this.router.delete('/:_id', this.passport.authenticate('jwt', { session: false }), (req, res) => {
            Controllers.user.deleteOne(req)
                .then( apiResponse => sendApiSuccessResponse('/api/user', 'POST', res, 'Request succeed', apiResponse) )
                .catch( apiError => sendApiErrorResponse('/api/user', 'POST', res, 'Request failed', apiError) );
        })
    }

    init(){
        this.routes();
        return this.router;
    };
}
//

/*
Export
*/
module.exports = RouterClass;
//