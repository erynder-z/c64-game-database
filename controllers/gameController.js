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
    },
    (err, results) => {
      res.render('index', {
        title: 'C64 game database',
        error: err,
        publisher_count: results.publisher_count,
        game_count: results.game_count,
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

    // Create a Game object with escaped and trimmed data.
    const game = new Game({
      title: req.body.title,
      publisher: req.body.publisher,
      summary: req.body.summary,
      genre: req.body.genre,
      year: req.body.year,
      img: {
        data: req.file?.buffer,
        contentType: req.file?.mimetype,
      },
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all publishers and genres for form.
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
  Game.findById(req.params.id)
    .populate('publisher')
    .populate('genre')
    .exec(function (err, result) {
      if (err) {
        return next(err);
      }
      //Successful => Render
      res.render('game_delete', {
        title: 'Delete Game',
        game: result,
      });
    });
};

// Handle game delete on POST.
exports.game_delete_post = (req, res) => {
  Game.findById(req.params.id)
    .populate('publisher')
    .populate('genre')
    .exec(function (err, result) {
      if (err) {
        return next(err);
      }
      // Success. Delete object and redirect to the list of bookinstances.
      Game.findByIdAndRemove(req.body.gameid, (err) => {
        if (err) {
          return next(err);
        }
        // Success - go to game list
        res.redirect('/library/games');
      });
    });
};

// Display game update form on GET.
exports.game_update_get = (req, res) => {
  // Get game, publisheres and genres for form.
  async.parallel(
    {
      game(callback) {
        Game.findById(req.params.id)
          .populate('publisher')
          .populate('genre')
          .exec(callback);
      },
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
      if (results.game == null) {
        // No results.
        const err = new Error('Game not found');
        err.status = 404;
        return next(err);
      }
      // Success.
      // Mark our selected genres as checked.
      for (const genre of results.genres) {
        for (const gameGenre of results.game.genre) {
          if (genre._id.toString() === gameGenre._id.toString()) {
            genre.checked = 'true';
          }
        }
      }
      res.render('add_game_form', {
        title: 'Update Game',
        publishers: results.publishers,
        genres: results.genres,
        game: results.game,
      });
    }
  );
};

// Handle game update on POST.
exports.game_update_post = [
  // Convert the genre to an array
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

    // Create a Book object with escaped/trimmed data and old id.
    const game = new Game({
      title: req.body.title,
      publisher: req.body.publisher,
      summary: req.body.summary,
      genre: typeof req.body.genre === 'undefined' ? [] : req.body.genre,
      year: req.body.year,
      _id: req.params.id, //This is required, or a new ID will be assigned!
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
            title: 'Update Game',
            publishers: results.publishers,
            genres: results.genres,
            game,
            errors: errors.array(),
          });
        }
      );
      return;
    }

    // Data from form is valid. Update the record.
    Game.findByIdAndUpdate(req.params.id, game, {}, (err, theGame) => {
      if (err) {
        return next(err);
      }

      // Successful: redirect to book detail page.
      res.redirect(theGame.url);
    });
  },
];

exports.game_played_it_post = (req, res) => {
  Game.findByIdAndUpdate(
    req.params.id,
    { $inc: { played_it: 1 } },
    function (err, theGame) {
      if (err) {
        console.log(err);
      } else {
        res.redirect(theGame.url);
      }
    }
  );
};

exports.game_liked_it_post = (req, res) => {
  Game.findByIdAndUpdate(
    req.params.id,
    { $inc: { liked_it: 1 } },
    function (err, theGame) {
      if (err) {
        console.log(err);
      } else {
        res.redirect(theGame.url);
      }
    }
  );
};
