const express = require('express');
const router = express.Router();

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 1000000 } }); // max 1 mb

// Require controller modules.
const game_controller = require('../controllers/gameController');
const publisher_controller = require('../controllers/publisherController');
const genre_controller = require('../controllers/genreController');
const year_controller = require('../controllers/yearController');
const about_controller = require('../controllers/aboutController');

/// GAME ROUTES ///

// GET library home page.
router.get('/', game_controller.index);

// GET library home page.
router.get('/about', about_controller.index);

// GET request for creating a Game. NOTE This must come before routes that display Game (uses id).
router.get('/game/create', game_controller.game_create_get);

// POST request for creating Game.
router.post(
  '/game/create',
  upload.single('imagePicker'),
  game_controller.game_create_post
);

// GET request to delete Game.
router.get('/game/:id/delete', game_controller.game_delete_get);

// POST request to delete Game.
router.post('/game/:id/delete', game_controller.game_delete_post);

// GET request to update Game.
router.get('/game/:id/update', game_controller.game_update_get);

// POST request to update Game.
router.post(
  '/game/:id/update',
  upload.single('imagePicker'),
  game_controller.game_update_post
);

// GET request to lock Game.
router.get('/game/:id/lock', game_controller.game_lock_get);

// POST request to lock Game.
router.post('/game/:id/lock', game_controller.game_lock_post);

// GET request to unlock Game.
router.get('/game/:id/unlock', game_controller.game_unlock_get);

// POST request to unlock Game.
router.post('/game/:id/unlock', game_controller.game_unlock_post);

// POST request to update Game-played_it.
router.post('/game/:id/played_it', game_controller.game_played_it_post);

// POST request to update Game-liked_it.
router.post('/game/:id/liked_it', game_controller.game_liked_it_post);

// GET request for one Game.
router.get('/game/:id', game_controller.game_detail);

// GET request for list of all Game items.
router.get('/games', game_controller.game_list);

/// PUBLISHER ROUTES ///

// GET request for creating Publisher. NOTE This must come before route for id (i.e. display publisher).
router.get('/publisher/create', publisher_controller.publisher_create_get);

// POST request for creating Publisher.
router.post('/publisher/create', publisher_controller.publisher_create_post);

// GET request to delete Publisher.
router.get('/publisher/:id/delete', publisher_controller.publisher_delete_get);

// POST request to delete Publisher.
router.post(
  '/publisher/:id/delete',
  publisher_controller.publisher_delete_post
);

// GET request to update Publisher.
router.get('/publisher/:id/update', publisher_controller.publisher_update_get);

// POST request to update Publisher.
router.post(
  '/publisher/:id/update',
  publisher_controller.publisher_update_post
);

// GET request to lock Publisher.
router.get('/publisher/:id/lock', publisher_controller.publisher_lock_get);

// POST request to lock Publisher.
router.post('/publisher/:id/lock', publisher_controller.publisher_lock_post);

// GET request to unlock Publisher.
router.get('/publisher/:id/unlock', publisher_controller.publisher_unlock_get);

// POST request to unlock Publisher.
router.post(
  '/publisher/:id/unlock',
  publisher_controller.publisher_unlock_post
);

// GET request for one Publisher.
router.get('/publisher/:id', publisher_controller.publisher_detail);

// GET request for list of all Publishers.
router.get('/publishers', publisher_controller.publisher_list);

/// GENRE ROUTES ///

// GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id).
router.get('/genre/create', genre_controller.genre_create_get);

//POST request for creating Genre.
router.post('/genre/create', genre_controller.genre_create_post);

// GET request to delete Genre.
router.get('/genre/:id/delete', genre_controller.genre_delete_get);

// POST request to delete Genre.
router.post('/genre/:id/delete', genre_controller.genre_delete_post);

// GET request to update Genre.
router.get('/genre/:id/update', genre_controller.genre_update_get);

// POST request to update Genre.
router.post('/genre/:id/update', genre_controller.genre_update_post);

// GET request to lock Genre.
router.get('/genre/:id/lock', genre_controller.genre_lock_get);

// POST request to lock Genre.
router.post('/genre/:id/lock', genre_controller.genre_lock_post);

// GET request to unlock Genre.
router.get('/genre/:id/unlock', genre_controller.genre_unlock_get);

// POST request to unlock Genre.
router.post('/genre/:id/unlock', genre_controller.genre_unlock_post);

// GET request for one Genre.
router.get('/genre/:id', genre_controller.genre_detail);

// GET request for list of all Genre.
router.get('/genres', genre_controller.genre_list);

/// YEAR ROUTES ///

// GET request for list of all Years.
router.get('/years', year_controller.year_list);

module.exports = router;
