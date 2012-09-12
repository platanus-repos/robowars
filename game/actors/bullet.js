/**
 * @fileOverview Bullet (server) class definition.
 * @author <a href="mailto:ignacio@platan.us">Ignacio Baixas</a>
 */

// Load Box2D stuff...
var Box2D = require('box2d').Box2D,
	b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
	b2Body = Box2D.Dynamics.b2Body,
	b2BodyDef = Box2D.Dynamics.b2BodyDef,
	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
	b2Vec2 = Box2D.Common.Math.b2Vec2;

// Prepare bullet's base fixture definition.
var FIXTURE_DEF = new b2FixtureDef();
FIXTURE_DEF.density = 1;
FIXTURE_DEF.friction = 0.0;
FIXTURE_DEF.restitution = 1.0;
//FIXTURE_DEF.isSensor = true;
FIXTURE_DEF.shape = new b2CircleShape();
FIXTURE_DEF.filter.categoryBits = 0x04;
FIXTURE_DEF.filter.maskBits = 0x01;

// Prepare bullet's base body definition.
var BODY_DEF = new b2BodyDef();
BODY_DEF.type = b2Body.b2_dynamicBody;
BODY_DEF.bullet = true;

/**
 * Bullet class
 */
var Bullet = function(_playerId, _x, _y, _angle) {
	this.playerId = _playerId;
	this.initialX = _x;
	this.initialY = _y;
	this.angle = _angle;
	this.size = 0.4;
	this.speed = 10;
};

Bullet.prototype = {
	materialize: function(_world) {
		this._world = _world;

		BODY_DEF.position.x = this.initialX + this.size / 2;
		BODY_DEF.position.y = this.initialY + this.size / 2;
		this._box = _world.CreateBody(BODY_DEF);

		FIXTURE_DEF.shape.SetRadius(this.size / 2);
		this._box.CreateFixture(FIXTURE_DEF);

		// Apply bullet's initial impulse
		var xForce = 4 * Math.sin(this.angle * Math.PI / 180),
			yForce = 4 * Math.cos(this.angle * Math.PI / 180);
		this._box.SetAwake(true);
		this._box.SetLinearVelocity(new b2Vec2(xForce, yForce), this._box.GetWorldCenter());
	},
	unmaterialize: function() {
		// TODO...
	},
	beforeStep: function(_delta) {
		// NOTHIN' HERE...
	},
	toHash: function() {
		var position = this._box.GetPosition();
		var speed = this._box.GetLinearVelocity();
		return {
			player: this.playerId,
			name: '',
			type: 'bullet',
			size: this.size * 10,
			x: (position.x - this.size / 2) * 10,
			y: (position.y - this.size / 2) * 10,
			speed: speed.Length()
		};
	}
};

// EXPORTS
exports.Bullet = Bullet;