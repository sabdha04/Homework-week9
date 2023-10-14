var express = require('express');
var bodyParser = require('body-parser');
var swaggerJsDoc = require('swagger-jsdoc');
var swaggerUI = require('swagger-ui-express');
var app = express();
var morgan = require('morgan');

app.use(morgan('common'));

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Express API with Swagger',
            version: '0.1.0',
            description: 'This is a simple CRUD API application made with Express and documented with Swagger',
        },
        servers: [{
            url: 'http://localhost:3000',
        }, ],
    },
    apis: ['./routes/*'],
};

const specs = swaggerJsDoc(options);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var movies = require('./routes/movies.js');
app.use('/movies', movies);

var users = require('./routes/users.js');
app.use('/users', users);

app.listen(3000);