robotFactory = function(_actionStack) {

	var robots = [];

	var Robot = function(name) {
		this._power = 0;
		this._direction = 0;
		this.name = name;
		if(robots.indexOf(name) < 0) {
			robots.push(name); 
			_actionStack.addNewRobot(this.name);
		}
	};

	Robot.prototype = {
		setPower: function(power) {
			_actionStack.setRobotPower(this.name, power);
		},
		setAngle: function(angle) {
			this._direction = angle;
			_actionStack.setRobotDirection(this.name, angle);
		}
	};

	return Robot;
};