const axios = require("axios");
var nodemailer = require('nodemailer');
const express = require('express')
const app = express()
const cors = require('cors')
APP_PASS = process.env.APP_PASS
var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: "movienotifier91@gmail.com",
    pass: APP_PASS
  }
});
var sent = new Set()

theatres = new Set([
  "PVR Inox VR Mall, Anna Nagar",
  "Kasi 4K Dolby Atmos, Ashok Nagar",
  "INOX National, Virugambakkam",
  "INOX The Marina Mall OMR, Egatoor",
  "AGS Cinemas OMR Navlur",
  "PVR Inox Palazzo, The Nexus Vijaya Mall",
  "PVR Inox Escape-Express Avenue Mall",
  "PVR Inox Sathyam, Royapettah Chennai",
  "INOX Phoenix Market City, Velachery (formerly Jazz Cinemas)",
  "PVR Inox Grand Mall, Velachery",
  "Kamala Cinemas, Vadapalani",
  "Vettri Theatres RGB Laser, Chrompet",
  "Casino Cinemas 4K RGB Laser 3D A/C Dolby 7.1.2, Mount Road",
  "Varadaraja Cinemas 4K RGB Laser Dolby Atmos",
  "Devi Cineplex, Anna Salai",
  "Kasi RGB Laser Dolby Atmos, Ashok Nagar"
]);

toEmails = [
  'harishcriro07@gmail.com',
  'jiitesh2003@gmail.com',
  'bathri768@gmail.com',
  'deepakkumark852@gmail.com',
  'jaivignesh12345@gmail.com',
  'mughilankathiresan@gmail.com',
  'sbnivetha@gmail.com',
  'sundar412003@gmail.com',
  'vinoth97217@gmail.com',
  'arunramana0910@gmail.com'
]

//https://apiproxy.paytm.com/v3/movies/search/movie?meta=1&reqData=1&city=chennai&movieCode=b_odqglzc&date=2024-09-06&version=3&site_id=6&channel=HTML5&child_site_id=370&client_id=ticketnew&clientId=ticketnew

setInterval(async () => {
  result = [];
  for (let date = 5; date <= 8; date++) {
    try {
      // Conditionally format the date with a leading zero if it's less than 10
      const formattedDate = date < 10 ? `0${date}` : date;
  
      const response = await axios.get(`https://apiproxy.paytm.com/v3/movies/search/movie?meta=1&reqData=1&city=chennai&movieCode=b_odqglzc&date=2024-09-${formattedDate}&version=3&site_id=6&channel=HTML5&child_site_id=370&client_id=ticketnew&clientId=ticketnew`)
      const val = response.data;
      const cinemas = val.meta.cinemas;
      // console.log(cinemas);
      for (let i in cinemas) {
        if (theatres.has(cinemas[i].name) && !sent.has(cinemas[i].name + ',' + formattedDate)) {
          sent.add(cinemas[i].name + ',' + formattedDate)
          console.log(cinemas[i].name, formattedDate)
          result.push({
            name: cinemas[i].name,
            date: formattedDate + "/09/2024\n"
          })
        }
      }
    } catch (e) {
      console.error(e)
      return
    }
  }
  
  if (result.length === 0) return;

  message = `
    <table style="border: 1px solid black; border-collapse: collapse;">
      <tr style="border: 1px solid black; border-collapse: collapse;">
        <th style="border: 1px solid black; border-collapse: collapse; padding: 8px 5px;">Theatre</th>
        <th style="border: 1px solid black; border-collapse: collapse; padding: 8px 5px;">Date</th>
      </tr>
  `
  for (let {name, date} of result)
    message += `
      <tr style="border: 1px solid black; border-collapse: collapse;">
        <td style="border: 1px solid black; border-collapse: collapse; padding: 8px 5px;">${name}</td>
        <td style="border: 1px solid black; border-collapse: collapse; padding: 8px 5px;">${date}</td>
      </tr>
    `

  message += `</table>`

  var mailOptions = {
    from: 'movienotifier91@gmail.com',
    bcc: toEmails,
    subject: 'Ticket Open for GOAT.',
    html: message,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}, 15000)

app.get('/ping', (req, res) => {
  res.send('pong')
})

app.listen(3000);