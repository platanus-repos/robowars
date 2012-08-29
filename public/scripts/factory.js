/**
 * @fileOverview Factory class definition.
 */

(function($, undefined) {

/**
 * [Factory description]
 * @param {[type]} _context [description]
 */
RobotWars.Factory = function(_context) {
	this._ns = RobotWars.loadActorsForContext(_context);
	this._actors = {};
};

RobotWars.Factory.prototype = {
	/**
	 * Loads a robot with name _name.
	 * @param  {[type]} _name [description]
	 * @return {[type]}       [description]
	 */
	robot: function(_name) {
		if(!this._actors[_name]) this._actors[_name] = new this._ns.Robot(_name);
		return this._actors[_name];
	}
};

})();