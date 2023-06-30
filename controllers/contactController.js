const nodemailer = require("nodemailer");
const Message = require("../models/Contact");
const cron = require("node-cron");

exports.sendEmail = async (req, res) => {
  const { email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "finaltouch960@gmail.com",
      pass: "qgvjaiskgxghghen",
    },
  });

  const mailOptions = {
    from: email,
    to: "finaltouch960@gmail.com",
    subject: "Final Touch Form",
    text: `Email: ${email}`,
    html: `
    <div>
      <p>From: ${email}</p><br/>
      <img src="https://i.ibb.co/pK1bjXK/logo512.png" alt="Final Touch" width="150" height="150" /><br/>
      <p><b>${message}</b></p>
    </div>
    `,
  };

  // Send email to admin
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send("Error sending email");
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).send("Email sent successfully");
    }
  });

  // Send confirmation email to user
  const confirmMailOptions = {
    from: "finaltouch960@gmail.com",
    to: email,
    subject: "Final Touch Form Confirmation",
    text: `Thank you for contacting me! I will get back to you shortly.`,
    html: `
    <div>
      <img src="https://i.ibb.co/pK1bjXK/logo512.png" alt="Final Touch" width="150" height="150" /><br/>
      <p>Thank you for contacting me! I will get back to you shortly.</p></br>
      <p style="direction: rtl;">شكرا لتواصلك معى! سوف أعود اليك قريبا</p></br>
      <p style="font-family: "Courier New", Courier, monospace;">Final Touch</p>
    </div>
    `,
  };

  transporter.sendMail(confirmMailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Confirmation email sent: " + info.response);
    }
  });

  // Save message to database
  const newMessage = new Message({
    email: email,
    message: message,
  });

  try {
    const savedMessage = await newMessage.save();
    console.log("Message saved to database:", savedMessage);
  } catch (error) {
    console.log(error);
  }
};

// Schedule a task to run every day at midnight
cron.schedule("0 0 * * *", async () => {
  // Calculate the date one month ago
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  // Find all messages older than one month
  const messagesToDelete = await Message.find({
    createdAt: { $lt: oneMonthAgo },
  });

  // Delete all messages older than one month
  try {
    await Message.deleteMany({ createdAt: { $lt: oneMonthAgo } });
    console.log(
      `Deleted ${messagesToDelete.length} messages older than one month`
    );
  } catch (error) {
    console.log(error);
  }
});
