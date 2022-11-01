const Game = require('../models/game');
const Publisher = require('../models/publisher');
const Genre = require('../models/genre');
const async = require('async');

exports.index = (req, res) => {
  async.parallel(
    {
      game_count(callback) {
        // Find all documents
        Game.countDocuments({}, callback);
      },
      publisher_count(callback) {
        Publisher.countDocuments({}, callback);
      },
      genre_count(callback) {
        Genre.countDocuments({}, callback);
      },
    },
    (err, results) => {
      res.render('index', {
        title: 'C64 game database',
        error: err,
        data: results,
      });
    }
  );
};

// Display list of all games.
exports.game_list = (req, res, next) => {
  Game.find({}, 'title publisher')
    .sort({ title: 1 })
    .populate('publisher')
    .exec(function (err, list_games) {
      if (err) {
        return next(err);
      }
      //Successful => Render
      res.render('game_list', {
        title: 'Game List',
        game_list: list_games,
      });
    });
};

// Display detail page for a specific game.
exports.game_detail = (req, res) => {
  async.parallel(
    {
      game(callback) {
        Game.findById(req.params.id)
          .populate('publisher')
          .populate('genre')
          .exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.game == null) {
        // No results.
        const err = new Error('Game not found');
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      res.render('game_detail', {
        title: results.game.title,
        game: results.game,
      });
    }
  );
};

// Display game create form on GET.
exports.game_create_get = (req, res) => {
  res.send('NOT IMPLEMENTED: Game create GET');
};

// Handle game create on POST.
exports.game_create_post = (req, res) => {
  res.send('NOT IMPLEMENTED: Game create POST');
};

// Display game delete form on GET.
exports.game_delete_get = (req, res) => {
  res.send('NOT IMPLEMENTED: Game delete GET');
};

// Handle game delete on POST.
exports.game_delete_post = (req, res) => {
  res.send('NOT IMPLEMENTED: Game delete POST');
};

// Display game update form on GET.
exports.game_update_get = (req, res) => {
  res.send('NOT IMPLEMENTED: Game update GET');
};

// Handle game update on POST.
exports.game_update_post = (req, res) => {
  res.send('NOT IMPLEMENTED: Game update POST');
};
