/**
 * @fileOverview Game class definition
 * @author <a href="mailto:ignacio@platan.us">Ignacio Baixas</a>
 */

var Box2D = require('box2d').Box2D,
	b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
	b2Body = Box2D.Dynamics.b2Body,
	b2BodyDef = Box2D.Dynamics.b2BodyDef,
	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
	b2Vec2 = Box2D.Common.Math.b2Vec2;

// Scene body definition
var WALLS_BODY = new b2BodyDef();
WALLS_BODY.type = b2Body.b2_staticBody;
WALLS_BODY.position.x = 0;
WALLS_BODY.position.y = 0;

// Scene fixture definition
var WALLS_FIXTURE = new b2FixtureDef();
WALLS_FIXTURE.density = 1;
WALLS_FIXTURE.friction = 0.0;
WALLS_FIXTURE.restitution = 1;
WALLS_FIXTURE.shape = new b2PolygonShape();
WALLS_FIXTURE.filter.categoryBits = 0x01;

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
	this._width = 20;
	this._height = 20;
	this._actors = [];
	this._lastTime = (new Date()).getTime();

	// Setup world
	this._world = new Box2D.Dynamics.b2World(new Box2D.Common.Math.b2Vec2(0, 0), true); // 0 gravity cause of top down view.

	var worldWalls = this._world.CreateBody(WALLS_BODY);
	WALLS_FIXTURE.shape.SetAsEdge(new b2Vec2(0, 0), new b2Vec2(20, 0));
	worldWalls.CreateFixture(WALLS_FIXTURE);
	WALLS_FIXTURE.shape.SetAsEdge(new b2Vec2(20, 0), new b2Vec2(20, 20));
	worldWalls.CreateFixture(WALLS_FIXTURE);
	WALLS_FIXTURE.shape.SetAsEdge(new b2Vec2(20, 20), new b2Vec2(0, 20));
	worldWalls.CreateFixture(WALLS_FIXTURE);
	WALLS_FIXTURE.shape.SetAsEdge(new b2Vec2(0, 20), new b2Vec2(0, 0));
	worldWalls.CreateFixture(WALLS_FIXTURE);
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
	 * @param {mixed} _actor Every actor must provide an update and a toHash method.
	 */
	addActor: function(_actor) {
		_actor.materialize(this._world);
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
			this._playerCount--;
			if(this._pokes >= this._playerCount) this._tick();
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
			this._pokes++;
			if(this._pokes >= this._playerCount) this._tick();
			return true;
		}
		else return false;
	},
	_tick: function() {
		// TODO: make sure at least N sec has transcurred.

		var i, j, dump,
			now = (new Date()).getTime(),
			delta = Math.min(now - this._lastTime, 100) / 1000;

		// prepare actors for next step.
		for(i = 0; i < this._actors.length; i++) {
			this._actors[i].beforeStep(delta);
		}

		// update world.
		// TODO: delta should be fixed.
		this._world.Step(delta,	10,	10);
		this._world.ClearForces();

		// TODO: Collect destroyed objects.

		// push new state to listeners
		dump = this._dumpState();
		for(j = 0; j < this._endpoints.length; j++) {
			this._endpoints[j].emit('state', dump);
		}

		// reset player pokes.
		this._sequence++;
		this._pokes = 0;
		this._lastTime = delta;
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