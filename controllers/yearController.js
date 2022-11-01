const Game = require('../models/game');

// Display list of all games.
exports.year_list = (req, res, next) => {
  Game.find()
    .sort([['year', 'descending']])
    .exec(function (err, list_games) {
      if (err) {
        return next(err);
      }
      //Successful => Render
      res.render('year_list', {
        title: 'Game List by Year',
        game_list: list_games,
        max_year: list_games[0].year,
        min_year: list_games[list_games.length - 1].year,
      });
    });
};
