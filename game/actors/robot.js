/**
 * @fileOverview Robot (server) class definition.
 * @author <a href="mailto:ignacio@platan.us">Ignacio Baixas</a>
 */

// Load Box2D stuff...
var Box2D = require('box2d').Box2D,
	b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
	b2Body = Box2D.Dynamics.b2Body,
	b2BodyDef = Box2D.Dynamics.b2BodyDef,
	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
	b2Vec2 = Box2D.Common.Math.b2Vec2;

// Robot's base fixture definition
var FIXTURE_DEF = new b2FixtureDef();
FIXTURE_DEF.density = 1;
FIXTURE_DEF.friction = 0.5;
FIXTURE_DEF.restitution = 0.2;
FIXTURE_DEF.shape = new b2PolygonShape();
FIXTURE_DEF.filter.categoryBits = 0x02;

// Robot's base body definition
var BODY_DEF = new b2BodyDef();
BODY_DEF.type = b2Body.b2_dynamicBody;

var Bullet = require('./bullet.js').Bullet;

/**
 * Robot base class
 */
var Robot = function(_playerId, _actorId, _x, _y) {
	this.playerId = _playerId;
	this.actorId = _actorId;
	this.initialX = _x;
	this.initialY = _y;
	this.power = 0;
	this.angle = 0;
	this.size = 3.0;
	this.cooldown = 0;
};

Robot.prototype = {
	fire: function() {
		if(this.cooldown === 0) {
			this.cooldown = 100;
			var position = this._box.GetPosition();
			return new Bullet(
				this.playerId,
				position.x,
				position.y,
				this.angle
			);
		}
		return null;
	},
	materialize: function(_world) {
		this._world = _world;

		BODY_DEF.position.x = this.initialX + this.size / 2;
		BODY_DEF.position.y = this.initialY + this.size / 2;
		this._box = _world.CreateBody(BODY_DEF);

		FIXTURE_DEF.shape.SetAsBox(this.size / 2, this.size / 2);
		this._box.CreateFixture(FIXTURE_DEF);
	},
	unmaterialize: function() {

	},
	beforeStep: function(_delta) {
		// Update applied power.
		if(this.power !== 0) {
			var xForce = this.power * Math.sin(Math.PI * this.angle / 180),
				yForce = this.power * Math.cos(Math.PI * this.angle / 180);
			this._box.ApplyForce(new b2Vec2(xForce, yForce), this._box.GetWorldCenter());
		}
		if(this.cooldown > 0) this.cooldown--;
	},
	toHash: function() {
		var position = this._box.GetPosition();
		var speed = this._box.GetLinearVelocity();
		return {
			player: this.playerId,
			name: this.actorId,
			type: 'robot',
			size: this.size * 10,
			x: (position.x - this.size / 2) * 10,
			y: (position.y - this.size / 2) * 10,
			speed: speed.Length() * 10,
			cooldown: this.cooldown
		};
	}
};

// EXPORTS
exports.Robot = Robot;