require("dotenv").config();
const axios = require("axios");
var moment = require("moment");
var keys = require("../Liri/keys");
var Twitter = require("twitter");
var client = new Twitter(keys.twitterKeys);
var request = require("request");
var Spotify = require("node-spotify-api");
var fs = require("fs");
// var client = new Twitter(keys.twitter);
var input = process.argv;
var action = input[2];
var inputs = input[3];
console.log("input is: ", input);
//Switch statement to switch between environment

switch (action) {
  case "concert-this":
    bandsInTown(inputs);
    break;

  case "my-tweets":
    twitter(inputs);
    break;

  case "spotify-this-song":
    spotify(inputs);
    break;

  case "movie-this":
    movie(inputs);
    break;

  case "do-what-it-says":
    doIt();
    break;
}

function bandsInTown(inputs) {
  // console.log(inputs)
  var queryURL =
    "https://rest.bandsintown.com/artists/" +
    inputs +
    "/events?app_id=codingbootcamp";
  axios({
    method: "get",
    url: queryURL
  })
    .then(function(response) {
      for (var i = 0; i < response.data.length; i++) {
        var event = response.data[i];
        console.log("------------------\n");
        console.log(event.venue.name);
        console.log(moment(event.datetime).format("MM/DD/YYYY"));
        console.log(
          event.venue.city +
            ", " +
            event.venue.region +
            ", " +
            event.venue.country
        );
      }
    })
    .catch(error => console.log(error));
}
function twitter(inputs) {
  var params = { screen_name: inputs, count: 20 };

  client.get("statuses/user_timeline", params, function(
    error,
    tweets,
    response
  ) {
    if (!error) {
      for (i = 0; i < tweets.length; i++) {
        console.log(
          "Tweet: " +
            "'" +
            tweets[i].text +
            "'" +
            " Created At: " +
            tweets[i].created_at
        );
      }
    } else {
      console.log(error);
    }
  });
}
//Spotify
function spotify(inputs) {
  var spotify = new Spotify(keys.spotify);
  if (!inputs) {
    inputs = "The sign";
  }
  spotify.search(
    {
      type: "track",
      query: inputs,
      limit: 10
    },
    function(err, data) {
      if (err) {
        return console.log("Error occurred: " + err);
      }

      //console.log(data.tracks.items[0]);
      var songInfo = data.tracks.items;
      console.log("Artist(s): " + songInfo[0].artists[0].name);
      console.log("Song Name:" + songInfo[0].name);
      if (songInfo[0].preview_url !== null)
        console.log("Preview Link:" + songInfo[0].preview_url);
      console.log("Album: " + songInfo[0].album.name);
    }
  );
}
//IMDB

function movie(userInput) {
  axios({
    method: "get",
    url:
      "http://www.omdbapi.com/?t=" + userInput + "&y=&plot=short&apikey=trilogy"
  }).then(function(response) {
    console.log("response is:", response);

    var movieResult = `/n
    Title: ${response.data.Title}
    Released: ${response.data.Year}
    IMDB Rating: ${response.data.imdbRating}
    Rotten Tomatos Rating: ${response.data.Ratings[1].Value}
    Country: ${response.data.Country}
    Language: ${response.data.Language}
    Plot: ${response.data.Plot}
    Actors: ${response.data.Actors}
    `;

    console.log(movieResult);
    dataLog(movieResults);
  });
}

function doIt() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    var coolArr = data.split(",");
    if (coolArr.length === 2) {
      spotify(coolArr[1]);
    } else if (coolArr.length < 2) {
      console.log("Need more info before completing your request!!!");
    } else {
      console.log(error);
    }
  });
}

// BONUS
// In addition to logging the data to your terminal/bash window, output the data to a .txt file called log.txt.
// Make sure you append each command you run to the log.txt file.
// Do not overwrite your file each time you run a command.
function writeToLog(printInfo) {
  fs.appendFile("log.txt", printInfo, function(err) {
    // If the code experiences any errors it will log the error to the console.
    if (err) {
      return console.log(err);
    }
  });
}
writeToLog();