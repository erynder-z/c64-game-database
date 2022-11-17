const { body, validationResult } = require('express-validator');
const env = require('dotenv').config().parsed;
const async = require('async');
const Genre = require('../models/genre');
const Game = require('../models/game');

// Display list of all Genre.
exports.genre_list = (req, res, next) => {
  Genre.find()
    .sort([['name', 'ascending']])
    .exec(function (err, list_genres) {
      if (err) {
        return next(err);
      }
      //Successful, so render
      res.render('genre_list', {
        title: 'Genre List',
        genre_list: list_genres,
      });
    });
};

// Display detail page for a specific Genre.
exports.genre_detail = (req, res, next) => {
  async.parallel(
    {
      genre(callback) {
        Genre.findById(req.params.id).exec(callback);
      },

      genre_games(callback) {
        Game.find({ genre: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.genre == null) {
        // No results.
        const err = new Error('Genre not found');
        err.status = 404;
        return next(err);
      }
      // Successful, so render
      res.render('genre_detail', {
        title: 'Genre Detail',
        genre: results.genre,
        genre_games: results.genre_games,
      });
    }
  );
};

// Display Genre create form on GET.
exports.genre_create_get = (req, res) => {
  res.render('add_genre_form', { title: 'Create Genre' });
};

// Handle Genre create on POST.
exports.genre_create_post = [
  // Validate and sanitize the name field.
  body('genreName', 'Genre name required').trim().isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    const genre = new Genre({ isLocked: false, name: req.body.genreName });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('add_genre_form', {
        title: 'Create Genre',
        genre,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Genre with same name already exists.
      Genre.findOne({ name: req.body.genreName }).exec((err, found_genre) => {
        if (err) {
          return next(err);
        }

        if (found_genre) {
          // Genre exists, redirect to its detail page.
          res.redirect(found_genre.url);
        } else {
          genre.save((err) => {
            if (err) {
              return next(err);
            }
            // Genre saved. Redirect to genre detail page.
            res.redirect(genre.url);
          });
        }
      });
    }
  },
];

// Display Genre delete form on GET.
exports.genre_delete_get = (req, res) => {
  async.parallel(
    {
      genre(callback) {
        Genre.findById(req.params.id).exec(callback);
      },
      genre_games(callback) {
        Game.find({ genre: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.genre == null) {
        // No results.
        res.redirect('/library/genres');
      }
      if (results.genre.isLocked) {
        //locked publisher => prevent update
        res.render('unable_action', {
          title: 'Unable to delete',
          genre: results.genre,
        });
      } else {
        // Successful, so render.
        res.render('genre_delete', {
          title: 'Delete Genre',
          genre: results.genre,
          genre_games: results.genre_games,
        });
      }
    }
  );
};

// Handle Genre delete on POST.
exports.genre_delete_post = (req, res) => {
  async.parallel(
    {
      genre(callback) {
        Genre.findById(req.body.genreid).exec(callback);
      },
      genre_games(callback) {
        Game.find({ genre: req.body.genreid }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      // Success
      if (results.genre_games.length > 0) {
        // Genre has games. Render in same way as for GET route.
        res.render('genre_delete', {
          title: 'Delete Genre',
          genre: results.genre,
          genre_games: results.genre_games,
        });
        return;
      }
      // Genre has no games. Delete object and redirect to the list of genres.
      Genre.findByIdAndRemove(req.body.genreid, (err) => {
        if (err) {
          return next(err);
        }
        // Success - go to genre list
        res.redirect('/library/genres');
      });
    }
  );
};

// Display Genre update form on GET.
exports.genre_update_get = (req, res) => {
  // Get game, publishers and genres for form.
  async.parallel(
    {
      genre(callback) {
        Genre.findById(req.params.id).exec(callback);
      },
      genre_games(callback) {
        Game.find({ genre: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.genre == null) {
        // No results.
        const err = new Error('Genre not found');
        err.status = 404;
        return next(err);
      }
      if (results.genre.isLocked) {
        //locked genre => prevent update
        res.render('unable_action', {
          title: 'Unable to update',
          genre: results.genre,
        });
      } else {
        // Success.
        res.render('add_genre_form', {
          title: 'Update Genre',
          genre: results.genre,
          genre_games: results.genre_games,
        });
      }
    }
  );
};

// Handle Genre update on POST.
exports.genre_update_post = [
  // Validate and sanitize the name field.
  body('genreName', 'Genre name required').trim().isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    const genre = new Genre({
      name: req.body.genreName,
      _id: req.params.id, //This is required, or a new ID will be assigned!
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values and error messages.
      res.render('add_genre_form', {
        title: 'Update Genre',
        genre: genre,
        errors: errors.array(),
      });
      return;
    }

    // Data from form is valid. Update the record.
    Genre.findByIdAndUpdate(req.params.id, genre, {}, (err, theGenre) => {
      if (err) {
        return next(err);
      }

      // Successful: redirect to book detail page.
      res.redirect(theGenre.url);
    });
  },
];

exports.genre_lock_get = (req, res) => {
  Genre.findById(req.params.id).exec(function (err, result) {
    if (err) {
      return next(err);
    }
    res.render('confirm_action_form', {
      title: 'Lock Genre',
      genre: result,
    });
  });
};

exports.genre_lock_post = [
  // Validate and sanitize fields.
  body('passwordInput')
    .custom((value, { req }) => {
      if (value !== env.lock_password) {
        throw new Error('Wrong password');
      }
      // Indicates the success of this synchronous custom validator
      return true;
    })
    .escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    Genre.findById(req.params.id).exec(function (err, result) {
      if (err) {
        return next(err);
      }
      const genre = new Genre({
        isLocked: true,
        name: req.body.genreName,
        _id: req.params.id, //This is required, or a new ID will be assigned!
      });

      // if there are errors => re-render and display error message
      if (!errors.isEmpty()) {
        Genre.findById(req.params.id).exec(function (err, result) {
          if (err) {
            return next(err);
          }
          res.render('confirm_action_form', {
            title: 'Lock Genre',
            genre: result,
            errors: errors.array(),
          });
        });
        return;
      }

      // Data from form is valid. Update the record.
      Genre.findByIdAndUpdate(req.params.id, genre, {}, (err, theGenre) => {
        if (err) {
          return next(err);
        }

        // Successful: redirect to game detail page.
        res.redirect(theGenre.url);
      });
    });
  },
];

exports.genre_unlock_get = (req, res) => {
  Genre.findById(req.params.id).exec(function (err, result) {
    if (err) {
      return next(err);
    }
    res.render('confirm_action_form', {
      title: 'Unlock Genre',
      genre: result,
    });
  });
};

exports.genre_unlock_post = [
  // Validate and sanitize fields.
  body('passwordInput')
    .custom((value, { req }) => {
      if (value !== env.lock_password) {
        throw new Error('Wrong password');
      }

      // Indicates the success of this synchronous custom validator
      return true;
    })
    .escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    Genre.findById(req.params.id).exec(function (err, result) {
      if (err) {
        return next(err);
      }
      const genre = new Genre({
        isLocked: false,
        name: req.body.genreName,
        _id: req.params.id, //This is required, or a new ID will be assigned!
      });

      // if there are errors => re-render and display error message
      if (!errors.isEmpty()) {
        Genre.findById(req.params.id).exec(function (err, result) {
          if (err) {
            return next(err);
          }
          res.render('confirm_action_form', {
            title: 'Unlock Genre',
            genre: result,
            errors: errors.array(),
          });
        });
        return;
      }

      // Data from form is valid. Update the record.
      Genre.findByIdAndUpdate(req.params.id, genre, {}, (err, theGenre) => {
        if (err) {
          return next(err);
        }

        // Successful: redirect to genre detail page.
        res.redirect(theGenre.url);
      });
    });
  },
];
