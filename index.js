// Main starting point of the application
const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const app = express();
const router = require("./router");
const mongoose = require("mongoose");
const cors = require("cors");
var fs = require("fs"),
  readline = require("readline");
var request = require("request");

// Test imports
const User = require("./models/user");

// DB Setup
mongoose.connect("mongodb://localhost/users");

// App Setup
app.use(morgan("combined"));
app.use(cors());
app.use(bodyParser.json({ type: "*/*" }));
router(app);

// Test area

const user = new User({
  username: "admin",
  password: "admin",
  name: "fullNameAdmin",
  adress: "IrgendwoInBurgkirchen",
  email: "admin@mail.com",
  coordinates: { lat: 48.1983045, lng: 13.101644299999975 }
});
user.save();

// Server Setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log("Server listening on:", port);

// --------------------------------------------------------
registerAll();

// --------------------------------------------------------
// --------------------------------------------------------
// --------------------------------------------------------
// --------------------------------------------------------

function registerAll() {
  var rd = readline.createInterface({
    input: fs.createReadStream("./userlist.csv"),
    console: false
  });

  rd.on("line", function(line) {
    // Spliting the string
    var strarr = line.split(";");

    // Vars
    var lat = "";
    var lng = "";

    var rdystr = strarr[2].replace("ß", "s");

    // reverse geocoding
    request(
      "https://geocoder.api.here.com/6.2/geocode.json?app_id=FNWch6Lh7ZVz5UZAmhCH&app_code=924WDQuFvEz_H8x5pGYCDA&mapview=48.377931460161946,12.49497950077057;47.889367635038596,14.158367179334167&searchtext=" +
        rdystr,
      { json: true },
      (err, res, body) => {
        if (err) {
          return console.log(err);
        }

        var lat =
          body.Response.View[0].Result[0].Location.DisplayPosition.Latitude;
        var lng =
          body.Response.View[0].Result[0].Location.DisplayPosition.Longitude;

        // registering the user
        var User = require("./models/user");
        var newUser = new User({
          username: strarr[0] + strarr[1], // needs to be changed
          password: "admin", // needs to be changed
          name: strarr[0] + " " + strarr[1],
          adress: strarr[2],
          email: "test@mail.com", // needs to be changed
          coordinates: { lat: lat, lng: lng }
        });
        newUser.save();
      }
    );
  });
}
