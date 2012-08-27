/**
 * @fileOverview Various game actor definitions.
 * @author <a href="mailto:ignacio@platan.us">Ignacio Baixas</a>
 *
 * Actor classes should implement the following methods:
 * * update(_tdelta, _width, _height)
 * * toHash()
 * * getBounds()
 * * damage(_ammount)
 */

/**
 * Robot base class
 */
var Robot = function(_playerId, _actorId, _x, _y) {
	this.playerId = _playerId;
	this.actorId = _actorId;
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
		return {
			playerId: this.playerId,
			actorId: this.actorId,
			type: 'robot',
			size: this.size,
			x: this.x,
			y: this.y,
			speed: this.speed
		};
	}
};

// EXPORTS
exports.Robot = Robot;
// exports.Bullet = Bullet;