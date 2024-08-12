const nodemailer = require('nodemailer');



//Create a transporter object
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'deepakch2227@gmail.com', // Your email
        pass: 'mdnf eqif vdaf ftyb' // Your password
    }
});


const sendMail = (docs) => {
    const promises = docs.map(element => {
        return new Promise((resolve, reject) => {
            var reg_no = element.reg_no;
            var email = element.email;
            var curr_sem = element.curr_sem - 1;
            var text = 'Dear ' + reg_no + "\nYou're " + curr_sem + " marks list has been issued, please collect it from the department office";
            console.log(reg_no);
            console.log(email);
            console.log(curr_sem);
            console.log(text);

            // Setup email data
            let mailOptions = {
                from: 'deepakch2227@gmail.com', // Sender address
                to: email, // List of recipients
                subject: 'Collection of ' + curr_sem + " certificate", // Subject line
                text: text // Plain text body
            };

            // Send mail
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                    reject(error);
                } else {
                    console.log('Message sent: %s', info.messageId);
                    resolve();
                }
            });
        });
    });

    return Promise.all(promises);
};







module.exports={sendMail};