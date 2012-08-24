/**
 * Main application file for RoboWARS
 */

var express = require('express'),
	routes = require('./routes');
	game = require('./game');

var app = module.exports = express.createServer();
var io = require('socket.io').listen(app);

// Express configuration

app.configure(function(){
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
	app.use(express.errorHandler());
});

// Express routes.

app.get('/', routes.index);
app.listen(3000);

// Game socket logic (managing).

var gameCount = 0, games = { '0': new game.Game() };

io.of('/api/game').on('connection', function (socket) {

	var player = new game.Player(socket); // initialize player

	// Create a new game.
	socket.on('create', function() {
		// TODO: Create game.
		// player.joinGame(newGame);
	});

	// Join an existing game.
	socket.on('join', function() {
		player.leaveGame();
		player.joinGame(games['0']);
	});

	// Player actions are executed.
	socket.on('actions', function(_sequence, _actions) {
		player.pushActions(_sequence, _actions);
	});

	// When disconnected close player.
	socket.on('disconnect', function () {
		player.leaveGame();
	});
});

console.log("RoboWARS server listening on port %d in %s mode", app.address().port, app.settings.env);
