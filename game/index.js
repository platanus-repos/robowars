
var Player = function(_socket) {
	this._socket = _socket;
	this._game = null;
	this._sequence = 0;
	this._robots = {};
};

Player.prototype = {
	joinGame: function(_game) {
		this._game = _game;
		this._sequence = _game.enter();
		_game.addEndpoint(this._socket);
	},
	leaveGame: function() {
		if(this._game) {
			this._game.removeEndpoint(this._socket);
			this._game.leave();
		}
	},
	pushActions: function(_actions) {
		var i, name, robot;
		if(this._game) {
			for(i = 0; i < _actions.length; i++) {
				switch(_actions[i].type) {
				case 'new':
					name = _actions[i].name;
					if(!this._robots[name]) {
						this._robots[name] = this._game.addActor(new Robot(50, 50));
					}
					console.log("created a roboooot");
					break;
				case 'robot_power':
					robot = this._robots[_actions[i].name];
					robot.power = _actions[i].value;
					break;
				case 'robot_dir':
					robot = this._robots[_actions[i].name];
					robot.angle = _actions[i].value;
					break;
				default:
				}
			}

			// TODO: Report errors back.

			// Sync with game.
			//OJO PIXAR: ESTA WEA LA "ARREGLÉ" YO SIN TENER IDEA. 
			// aca decía this._sequence = this._game.sync(this._sequence);
			//LA FUNCION sync de Game no existía y yo le puse que llamara a signal()..
			this._sequence = this._game.signal(this._sequence);
			if(this._sequence === false) { // Syncing failed, leave game.
				//this._game.removeEndpoint(this._socket);
				///this._game.leave();
				//this._game = null;
				console.log("Todo mal sincronizado pelado.");
				// TODO: notify user.
			}
		}
	}
};

var Game = function(_map, _rules) {
	// Status values.
	this._status = 'waiting';
	this._endpoints = [];
	this._sequence = 0;
	this._players = 0;
	this._signals = 0;
	this._ticks = 0;
	// Simulation values.
	this._width = 200;
	this._height = 200;
	this._actors = [];
	this._lastTime = (new Date()).getTime();
};

Game.prototype = {
	addEndpoint: function(_socket) {
		this._endpoints.push(_socket);
		_socket.emit('state', this._dumpState()); // Send endpoint current report.
	},
	removeEndpoint: function(_socket) {
		this._endpoints.splice(this._endpoints.indexOf(_socket), 1);
	},
	addActor: function(_actor) {
		// TODO: Actors should be related to a player name and should be destroyed when player leaves.
		this._actors.push(_actor);
		return _actor;
	},
	enter: function() {
		this._players++;
		return this._sequence;
	},
	leave: function() {
		this._players--;
		if(this._signals >= this._players) this._tick();
	},
	signal: function(_sequence) {
		if(_sequence != this._sequence) return false; // If player out of sync, return false.
		this._signals++;
		if(this._signals >= this._players) return this._tick();

	},
	_tick: function() {
		// TODO: make sure at least N sec has transcurred.
		
		// Update actors
		var i, j, dump,
			now = (new Date()).getTime(),
			delta = Math.min(now - this._lastTime, 100) / 1000;

		for(i = 0; i < this._actors.length; i++) {
			this._actors[i].update(delta, this._width, this._height);
		}

		// TODO: Collisions

		// Dump and notify
		dump = this._dumpState();
		for(j = 0; j < this._endpoints.length; j++) {
			this._endpoints[j].emit('state', dump);
		}

		// Reset signals.
		this._sequence++;
		this._signals = 0;
		this._lastTime = delta;
		return this._sequence;
	},
	_dumpState: function() {
		var result = [];
		for(var i = 0; i < this._actors.length; i++) {
			result.push(this._actors[i].toHash());
		}
		return result;
	}
};

/**
 * Robot base class
 */
var Robot = function(_x, _y) {
	this.x = _x;
	this.y = _y;
	this.radius = 10;
	this.speed = 0;
	this.power = 0;
	this.angle = 0;
	this.size = 50;
};

Robot.prototype = {
	update: function(_delta, _width, _height) {
		// Update speed based on power.
		this.speed = Math.min(this.power, 10);

		// Update position based on speed and power.
		var trans = (this.speed * _delta);
		this.x += trans * Math.sin(this.angle);
		this.y += trans * Math.cos(this.angle);

		if(this.x < 0) this.x = 0;
		else if(this.x > _width) this.x = _width;

		if(this.y < 0) this.y = 0;
		else if(this.y > _height) this.y = _height;
	},
	toHash: function() {
		return { type: 'robot', size: this.size, x: this.x, y: this.y };
	}
};

// Define exports.
exports.Game = Game;
exports.Player = Player;