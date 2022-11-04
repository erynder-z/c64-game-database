const async = require('async');
const Game = require('../models/game');
const Genre = require('../models/genre');
const Publisher = require('../models/publisher');

// Display list of all Publishers.
exports.publisher_list = (req, res, next) => {
  async.parallel(
    {
      genres(callback) {
        Genre.find(callback);
      },
      list_publishers(callback) {
        Publisher.find()
          .sort([['name', 'ascending']])
          .exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.list_publishers == null) {
        // No results.
        const err = new Error('Publisher not found');
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      res.render('publisher_list', {
        title: 'Publisher List',

        genres: results.genres,
        publishers: results.list_publishers,
      });
    }
  );
};

// Display detail page for a specific Publisher.
exports.publisher_detail = (req, res, next) => {
  async.parallel(
    {
      genres(callback) {
        Genre.find(callback);
      },
      // get all publishers for the modal selectboxes
      publishers(callback) {
        Publisher.find(callback);
      },
      // get the desired publishers' details
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
        genres: results.genres,
        publishers: results.publishers,
        publisher: results.publisher,
        publisher_games: results.publishers_games,
      });
    }
  );
};

// Display Publisher create form on GET.
exports.publisher_create_get = (req, res) => {
  res.send('NOT IMPLEMENTED: Publisher create GET');
};

// Handle Publisher create on POST.
exports.publisher_create_post = (req, res) => {
  res.send('NOT IMPLEMENTED: Publisher create POST');
};

// Display Publisher delete form on GET.
exports.publisher_delete_get = (req, res) => {
  res.send('NOT IMPLEMENTED: Publisher delete GET');
};

// Handle Publisher delete on POST.
exports.publisher_delete_post = (req, res) => {
  res.send('NOT IMPLEMENTED: Publisher delete POST');
};

// Display Publisher update form on GET.
exports.publisher_update_get = (req, res) => {
  res.send('NOT IMPLEMENTED: Publisher update GET');
};

// Handle Publisher update on POST.
exports.publisher_update_post = (req, res) => {
  res.send('NOT IMPLEMENTED: Publisher update POST');
};
