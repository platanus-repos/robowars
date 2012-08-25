ActionStack = function() {
this._actions = [];

};
ActionStack.prototype = {
	addNewRobot : function(name) {
		this._actions.push({
			type:'new',
			name:name
		});
	},
	setRobotPower : function(name, power) {
		this._actions.push({
			type:'robot_power',
			name:name,
			value:power
		});
	},
	setRobotDirection : function(name, direction) {
		this._actions.push({
			type:'robot_dir',
			name:name,
			value:direction
		});
	},
	flush : function() {
		var temp = this._actions;
		this._actions = [];
		return temp;
	}

};