const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user:'mindsparkpillreminder01@gmail.com',
        pass:'omof cacf vcvm yyqo'
    }
});

const Longitud = 4;
let codigoV  = [];
for(let i = 1; i <= Longitud; i++){
    codigoV.push(Math.floor(Math.random()*10));
}

console.log(codigoV.join(""));

const mailOptions = {
    from:'mindsparkpillreminder01@gmail.com',
    to: '0227489@up.edu.mx',
    subject : 'Correo prueba',
    text : 'Tu codigo de verifiación es:' + codigoV.join(""),
};

transporter.sendMail(mailOptions,
    function(error,info){
        if(error){
            console.log(error);
        } else {
            console.log('Correo enviado' + info.response);
        }
    });