const { body, validationResult } = require('express-validator');
const async = require('async');
const Game = require('../models/game');
const Publisher = require('../models/publisher');

// Display list of all Publishers.
exports.publisher_list = (req, res, next) => {
  Publisher.find()
    .sort([['name', 'ascending']])
    .exec(function (err, list_publishers) {
      if (err) {
        return next(err);
      }
      //Successful, so render
      res.render('publisher_list', {
        title: 'Publisher List',
        publisher_list: list_publishers,
      });
    });
};

// Display detail page for a specific Publisher.
exports.publisher_detail = (req, res, next) => {
  async.parallel(
    {
      publisher(callback) {
        Publisher.findById(req.params.id).exec(callback);
      },
      publishers_games(callback) {
        Game.find({ publisher: req.params.id }, 'title summary').exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        // Error in API usage.
        return next(err);
      }
      if (results.publisher == null) {
        // No results.
        const err = new Error('Publisher not found');
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      res.render('publisher_detail', {
        title: 'Publisher Detail',
        publisher: results.publisher,
        publisher_games: results.publishers_games,
      });
    }
  );
};

// Display Publisher create form on GET.
exports.publisher_create_get = (req, res) => {
  res.render('add_publisher_form', { title: 'Create Publisher' });
};

// Handle Publisher create on POST.
exports.publisher_create_post = [
  // Validate and sanitize fields.
  body('publisherName')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Name must be specified.'),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render('add_publisher_form', {
        title: 'Create Publisher',
        publisher: req.body,
        errors: errors.array(),
      });
      return;
    } // Data from form is valid.
    // Check if Author with same name already exists.
    Publisher.findOne({
      name: req.body.publisherName,
    }).exec((err, found_publisher) => {
      if (err) {
        return next(err);
      }

      if (found_publisher) {
        // Author exists, redirect to its detail page.
        res.redirect(found_publisher.url);
      } else {
        // Create an Author object with escaped and trimmed data.
        const publisher = new Publisher({
          name: req.body.publisherName,
          founded: req.body.founded,
          defunct: req.body.defunct,
        });
        publisher.save((err) => {
          if (err) {
            return next(err);
          }
          // Successful - redirect to new author record.
          res.redirect(publisher.url);
        });
      }
    });
  },
];

// Display Publisher delete form on GET.
exports.publisher_delete_get = (req, res) => {
  async.parallel(
    {
      publisher(callback) {
        Publisher.findById(req.params.id).exec(callback);
      },
      publishers_games(callback) {
        Game.find({ publisher: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.publisher == null) {
        // No results.
        res.redirect('/library/publishers');
      }
      // Successful, so render.
      res.render('publisher_delete', {
        title: 'Delete Publisher',
        publisher: results.publisher,
        publisher_games: results.publishers_games,
      });
    }
  );
};

// Handle Publisher delete on POST.
exports.publisher_delete_post = (req, res) => {
  async.parallel(
    {
      publisher(callback) {
        Publisher.findById(req.body.publisherid).exec(callback);
      },
      publishers_games(callback) {
        Game.find({ publisher: req.body.publisherid }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      // Success
      if (results.publishers_games.length > 0) {
        // Publisher has games. Render in same way as for GET route.
        res.render('publisher_delete', {
          title: 'Delete Publisher',
          publisher: results.publisher,
          publisher_games: results.publishers_games,
        });
        return;
      }
      // Publisher has no games. Delete object and redirect to the list of publishers.
      Publisher.findByIdAndRemove(req.body.publisherid, (err) => {
        if (err) {
          return next(err);
        }
        // Success - go to author list
        res.redirect('/library/publishers');
      });
    }
  );
};

// Display Publisher update form on GET.
exports.publisher_update_get = (req, res) => {
  res.send('NOT IMPLEMENTED: Publisher update GET');
};

// Handle Publisher update on POST.
exports.publisher_update_post = (req, res) => {
  res.send('NOT IMPLEMENTED: Publisher update POST');
};
