/* Imports */
require('dotenv').config(); //=> https://www.npmjs.com/package/dotenv
const express = require('express'); //=> https://www.npmjs.com/package/express
const bodyParser = require('body-parser'); //=> https://www.npmjs.com/package/body-parser
const cookieParser = require('cookie-parser'); //=> https://www.npmjs.com/package/cookie-parser
const passport = require('passport'); //=> https://www.npmjs.com/package/passport
const session = require('express-session');
//const path = require('path'); //=> https://www.npmjs.com/package/path
// Services
const MONGOclass = require('./services/mongo.class');

/* Server class*/
class ServerClass{
    constructor(){
        this.server = express();
        this.port = process.env.PORT;
        this.MongoDB = new MONGOclass;
    }

    init(){
        // Set CORS middleware
        this.server.use( (req, res, next) => {
            // Allow actions for specific origins
            res.header('Access-Control-Allow-Origin', process.env.CORS_URL);
            res.header('Access-Control-Allow-Credentials', 'true');
            res.header('Access-Control-Allow-Methods', "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS");
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            // Enable access to specific origins
            next();
        });

        //=> Body-parser
        this.server.use(bodyParser.json({limit: '15mb'}));
        this.server.use(bodyParser.urlencoded({ extended: true }));

        //=> Use CookieParser to setup server side cookies
        this.server.use(cookieParser(process.env.COOKIE_SECRET));
        this.server.enable('trust proxy');
        this.server.use(session({
            resave: true,
            proxy : true,
            cookie : {
                sameSite: 'none',
                secure : true,
            }
        }));

        // Start server configuration
        this.config();
    }

    config(){
        // Set authentication
        const { setAuthentication } = require('./services/auth.service');
        setAuthentication(passport);

        // Set Auth router
        const AuthRouterClass = require('./routers/auth.router');
        const authRouter = new AuthRouterClass( { passport } );
        this.server.use('/auth', authRouter.init());

        // Set User router
        const UserRouterClass = require('./routers/user.router');
        const userRouter = new UserRouterClass( { passport } );
        this.server.use('/api/users', userRouter.init());

        // Set Track router
        const TrackRouterClass = require('./routers/track.router');
        const trackRouter = new TrackRouterClass({ passport })
        this.server.use('/api/tracks', trackRouter.init());

        // Launch server
        this.launch();
    }

    launch(){
        // Start MongoDB connection
        this.MongoDB.connectDb()
            .then( db => {
                // Start server
                this.server.listen(this.port, () => {
                    console.log({
                        node: `http://localhost:${this.port}`,
                        mongo: db.url,
                    });
                });
            })
            .catch( dbErr => console.log(`MongoDB Error (${process.env.MONGO_URL})`, dbErr));
    }
}
//

/* Start server */
const NodeServer = new ServerClass();
NodeServer.init();