// el servidor se levanta con npm run start
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 9000;

/**
 Le indicamos a la aplicación que el formato de los datos va a ser JSON
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('dev'));

app.use( function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});


//middlewares
const contactsRoutes = require('./components/contactanos/contacts.route');
app.use(express.json());
app.use('/api', contactsRoutes);


//routes
app.get('/', (req, res) => {
    res.send('Hello World!!!');
})

//Coneccion a la base de datos
mongoose.connect(process.env.MONGODB_URI).then(() => console.log('Connected to MongoDB')).catch(err => console.log(err));



app.listen(port, ()=>console.log('server started at', port));
