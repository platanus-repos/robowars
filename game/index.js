
/*
 * GET home page.
 */

/**
 * The main game class, this is where everything goes on
 * @param {[type]} _players [description]
 */
var Game = function(_map, _rules) {
	// Status values.
	this._status = 'waiting';
	this._endpoints = [];
	this._sequence = 0;
	this._signals = 0;

	// Simulation values.
	this._height = 200;
	this._width = 200;
	this._actors = [];
};

Game.prototype = {
	addEndpoint: function(_socket) {
		this._endpoints.push(_socket);
		// Send endpoint current report.
	},
	removeEndpoint: function(_socket) {
		this._endpoints.splice(this._endpoints.indexOf(_socket), 1);
	},
	addActor: function(_actor) {
		this._actors.push(_actor);
	},
	enter: function() {

	},
	leave: function(_sequence) {

	},
	sync: function(_sequence) {
		if(_sequence != this._sequence) {
			// When a player has the wrong sequence, then
			return false;
		}
		this._signals++;

		if(this._signals >= this._endpoints.length) {
			this._simulateAndReport();
			this._sequence++;
			this._signals = 0;
		}
	},
	_simulateAndReport: function() {
		for(var i = 0; i < this._actors.length; i++) {

		}

		var dump = this._dumpState();
	},
	_dumpState: function() {

		for(var i = 0; i < this._actors.length; i++) {

		}
	}
};

var Player = function(_socket) {
	this._socket = _socket;
	this._game = null;
	this._sequence = 0;
	this._robots = {};
};

Player.prototype = {
	setGame: function(_game) {
		_game.addEndpoint(this._socket);
		this._sequence = _game.enter();
		this._game = _game;
	},
	leaveGame: function() {
		if(this._game) {
			this._game.removeEndpoint(this._socket);
			this._game.leave(this._sequence);
			// TODO: Remove robots...
		}
	},
	pushActions: function(_sequence, _actions) {
		if(this._game && this._sequence == _sequence) {
			for(var i = 0; i < _actions.length; i++) {
				switch(_action[i].type) {
				case: 'new':
					if(_action[i].name
					this._robots[_] = this._game.addActor(new Robot());
				case: 'robot_accel':
				case: 'robot_dir':
				default:

				}
			}

			// TODO: Report errors back.

			if(this._game.sync(_sequence)) {
			}
		}
	}
};

/**
 * Robot base class
 */
var Robot = function() {
	this.radius = 10;
	this.x = 0;
	this.y = 0;
};

Robot.prototype = {

};

// Define exports.
exports.Game = Game
exports.Player = Player
exports.Robot = Robot