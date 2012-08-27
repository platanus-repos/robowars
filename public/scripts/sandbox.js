/**
 * @fileOverview Sandbox class definition.
 */

(function($, undefined) {

/**
 * Keeps player and server objects synchronized and provides
 * a sandbox enviroment for player scripts.
 */
RW.Sandbox = function(_playerId) {
	this._player = _playerId;
	this._seq = 0;
	this._actors = {};
	this._stack = [];
	this._exeCtx = {
		'Robot': robotFactory(this),
		// 'Wall': wallFactory(this),
		objects: []
	};
};

RW.Sandbox.prototype = {
	/**
	 * Evaluates a user's script in the current sandbox context.
	 * @param  {string} _script Script to evaluate
	 */
	evaluate: function(_script) {
		// TODO: provide a consistent scope, this could be done by replacing the current scope "vars"
		// with something else... kind of nasty though....
		with(this._exeCtx) { eval(_script); }
	},

	/**
	 * Synchronizes the sandbox state with the current server state.
	 * @param  {Array} _objects Server state (list of entities)
	 */
	updateState: function(_objects) {
		this._playerCtx.objects = _objects;
		// Update actors based on new state.
		for(var i = 0; i < _objects.length; i++) {
			if(_objects[i].player == this._player) {
				var actor = this._actors[_objects[i].name];
				if(actor) actor.__update(_objects[i]);
			}
		}
	},

	/**
	 * Flushes the current action stack, the stack is filled by
	 * the actor support methods.
	 * @return {array} current action stack.
	 */
	flush : function() {
		var temp = this._stack;
		this._stack = [];
		return temp;
	},

	/// ACTOR SUPPORT
	// The following methods are used internally by actor objects to
	// reflect user actions on game state.

	/**
	 * Called by actor when constructor is called.
	 * @param {object} _actor actor instance.
	 * @param {string} _type  actor server object type.
	 * @returns {string} actor's given name.
	 */
	addNewActor: function(_actor, _type) {
		var name = 'act_' + this._seq++;
		this._actors[name] = _actor;
		this._stack.push({
			type: 'new',
			actor: _type,
			name: name
		});
		return name;
	},

	/**
	 * Called by actor when a monitored property is called.
	 * @param {string} _name  actor given name.
	 * @param {string} _prop  server name for the property.
	 * @param {mixed} _value new value.
	 */
	setActorProp: function(_name, _prop, _value) {
		this._stack.push({
			type: _prop,
			name: _name,
			value: _power
		});
	}
};

})(jQuery);