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

var gameCount = 0, games = { '0': new game.Game() }, playerSeq = 0;

io.of('/api/game').on('connection', function (socket) {

	var player = new game.Seat(socket); // initialize player

	// Initialize player (this MUST be called first)
	socket.on('init', function(_fn) {
		var playerId = 'guest_' + playerSeq++;
		player.identify(playerId);
		if(_fn) _fn(playerId);
	});

	// Create a new game.
	socket.on('create', function() {
		// TODO: Create game.
		// player.joinGame(newGame);
	});

	// Join an existing game.
	socket.on('join', function() {
		console.log('Se unió el sapo!');
		player.leaveGame();
		player.joinGame(games['0']);
	});

	// Player actions are executed.
	socket.on('actions', function(_actions) {
		console.log('Llegaron acciones!');
		player.pushActions(_actions);
	});

	// When disconnected close player.
	socket.on('disconnect', function () {
		player.leaveGame();
	});
});

console.log("RoboWARS server listening on port %d in %s mode", app.address().port, app.settings.env);
