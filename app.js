const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const https = require("https");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});
app.get("/failure", (req, res) => {
  res.redirect("/");
});

app.post("/", (req, res) => {
  let firstName = req.body.fname;
  let secondName = req.body.sname;
  let email = req.body.email;
  let data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: secondName,
        },
      },
    ],
  };
  let jsonData = JSON.stringify(data);
  //   Now we are ready to make our request to API
  const options = {
    method: "POST",
    auth: "Salem:19ef149b7063530d98c1ae13cc73d8c7w-us21",
  };
  const url = "https://us21.api.mailchimp.com/3.0/lists/50277db7dc";
  const postRequest = https.request(url, options, (response) => {
    if (response.statusCode == 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", (data) => {
      console.log(JSON.parse(data));
    });
  });
  //   Now we use our postRequest to send the data
  postRequest.write(jsonData);
  postRequest.end();
});
app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port 3000");
});

// API key
// 19ef149b7063530d98c1ae13cc73d8c7-us21

// List ID
// 50277db7dc
