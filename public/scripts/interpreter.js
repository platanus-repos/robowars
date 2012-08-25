var Interpreter = function() {
	this._state=[];
};

Interpreter.prototype = {
	draw: function(state) {
		if(state)	this._state = state;
		var canvas = document.getElementById("canvas");
		var ctx = canvas.getContext("2d");
		ctx.fillStyle = "rgb(200,0,0)";
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		_.each(this._state, function(element){
				ctx.fillRect(element.x, element.y, element.size, element.size);
		});
	}
};