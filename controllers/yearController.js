const Game = require('../models/game');
const Publisher = require('../models/publisher');
const Genre = require('../models/genre');
const async = require('async');

// Display list of all games.
exports.year_list = (req, res, next) => {
  async.parallel(
    {
      publishers(callback) {
        Publisher.find(callback);
      },
      genres(callback) {
        Genre.find(callback);
      },
      list_games(callback) {
        Game.find()
          .sort([['year', 'descending']])
          .exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.list_games == null) {
        // No results.
        const err = new Error('Game not found');
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      res.render('year_list', {
        title: 'Game List by Year',
        publishers: results.publishers,
        genres: results.genres,
        game_list: results.list_games,
        max_year: results.list_games[0].year,
        min_year: results.list_games[results.list_games.length - 1].year,
      });
    }
  );
};
