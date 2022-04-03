const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({ 
    nombre: { type: String, required: true },
    telefono: { type: Number, required: true },
    email: { type: String, required: true },
    servicio: { type: String, required: true },
    mensaje: { type: String, required: true },
    hora: { type: String, required: false },
    fecha: { type: String, required: false },

});

module.exports = mongoose.model('Contact', contactSchema);