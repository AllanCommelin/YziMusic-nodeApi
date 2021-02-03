/* Imports */
const express = require('express');
const bcrypt = require('bcryptjs');
const Models = require('../models/index');
const { checkFields } = require('../services/request.service');
const Mandatory = require('../services/mandatory.fields.service');
const { sendBodyError,sendFieldsError,sendApiSuccessResponse,sendApiErrorResponse, sendApiUnauthorizedResponse } = require('../services/response.service');

/*
    Define authentication routes
*/
class RouterClass {
    constructor(){
        this.router = express.Router();
    }

    routes(){
        // AUTH: Register
        this.router.post('/register', async (req, res) => {
            // Check body data
            if( typeof req.body === 'undefined' || req.body === null || Object.keys(req.body).length === 0 ){
                return sendBodyError('/auth/register', 'POST', res, 'No data provided in the reqest body')
            }
            else{
                // Check body data
                const { ok, extra, miss } = checkFields( Mandatory.register, req.body );
                // Error: bad fields provided
                if( !ok ) return sendFieldsError('/auth/register', 'POST', res, 'Bad fields provided', miss, extra);
                else {
                    // Encrypt user password
                    req.body.password = await bcrypt.hash( req.body.password, 10 );

                    // Register new user
                    Models.user.create( req.body )
                        .then( data => sendApiSuccessResponse('/auth/register', 'POST', res, 'Request succeed', data) )
                        .catch( err => sendApiErrorResponse('/auth/register', 'POST', res, 'Request failed', err) );
                }
            }
        });

        // AUTH: Login
        this.router.post('/login', (req, res) => {
            // Check body data
            if( typeof req.body === 'undefined' || req.body === null || Object.keys(req.body).length === 0 ){
                return sendBodyError('/auth/login', 'POST', res, 'Aucun identifiant soumis')
            }
            else{
                // Check body data
                const { ok, extra, miss } = checkFields( Mandatory.login, req.body );
                // Error: bad fields provided
                if( !ok ) return sendFieldsError('/auth/login', 'POST', res, 'Champs requis', miss, extra);
                else{
                    // Find user from email
                    Models.user.findOne( { email: req.body.email }, (err, data) => {
                        // Return 401 error
                        if( err || data === null ){ return sendApiUnauthorizedResponse('/auth/login', 'POST', res, 'Identifiants incorrects', err) }
                        else{
                            // Check user password
                            const validatedPassword = bcrypt.compareSync( req.body.password, data.password );
                            // Return 401 error
                            if( !validatedPassword ){ return sendApiUnauthorizedResponse('/auth/login', 'POST', res, 'Identifiants incorrects', null) }
                            else{
                                // Generate user JWT
                                const userJwt = data.generateJwt(data);
                                // Set response cookie
                                res.cookie( process.env.COOKIE_SECRET, userJwt, { maxAge: 700000, httpOnly: true } )
                                // Send user data
                                return sendApiSuccessResponse('/auth/login', 'POST', res, 'Utilisateur connecté', {user: data.getUserFields(data), token:userJwt});
                            };
                        }
                    })
                }
            }
        });
    }

    init(){
        // Get route fonctions
        this.routes();

        // Sendback router
        return this.router;
    };
}
//

/*
Export
*/
module.exports = RouterClass;
//