const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const routes = require('./routes');
const routers = require('./routers/router');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

//application/x-www-form-urlencoded,Json  자료를 가져올수있게해줌
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//cookie 를 저장할수있게 도와줌
app.use(cookieParser());

mongoose
    .connect(
        'mongodb+srv://Netube:tkacns11@cluster0.dnbk4.mongodb.net/Netube?retryWrites=true&w=majority',
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        }
    )
    .then(console.log('MONGO DB IS CONNCETED'))
    .catch((err) => console.log(err));

app.use(routes.home, routers);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
