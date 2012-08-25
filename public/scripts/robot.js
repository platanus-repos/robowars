robotFactory = function(_actionStack) {

	var seq = 0;

	var Robot = function() {
		this._power = 0;
		this._direction = 0;
		this.name = 'robot_' + seq++;
		_actionStack.addNewRobot(this.name);
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