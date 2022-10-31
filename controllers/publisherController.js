const async = require('async');
const Game = require('../models/game');
const Publisher = require('../models/publisher');

// Display list of all Authors.
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
exports.publisher_detail = (req, res) => {
  res.send(`NOT IMPLEMENTED: Publisher detail: ${req.params.id}`);
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
