// Requiring Dependencies
require("dotenv").config();
const keys = require("./keys.js");
const Spotify = require("node-spotify-api");
const axios = require("axios");
const moment = require("moment");
const fs = require("fs");

//API keys
const spotify = new Spotify(keys.spotify);
const omdb = keys.omdb.id;
const seatGeek = keys.seatGeek.id;

// Declaring variable for desired function to be executed
const action = process.argv[2];

// Used for log.txt file to display commands performed
const text = `${process.argv[2]}, ${process.argv[3]} \n`;

// Declaring variables for movie search, spotify song, and concert
let movieSearch = process.argv.slice(3).join("+");
let song = process.argv.slice(3).join(" ");
let searchTerm = process.argv.slice(3).join("-");

// Default song
if (!song) {
  song = "The Sign";
}

// Default Movie
if (!movieSearch) {
  movieSearch = "Mr. Nobody";
}

// Conditions for desired function to be performed
switch (action) {
  case "concert-this":
    concertThis();
    break;

  case "movie-this":
    movieThis();
    break;

  case "spotify-this-song":
    spotifySong();
    break;

  case "do-what-it-says":
    doThis();
    break;
}

// Function to retrieve Name of Venue, Venue Location, and Date for the Artist/Band
function concertThis() {
  axios
    .get(
      `https://api.seatgeek.com/2/events?client_id=${seatGeek}&performers.slug=${searchTerm}`
    )
    .then(function(response) {
      const concert = response.data.events;
      for (let i = 0; i < concert.length; i++) {
        const date = moment(concert[i].datetime_local).format("L");
        console.log(`Venue: ${concert[i].venue.name}
Location: ${concert[i].venue.extended_address}
Date: ${date}
==================`);
      }
    });
}

/* Function to retrieve Movie attributes: Title, Release Year, IMDB Rating, Rotten Tomatoes, Country, Language, Plot and Actors. */
function movieThis() {
  axios
    .get(`http://www.omdbapi.com/?apikey=${omdb}&t=${movieSearch}`)
    .then(function(response) {
      const movie = response.data;
      console.log(`Title: ${movie.Title}
Release Year: ${movie.Year}
IMDB Rating: ${movie.imdbRating}
Rotten Tomatoes: ${movie.Ratings[0].Value}
Country: ${movie.Country}
Language: ${movie.Language}
Plot: ${movie.Plot}
Actors: ${movie.Actors}`);
    });
}

/*Function to retrieve Artist, Song name, Preview Link, & Album associated with the desired song */
function spotifySong() {
  spotify.search({ type: "track", query: searchTerm }, function(err, data) {
    if (err) {
      return console.log("Error occurred: " + err);
    }

    for (i = 0; i < 5; i++) {
      const songInfo = data.tracks.items;
      console.log(`Artist: ${songInfo[i].artists[0].name}
Song: ${songInfo[i].name}
Preview Link: ${songInfo[i].preview_url}
Album: ${songInfo[i].album.name}

========`);
    }
  });
}

// Function to read random.txt file and perform action within in the file
function doThis() {
  fs.readFile("random.txt", "utf8", function(err, data) {
    if (err) {
      return console.log(err);
    }
    data = data.split(", ");

    if (data[0] === "spotify-this-song") {
      searchTerm = data[1];
      spotifySong();
    } else if (data[0] === "concert-this") {
      searchTerm = data[1];
      concertThis();
    } else if (data[0] === "movie-this") {
      movieSearch = data[1];
      movieThis();
    }
  });
}

fs.appendFile("log.txt", text, function(err) {
  // If an error was experienced we will log it.
  if (err) {
    console.log(err);
  }

  // If no error is experienced, we'll log the phrase "Added" to our node console.
  else {
    console.log("Added!");
  }
});