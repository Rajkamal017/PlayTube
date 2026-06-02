import nodemailer  from "nodemailer"
import dotenv from "dotenv"

dotenv.config()

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

transporter.verify((error, success) => {
    if (error) {
        console.error("Transporter verification failed:", error);
    } else {
        console.log("✅ Email transporter is ready");
    }
});

const sendMail = async (to, otp) => {

    try {
        await transporter.sendMail({
            from: `"Your App Name" <${process.env.EMAIL_USER}>`,  // Better "From" display
            to: to,
            subject: "Reset Your Password",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Password Reset Request</h2>
                    <p>Your OTP for password reset is: <strong>${otp}</strong></p>
                    <p>This OTP will expire in <strong>5 minutes</strong>.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                </div>
            `,
        });

        console.log(`✅ OTP email sent to ${to}`);
    } catch (error) {
        console.error("❌ Error sending email:", error.message);
        throw new Error("Failed to send OTP email");
    }
}

export default sendMail