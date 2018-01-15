const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const http = require('http');
const nodemailer = require('nodemailer'),
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'Igordefault@gmail.com',
            pass: 'ckhyr_987FV_+s'
        },
    }),
    EmailTemplate = require('email-templates').EmailTemplate,
    path = require('path'),
    Promise = require('bluebird');
const exphbs = require('express-handlebars');

const fs = require("fs");
const mail = require('./js/mail');
const port = 8000;

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(cors());

// View engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
    res.render('contact');
});

app.post('/send', (req, res) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "Igordefault@gmail.com", // generated ethereal user
            pass: "ckhyr_987FV_+s" // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: 'Mailer', // sender address
        //        to: req.body.mail,
        to: "Igordefault@gmail.com", // list of receivers
        subject: 'Node Contact Request', // Subject line
        text: 'Hello world?', // plain text body
        attachments: [
            { // utf-8 string as an attachment
                filename: 'canvas.png',
                content: fs.createReadStream(__dirname + '/canvas.png')
        }]
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        res.sendStatus(200);
    });
});

// Handle POST from xxx/receive
app.post('/receive', function (request, respond) {
    // The image data will be store here
    var body = '';
    // Target file path
    var filePath = __dirname + '/canvas.png';
    // 
    request.on('data', function (data) {
        body += data;
    });

    // When whole image uploaded complete.
    request.on('end', function () {
        // Get rid of the image header as we only need the data parts after it.
        var data = body.replace(/^data:image\/\w+;base64,/, "");
        // Create a buffer and set its encoding to base64
        var buf = new Buffer(data, 'base64');
        // Write
        fs.writeFile(filePath, buf, function (err) {
            if (err) throw err
                // Respond to client that the canvas image is saved.
            respond.end();
        });
    });
});

app.post("/sendMessage", function (req, res) {
    connection.query("insert into `*****`.`*********` (`name`, `email`, `phone`, `message`) values ('" + req.body.name + "', '" + req.body.email + "', '" + req.body.phone + "', '" + req.body.message + "')", function (err) {
        if (err) console.log(err);
        res.status(200).send("Success");
    });
});

//Усі адреси контролюються клієнтським ангуляром
app.get('*', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, function (err) {
    if (err) throw err;
    console.log('Server start on port ' + port+'!');
});