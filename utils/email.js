const nodemailer=require('nodemailer');

const sendEmail=async(options)=>{
   //1. Create a transporter//this is used to send email
   const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'beulah53@ethereal.email',
        pass: 'ygu2KGnsqYcJQj7A2R'
    }
});
    // const transporter=nodemailer.createTransport({
    //    host:process.env.EMAIL_HOST, 
    //     port:process.env.EMAIL_PORT, // Your email provider's SMTP port
    //     auth:{
    //         user: process.env.EMAIL_USERNAME, // Your email address
    //         pass: process.env.EMAIL_PASSWORD // Your email password or app password
    //     }
    // })

    //2. Define the email options
    const mailOptions={
        from:"abhay singh<abhaysingh12772@gmail.com",
        to:options.email,
        subject:options.subject,
        text:options.message
        
    }
    //3. Send the email
    await transporter.sendMail(mailOptions);
}
module.exports=sendEmail;