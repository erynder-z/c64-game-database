const Game = require('../models/game');

// Display list of all games.
exports.year_list = (req, res, next) => {
  Game.find()
    .sort([['year', 'descending']])
    .exec(function (err, list_games) {
      if (err) {
        return next(err);
      }

      // filter games where no year exists
      const filteredList = list_games.filter((game) => game.year != undefined);

      //Successful => Render
      res.render('year_list', {
        title: 'Game List by Year',
        game_list: list_games,
        max_year: filteredList[0].year,
        min_year: filteredList[filteredList.length - 1].year,
      });
    });
};
