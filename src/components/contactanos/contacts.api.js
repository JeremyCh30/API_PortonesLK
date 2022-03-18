const contactModel = require('./contacts.model');

//envio de mensajes con twilioSandbox
const accountSid = process.env.WHATSAPP_SID;
const authToken = process.env.WHATSAPP_TOKEN;
const client = require('twilio')(accountSid, authToken); 
//envio de correos con nodemailer
const nodeMailer=require('nodemailer');
const transporter=nodeMailer.createTransport({
    service: 'gmail',
    auth:{
        user: process.env.MAIL_USER,
        pass: process.env.PASS_USER
    }
});


module.exports.registrarContacto = function (req, res) {

    let nuevoContacto = new contactModel({
        hora: req.body.hora,
        fecha: req.body.fecha,
        nombre: req.body.nombre,
        telefono: req.body.telefono,
        email: req.body.email,
        servicio: req.body.servicio,
        mensaje: req.body.mensaje
    });

    //mensaje creado apartir de los datos del formulario
    let mensajeWhatsapp="Ha recibido un mensaje de *"+nuevoContacto.nombre+"*, desde el formulario de Contacto de Servicios LK. \n\nTeléfono: *"+nuevoContacto.telefono+"* \n\nServicio: "+nuevoContacto.servicio+" \n\nInformación solicitada: "+nuevoContacto.mensaje+" \n\nCorreo del destinatario del mensaje: *"+nuevoContacto.email+"*"

    nuevoContacto.save(function (error) {
        if (error) {
            res.json({ success: false, msg: 'No se pudo enviar el mensaje, ocurrió el siguiente error ' + error });
        } else {
            //Se envia mensaje de whatsapp con los datos de la persona que envia el mensaje
            client.messages 
                .create({ 
                    body: mensajeWhatsapp,
                    from: 'whatsapp:+14155238886',       
                    to: 'whatsapp:+50671874841' 
                }) 
                .then(message => console.log(message.sid)) 
                .done();
            
            //Se envia mensaje de correo con los datos de la persona que envia el mensaje
            let mailOptions = {
                from: 'Servicios LK',
                to: process.env.MAIL_USER,
                subject: 'Recibio un mensaje desde el Formulario de contacto de Servicios LK',
                html: `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet">
                    <style>
                    html{
                    font-family: 'Lato', sans-serif;
                    font-size: 16px;
                    background-color: #c0392b;
                    line-height: 1;
                }
                .titulo{
                    font-size: 26px;
                    color: #2980b9;
                }
                .text{
                    line-height: 24px;
                }
                .box{
                    margin: 0 auto;
                    text-align: center;
                    width: 410px;
                    background-color: #ffffff;
                    padding: 35px;
                    border-radius: 20px;
                }
                .boton{
                    background-color: #c0392b;
                    padding: 10px;
                    text-decoration: none;
                    color: #ffffff;
                    border-radius: 10px;
                }
                .firma{
                    margin-top: 40px;
                }
                    </style>
                </head>
                
                <body>
                    <div class="box">
                        <h1 class="titulo">Mensaje recibido desde el Formulario de contacto</h1>
                        <p class="text">${nuevoContacto.nombre} pidió información sobre el servicio: ${nuevoContacto.servicio}</p>

                        <p class="text">${nuevoContacto.nombre} dejó el siguiente mensaje: ${nuevoContacto.mensaje}</p>

                        <p class="text">El número de teléfono brindado para contactarlo es: ${nuevoContacto.telefono}</p>
                        <p class="text">El correo brindado para contactarlo es: ${nuevoContacto.email}</p>
                        
                        
                        <p class="firma">--Servicios LK--</p>  
                    </div>
                </body>
                
                </html>`

            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Correo enviado' + info.response);
                };
            });

            res.json({ success: true, msg: 'El mensaje se envió con éxito'});
        }
    });
};