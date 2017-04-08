var salus = require('./lib/salus');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');

var app = express();
var router = express.Router()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator()); // Add this after the bodyParser middlewares!
app.use(express.static(path.join(__dirname, './view')));
app.set('views', __dirname + '/view');
app.set('view engine', 'jade');

app.get('/', function(req, res) {
    'use strict';
    res.render(path.join(__dirname, './view/vue.ejs'), { nutrinome: "", errors: "" }); //render index.ejs with meta tags
});

app.post('/', function(req, res) {
    'use strict';
    req.checkBody('sex', 'Invalid Gender').notEmpty().isAlpha().isLength({ min: 0, max: 1 });
    req.checkBody('age', 'Invalid age').notEmpty().isInt();
    req.checkBody('currentWeight', 'Invalid weight').notEmpty().isInt();
    var errors = req.validationErrors();
    if (errors) {
        console.log("errors", JSON.stringify(errors));
        res.render(path.join(__dirname, './view/vue.ejs'), { nutrinome: "", errors: JSON.stringify(errors) || "" });
    } else {
        salus.getNutrinomeWithDesc(req.body, function(result) {
            res.render(path.join(__dirname, './view/vue.ejs'), { nutrinome: result.datas, errors: result.errors || "" });
        });
    }
});

app.listen(3000, function() {
    'use strict';
    console.log('Rony test app listening on port 3000!');
    //salus.promptDescriptor();
});
