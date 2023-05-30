
require("dotenv").config();
const { createTransport } = require ("nodemailer");
const logger = require ('./logger.js')

const GMAIL_MAIL = process.env.GMAIL_MAIL

async function sendEmail(title, msg, to, adj) {
    const transporter = createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: GMAIL_MAIL,
            pass: process.env.GMAIL_PASS
        }
    });


    const emailOptions = {
        from: GMAIL_MAIL,
        to: to,
        subject: title,
        html: msg,
    }
    if(adj) {
        let adjStream = fs.createReadStream(adj)
        emailOptions.attachments = [{
            path: adjStream
        }]
    }

    try{
        const info = await transporter.sendEmail(emailOptions)
        logger.info(`correo electrónico enviado con exito. Id: ${info.msgId}`)
    } catch (error) {
        logger.error(error)
    }
}

module.exports = {sendEmail}