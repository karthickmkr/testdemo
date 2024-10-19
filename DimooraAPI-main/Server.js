const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3003;

app.use(
  cors({
    origin: [
      "www.dimoora.site",
      "http://localhost:3000",
      "https://www.dimoora.site",
    ], // Allow all origins
  })
);
app.options("*", cors());
app.use(bodyParser.json());


// Create transporter
const transporter = nodemailer.createTransport({
  host: "smtppro.zoho.in",
  port: 465,
  secure: true,
  auth: {
    user: "info@dimoora.site",
    pass: "Dimoorainfo@zoho01",
  },
});



// Function to send acknowledgment email
async function sendAcknowledgmentEmail(name, userEmail, subject, message) {
  const replytext = `Hello ${name}
Thanks for your intrest we will contact you shortly.  
  
Thanks & Regards,
Team Dimoora
  
Email id- info@dimoora.site`;

  const mailOptions = {
    from: "info@dimoora.site",
    to: userEmail,
    subject: subject,
    text: replytext,
  };

  // Send mail
  await transporter.sendMail(mailOptions);
}

// Function to forward request to info@thetechhorse.com
async function forwardRequestToInfo(
  name,
  userEmail,
  mail,
  userPhonenumber,
  subject,
  message
) {
  const forwardmessage = `HI ${name}`;

  const mailOptions = {
    from: mail,
    to: "info@dimoora.site",
    subject: subject,
    text: forwardmessage,
  };

  // Send mail
  await transporter.sendMail(mailOptions);
}

app.post("/ContactUs", async (req, res) => {
  const { name, userEmail, userPhonenumber, option, message,time,date } = req.body;

  try {
    // Send acknowledgment email and forward request email in parallel
    await Promise.all([
      forwardRequestToInfo(
        name,
        userEmail,
        "info@dimoora.site",
        userPhonenumber,
        option,
        message
      ),
      sendAcknowledgmentEmail(name, userEmail, option, message),
    ]);

    res.status(200).send("Request sent successfully");
  } catch (error) {
    console.error("Error processing request:", error.message);
    res.status(500).send("Error processing request");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
