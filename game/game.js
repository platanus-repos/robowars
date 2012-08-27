/**
 * @fileOverview Game class definition
 * @author <a href="mailto:ignacio@platan.us">Ignacio Baixas</a>
 */

/**
 * The game class holds the status of a game and runs the game simulation.
 *
 * @param {[type]} _map   [description]
 * @param {[type]} _rules [description]
 */
var Game = function(_map, _rules) {
	this._endpoints = []; // Game observers

	// Status values.
	this._status = 'waiting';
	this._players = {};
	this._playerCount = 0;
	this._sequence = 0;
	this._pokes = 0;

	// Simulation values.
	this._width = 200;
	this._height = 200;
	this._actors = [];
	this._lastTime = (new Date()).getTime();
};

Game.prototype = {
	/**
	 * Adds a listener.
	 * @param {[type]} _socket [description]
	 */
	addEndpoint: function(_socket) {
		this._endpoints.push(_socket);
		_socket.emit('state', this._dumpState()); // Send endpoint current report.
	},
	/**
	 * Removes a game listener.
	 * @param  {[type]} _socket [description]
	 * @return {[type]}         [description]
	 */
	removeEndpoint: function(_socket) {
		this._endpoints.splice(this._endpoints.indexOf(_socket), 1);
	},
	/**
	 * Adds a simulation actor.
	 * @param {mixed} _actor Every actor mus provide an update and a toHash method.
	 */
	addActor: function(_actor) {
		this._actors.push(_actor);
		return _actor;
	},
	/**
	 * Adds a new player to the game.
	 * @param  {[type]} _playerId [description]
	 * @return {[type]}           [description]
	 */
	enter: function(_playerId) {
		if(!this._players[_playerId])
		{
			this._players[_playerId] = {
				id: _playerId,
				points: 0,
				seq: -1
			};
			this._playerCount++;
		}
		else throw 'already_registered';
	},
	/**
	 * Removes a player from the game.
	 * @param  {[type]} _playerId [description]
	 * @return {[type]}           [description]
	 */
	leave: function(_playerId) {
		if(this._players[_playerId])
		{
			// TODO: remove related actors!
			delete this._players[_playerId];
			this._players--;
			if(this._pokes >= this._players) this._tick();
		}
		else throw 'not_registered';
	},
	/**
	 * Sets a player ready for next iteration.
	 * @param  {string} _playerId Player id
	 * @return {[type]}           [description]
	 */
	poke: function(_playerId) {
		var player = this._players[_playerId];
		if(player && player.seq != this._sequence)
		{
			player.seq = this._sequence;
			this._signals++;
			if(this._signals >= this._players) this._tick();
			return true;
		}
		else return false;
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

exports.Game = Game;