const axios = require("axios");

const searchTerm = process.argv.slice(3).join("-");

function concertThis() {
    axios.get("https://api.seatgeek.com/2/events?client_id=MYCLIENTID&performers.slug=WHATYOURESEARCHING").then(function (response) {
        console.log(response.venue)
    })

};

function movieThis(searchTerm) {
    //console.log(searchTerm);
    axios.get(`http://www.omdbapi.com/?apikey=trilogy&t=${searchTerm}`)
        .then(function (response) {
            //console.log(response);
            console.log(response.data.Title);
            console.log(response.data.Year);
        });
};

if (process.argv[2] === "movie-this") {
    movieThis(searchTerm);
};

function spotifySong(searchTerm) {
    spotify.search({ type: 'track', query: searchTerm }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        console.log(data);

        for (i = 0; i < data.tracks[0].artists.length; i++) {
            console.log(data.tracks[0].artists[i]);
        }


    });
}



/* if (process.argv[2] === "concert-this") {
concertThis();
} */

/* if (process.argv[2] === "spotify-this-song") {
    spotifySong(searchTerm);
} */

if (process.argv[2] === "do-what-it-says") {
    fs.readFile('random.txt', "utf8", function (err, data) {
        if (err) throw err;
        if (data.split(",")[0] === "spotify-this-song") {
            spotifySong(data.split(",")[1]);
        }
    })
}


