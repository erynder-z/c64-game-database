// Display about page.
exports.index = (req, res, next) => {
  res.render('about', {
    title: 'About',
  });
};
