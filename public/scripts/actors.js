/**
 * @fileOverview loadActorsForContext function.
 */

(function($, undefined) {

RobotWars.loadActorsForContext = function(_context) {

	// The Robot class

	var Robot = function() {
		this.x = null;
		this.y = null;
		this.speed = null;
		this._power = 0;
		this._direction = 0;
		this._actorId = _context.addNewActor(this, 'robot');
	};

	Robot.prototype = {
		/**
		 * Sets the robot power output.
		 * @param {[type]} _power [description]
		 */
		setPower: function(_power) {
			this._power = _power;
			_context.setActorProp(this._actorId, 'robot_power', _power);
		},
		/**
		 * Sets the robot direction.
		 * @param {[type]} _angle [description]
		 */
		setDirection: function(_angle) {
			this._direction = _angle;
			_context.setActorProp(this._actorId, 'robot_dir', _angle);
		},
		/**
		 * [__update description]
		 * @param  {[type]} _state [description]
		 * @return {[type]}        [description]
		 */
		__update: function(_state) {
			this.x = _state.x;
			this.y = _state.y;
			this.speed = _state.speed;
		}
	};

	return { 'Robot': Robot };
};

})();