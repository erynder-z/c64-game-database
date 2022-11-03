const { body, validationResult } = require('express-validator');
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
      publishers(callback) {
        Publisher.find(callback);
      },
      genres(callback) {
        Genre.find(callback);
      },
    },
    (err, results) => {
      res.render('index', {
        title: 'C64 game database',
        error: err,
        game_count: results.game_count,
        publisher_count: results.publisher_count,
        genre_count: results.genre_count,
        publishers: results.publishers,
        genres: results.genres,
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
exports.game_create_get = (req, res, next) => {
  async.parallel(
    {
      publishers(callback) {
        Publisher.find(callback);
      },
      genres(callback) {
        Genre.find(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      res.render('add_game_form', {
        title: 'Add Game',
        publishers: results.publishers,
        genres: results.genres,
      });
    }
  );
};

// Handle game create on POST.
exports.game_create_post = [
  (req, res, next) => {
    if (!Array.isArray(req.body.genre)) {
      req.body.genre =
        typeof req.body.genre === 'undefined' ? [] : [req.body.genre];
    }
    next();
  },

  // Validate and sanitize fields.
  body('title', 'Title must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('publisher', 'Publisher must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('summary', 'Summary must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('genre.*').escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Book object with escaped and trimmed data.
    const game = new Game({
      title: req.body.title,
      publisher: req.body.publisher,
      summary: req.body.summary,
      genre: req.body.genre,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all authors and genres for form.
      async.parallel(
        {
          publishers(callback) {
            Publisher.find(callback);
          },
          genres(callback) {
            Genre.find(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }

          // Mark our selected genres as checked.
          for (const genre of results.genres) {
            if (game.genre.includes(genre._id)) {
              genre.checked = 'true';
            }
          }
          res.render('add_game_form', {
            title: 'Add Game',
            publishers: results.publishers,
            genres: results.genres,
            game,
            errors: errors.array(),
          });
        }
      );
      return;
    }

    // Data from form is valid. Save book.
    game.save((err) => {
      if (err) {
        return next(err);
      }
      // Successful: redirect to new book record.
      res.redirect(game.url);
    });
  },
];

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
