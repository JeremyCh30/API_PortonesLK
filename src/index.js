// el servidor se levanta con npm run start
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 9000;

//middlewares
const contactsRoutes = require('./components/contactanos/contacts.route');
app.use(express.json());
app.use('/api', contactsRoutes);


//routes
app.get('/', (req, res) => {
    res.send('Hello World!');
})

//Coneccion a la base de datos
mongoose.connect(process.env.MONGODB_URI).then(() => console.log('Connected to MongoDB')).catch(err => console.log(err));



app.listen(port, ()=>console.log('server started at', port));
