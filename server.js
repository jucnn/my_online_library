/* 
Imports
*/
// Modules
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const path = require('path');


//

// Inner Modules
const MONGOclass = require('./services/mongo.class');


/* 
Declarations
*/
const server = express();
const port = process.env.PORT;
//


/* 
Server class
*/
class ServerClass {
    constructor() {
        this.MONGO = new MONGOclass;
    }

    init() {

        // View engine configuration
        server.engine('html', ejs.renderFile);
        server.set('view engine', 'html');

        // Static path configuration
        server.set('views', __dirname + '/www');
        server.use(express.static(path.join(__dirname, 'www')));

        //=> Body-parser
        server.use(bodyParser.json({
            limit: '10mb'
        }));
        server.use(bodyParser.urlencoded({
            extended: true
        }));

        // Start server configuration
        this.config();
    };

    config() {
        // Set auth router
        const crudRouter = require('./routers/crud.router');
        
        server.use('/api', crudRouter);

        // Set front router
        server.get('/*', (req, res) => res.render('index'));


        // Launch server
        this.launch();
    };

    launch() {
        // Connect MongoDB
        this.MONGO.connectDb()
            .then(db => {
                // Start server
                server.listen(port, () => {
                    console.log({
                        node: `http://localhost:${port}`,
                        mongo: db
                    });
                });
            })
            .catch(dbErr => console.log('MongoDB Error', dbErr));
    };
}
//

/* 
Start server
*/
const NODEapi = new ServerClass();
NODEapi.init();
//