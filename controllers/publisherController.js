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
