#! /usr/bin/env node

console.log(
  'This script populates some test games, publishers and genres to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true'
);

console.log(process);

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async');
var Game = require('./models/game');
var Publisher = require('./models/publisher');
var Genre = require('./models/genre');

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var games = [];
var genres = [];
var publishers = [];

function publisherCreate(name, founded, defunct, cb) {
  publisherdetail = { name: name };
  if (founded != false) publisherdetail.founded = founded;
  if (defunct != false) publisherdetail.defunct = defunct;

  var publisher = new Publisher(publisherdetail);

  publisher.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Publisher: ' + publisher);
    publishers.push(publisher);
    cb(null, publisher);
  });
}

function genreCreate(name, cb) {
  var genre = new Genre({ name: name });

  genre.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Genre: ' + genre);
    genres.push(genre);
    cb(null, genre);
  });
}

function gameCreate(
  title,
  publisher,
  genre,
  year,
  summary,
  imageURL,
  played_it,
  liked_it,
  cb
) {
  gamedetail = {
    title: title,
    publisher: publisher,
  };
  if (genre != false) gamedetail.genre = genre;
  if (year != false) gamedetail.year = year;
  if (summary != false) gamedetail.summary = summary;
  if (imageURL != false) gamedetail.imageURL = imageURL;
  if (played_it != false) gamedetail.played_it = played_it;
  if (liked_it != false) gamedetail.liked_it = liked_it;

  var game = new Game(gamedetail);
  game.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Game: ' + game);
    games.push(game);
    cb(null, game);
  });
}

function createGenrePublishers(cb) {
  async.series(
    [
      function (callback) {
        publisherCreate('Epyx', 1978, 1993, callback);
      },
      function (callback) {
        publisherCreate('Accolade', 1984, 1999, callback);
      },
      function (callback) {
        publisherCreate('Broederbund', 1980, 1998, callback);
      },
      function (callback) {
        publisherCreate('Datasoft', 1980, 1987, callback);
      },
      function (callback) {
        publisherCreate('Rainbow Arts', 1984, 1999, callback);
      },
      function (callback) {
        genreCreate('Action', callback);
      },
      function (callback) {
        genreCreate('Racing', callback);
      },
      function (callback) {
        genreCreate('Sports', callback);
      },
      function (callback) {
        genreCreate('Shoot-em-up', callback);
      },
      function (callback) {
        genreCreate('Flying', callback);
      },
      function (callback) {
        genreCreate('Jump and Run', callback);
      },
    ],
    // optional callback
    cb
  );
}

function createGames(cb) {
  async.parallel(
    [
      function (callback) {
        gameCreate(
          'Summer Games',
          publishers[0],
          [genres[2]],
          1984,
          'Compete in the summer olympics against the Computer or your friends and win the most gold medals.',
          false,
          false,
          false,
          callback
        );
      },
      function (callback) {
        gameCreate(
          'Test Drive',
          publishers[1],
          [genres[1]],
          1987,
          "Street racing game. Get to the goal as fast as possible without crashing and dont't get caught by the police!",
          false,
          false,
          false,
          callback
        );
      },
      function (callback) {
        gameCreate(
          'Choplifter',
          publishers[2],
          [genres[3], genres[4]],
          1987,
          'Control a helicopter and rescure your soldiers from the battlefield.',
          false,
          false,
          false,
          callback
        );
      },
      function (callback) {
        gameCreate(
          'Bruce Lee',
          publishers[3],
          [genres[1]],
          1984,
          'Search and defeat the evil sorcerer while continuously fighting against Yamo and the black ninja.',
          false,
          false,
          false,
          callback
        );
      },
      function (callback) {
        gameCreate(
          'The Great Giana Sisters',
          publishers[4],
          [genres[5]],
          1987,
          'Classic Jump and Run game like Super Mario Bros.',
          false,
          false,
          false,
          callback
        );
      },
      function (callback) {
        gameCreate(
          'Katakis',
          publishers[4],
          [genres[0], genres[3]],
          1988,
          'Sidescrolling shmup with awesome music!',
          false,
          false,
          false,
          callback
        );
      },
      function (callback) {
        gameCreate(
          'Turrican',
          publishers[4],
          [genres[0], genres[5]],
          1990,
          'Action-oriented jump and run. ',
          false,
          false,
          false,
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

async.series(
  [createGenrePublishers, createGames],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log('FINAL ERR: ' + err);
    } else {
      console.log(' Added games: ' + games);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
