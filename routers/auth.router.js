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
    constructor({ passport }){
        this.passport = passport;
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
                    // By default, user has role user
                    req.body.role = 'user'

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
                    Models.user.findOne( { email: req.body.email })
                        .populate({path: 'tracks', select: '_id name'})
                        .exec((err, data) => {
                            // Return 401 error
                            if( err || data === null ){ return sendApiUnauthorizedResponse('/auth/login', 'POST', res, 'Identifiants incorrects', err) }
                            else{
                                // Check user password
                                const validatedPassword = bcrypt.compareSync( req.body.password, data.password );
                                // Return 401 error
                                if( !validatedPassword ){ return sendApiUnauthorizedResponse('/auth/login', 'POST', res, 'Identifiants incorrects', null) }
                                else{
                                    // Generate user JWT
                                    const userJwt = data.generateJwt({
                                        _id: data._id,
                                        email: data.email,
                                        firstname: data.firstname,
                                        lastname: data.lastname,
                                        username: data.username,
                                    });
                                    // Set response cookie
                                    res.cookie( process.env.COOKIE_NAME, userJwt, { maxAge: 700000, httpOnly: true, sameSite: 'none', secure : true } )
                                    // Send user data
                                    return sendApiSuccessResponse('/auth/login', 'POST', res, 'Utilisateur connecté', {user: data.getUserFields(data)});
                                };
                            }
                    })
                }
            }
        });
        // Get infos for connected user
        this.router.get('/me', this.passport.authenticate('jwt', { session: false }), (req, res) => {
            Models.user.findById( req.user._id, '-password')
                .populate({path: 'tracks', select: '_id name'})
                .exec((err, data) => {
                    res.status(201).json({
                        method: 'POST',
                        route: '/auth/me',
                        data: data.getUserFields(data),
                        error: err,
                        status: 201
                    });
                });
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