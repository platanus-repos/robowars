/**
 * @fileOverview GameSeat class definition
 * @author <a href="mailto:ignacio@platan.us">Ignacio Baixas</a>
 */

var Robot = require('./actors/robot.js').Robot;

/**
 * The seat class holds information about a player interaction with a game.
 *
 * @param {Socket} _socket player endpoint.
 */
var GameSeat = function(_socket) {
	this._id = null;
	this._socket = _socket;
	this._game = null;
	this._robots = {};
};

GameSeat.prototype = {
	/**
	 * Sets the player identity, required to join a game later.
	 *
	 * @param  {string} _id Identifier string (name)
	 */
	identify: function(_id) {
		if(this._id) throw 'already_identified';
		// TODO: If player is re-joining, try to recover his robots.
		this._id = _id;
	},
	/**
	 * Joins the game
	 *
	 * @param  {Game} _game game to join to.
	 */
	joinGame: function(_game) {
		if(!this._id) throw 'not_identified';
		this._game = _game;
		_game.enter(this._id);
		_game.addEndpoint(this._socket);
	},
	/**
	 * Leaves the current game.
	 *
	 * @return {boolean} True if there was a game to leave from, false if not.
	 */
	leaveGame: function() {
		if(!this._id) throw 'not_identified';
		if(this._game) {
			this._game.removeEndpoint(this._socket);
			this._game.leave(this._id);
			this._game = null;
			return true;
		}
		else return false;
	},
	/**
	 * Push actor actions into the player stack.
	 *
	 * Actions create new actors or affect player's actors non-dynamic properties.
	 *
	 * @param {Array} _actions List of actions perform.
	 */
	pushActions: function(_actions) {
		var i, name, robot, errors = [];
		if(this._game) {
			for(i = 0; i < _actions.length; i++) {
				switch(_actions[i].action) {
				case 'new':
					console.log('creando robots!');
					name = _actions[i].name;
					if(!this._robots[name]) {
						robot = new Robot(this._id, name, 10, 10);
						this._robots[name] = this._game.addActor(robot);
					}
					break;
				case 'robot_power':
					// TODO: Validate name and value
					robot = this._robots[_actions[i].name];
					robot.power = _actions[i].value;
					break;
				case 'robot_dir':
					// TODO: Validate name and value
					robot = this._robots[_actions[i].name];
					robot.angle = _actions[i].value;
					break;
				case 'robot_fire':
					// TODO: Validate name and value
					robot = this._robots[_actions[i].name];
					var bullet = robot.fire();
					if(bullet) this._game.addActor(bullet);
					break;
				case 'robot_place':
					break;
				default:
				}
			}

			// TODO: Report actions errors back.

			// Sync with game.
			if(!this._game.poke(this._id)) {
				// Syncing failed, leave game.
				this._game.removeEndpoint(this._socket);
				this._game.leave(this._id);
				this._game = null;
				// TODO: notify user.
				console.log("Todo mal sincronizado pelado.");
			}
		}
	}
};

exports.Seat = GameSeat;