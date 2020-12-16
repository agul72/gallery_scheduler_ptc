const express = require('express');
const config = require('config');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(express.json({ extended: true }));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/api/user', require('./routes/user.routes'));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/gallery', require('./routes/gallery.routes'));
app.use('/', require('./routes/home.routes'));

const PORT = process.env.PORT || config.get('port') || 5000;

async function start() {

    try {
        await mongoose.connect(config.get('mongoUrl'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })

        app.listen(PORT, () => {
            console.log(`App has been started on port ${PORT}`);
        })
    } catch (e) {
        console.log('Server error: ', e.message);
        process.exit(1);
    }
}

start();


