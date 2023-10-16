const axios = require("axios");
var nodemailer = require('nodemailer');
const express=require('express')
const app=express()
const cors=require('cors')
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
  "PVR VR Mall, Anna Nagar", 
  "Kasi 4K Dolby Atmos, Ashok Nagar", 
  "INOX Chandra Metro Mall, Virugambakkam", 
  "INOX The Marina Mall OMR, Egatoor", 
  "AGS Cinemas OMR Navlur", 
  "PVR Palazzo-The Nexus Vijaya Mall", 
  "PVR Escape-Express Avenue Mall", 
  "PVR Sathyam Royapettah", 
  "INOX Phoenix Market City, Velachery (formerly Jazz Cinemas)",
  "PVR Grand Mall, Velachery",
  "Kamala Cinemas, Vadapalani",
  "Vettri Theatres RGB Laser, Chrompet",
]);

toEmails = [
  'harishcriro07@gmail.com',
  // 'rollingrocky360@gmail.com',
  // 'anirudhless@gmail.com',
  // 'pavan2010660@ssn.edu.in',
  // 'natarajan2010805@ssn.edu.in',
  // 'madeshwaran2010760@ssn.edu.in',
  // 'bathri768@gmail.com',
]


setInterval(() => {
  for (let date = 19; date < 23; date++)
  axios.get(`https://apiproxy.paytm.com/v3/movies/search/movie?meta=1&reqData=1&city=chennai&movieCode=rur_1kciu&date=2023-10-${date}&version=3&site_id=6&channel=HTML5&child_site_id=370`)
    .then(function (response) {
      val = response.data;
      cinemas = val.meta.cinemas;
      for (let i in cinemas) {
        if (theatres.has(cinemas[i].name) && !sent.has(cinemas[i].name + ',' + date)) {
          sent.add(cinemas[i].name + ',' + date)
          console.log(cinemas[i].name, date)
          var mailOptions = {
            from: 'movienotifier91@gmail.com',
            to: toEmails,
            subject: 'Ticket Open for leo',
            text: cinemas[i].name + " tickets have been released for date " +date+ "/10/2023" ,
          };
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
        }
      }
    })
    .catch(function (error) {
      console.error(error);
    });
}, 15000)

app.get('/ping', (req, res) => {
  res.send('pong')
})

app.listen(3000);