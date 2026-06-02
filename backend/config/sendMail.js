import { nodemailer } from "nodemailer"


const transporter = nodemailer.createTransport({
    host: "Gmail",
    port: 465,
    secure: true, 
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});


// Wrap in an async IIFE so we can use await.
(async () => {
    const info = await transporter.sendMail({
        from: '"Maddison Foo Koch" <maddison53@ethereal.email>',
        to: "bar@example.com, baz@example.com",
        subject: "Hello V",
        text: "Hello world?", // plain-text body 
        html: "<b>Hello world ?< /b>", // HTML body
    });
})