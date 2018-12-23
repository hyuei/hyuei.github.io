trace = function() {
	// if (!game_config || !game_config.debug) return;
	var s = "";
	for (var i = 0; i < arguments.length; i++) {
    	s+= "|"+ arguments[i];
  	}
  	console.log(s);
}

_t = function(keystring) {
	// var r = global.getLocalText(keystring);
	var r = keystring;

	for (var i = 1; i < arguments.length; i++) {
    	r = r.replace('%'+i, arguments[i]);
  	}

	return r || keystring;
}

curState = function() {
	return game.state.getCurrentState();
}

utils = {};

utils.clone = function(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = utils.clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

utils.init = function() {
	utils.gw = BasicGame.gameWidth;
	utils.gh = BasicGame.gameHeight;
	utils.centerX = this.gw*0.5;
	utils.centerY = this.gh*0.5;
}

utils.floor = function(obj) {
	obj.x = Math.floor(obj.x);
	obj.y = Math.floor(obj.y);
	obj.width = Math.floor(obj.width);
	obj.height = Math.floor(obj.height);
}

utils.bannerStatus = '';

utils.isBannerHidden = false;

utils.openUrl = function (url) {

	if (global.isCocoonJS) {
		Cocoon.App.openURL(url);
	}
	else {
		window.open(url,'_blank');
	}
}

utils.initBanner = function() {

	if (!global.isCocoonJS) return;

	Cocoon.Ad.banner.on("ready", function(width,height){


        utils.layoutBanner();

    });



    Cocoon.Ad.banner.on("shown", function(){


        utils.bannerStatus = "onBannerShown";

        utils.isBannerHidden = false;

    });



    Cocoon.Ad.banner.on("hidden", function(){


        utils.bannerStatus = "onBannerHidden";

        utils.isBannerHidden = true;

    });

};


utils.layoutBanner = function() {

	if (!global.isCocoonJS) return;

    var rect = Cocoon.Ad.getRectangle();

    var dpr = window.devicePixelRatio;

    rect.x = window.innerWidth * dpr/2 - rect.width/2;

    rect.y = 0;



    Cocoon.Ad.setRectangle(rect);



    if (!utils.isBannerHidden)

        Cocoon.Ad.showBanner();

};



utils.loadBanner = function() {

	if (!global.isCocoonJS) return;

    Cocoon.Ad.loadBanner();

};



utils.stretch = function(sourceW, sourceH, targetW, targetH) {
	return {x:targetW/sourceW, y:targetH/sourceH};
};

utils.fitToWidth = function(sourceW, sourceH, targetW, targetH) {
	var sx = targetW / sourceW;
	return {x:sx, y:sx};
};

utils.fitToHeight = function(sourceW, sourceH, targetW, targetH) {
	var sy = targetH / sourceH;
	return {x:sy, y:sy};
};

utils.fitToAll = function(sourceW, sourceH, targetW, targetH) {
	var s = {x:0,y:0};
	s.x = targetW/sourceW;
	s.y = targetH/sourceH;
	if (s.x > s.y) s.x = s.y;
	else if (s.y > s.x) s.y = s.x;
	return s;
};

utils.fitToCenter = function(sourceW, sourceH, targetW, targetH) {

	var s = utils.fitToAll(sourceW,sourceH, targetW, targetH);

	var o = {x:0,y:0};

	sourceW *= s.x;

	sourceH *= s.y;

	o.x = (targetW - sourceW)/2;

	o.y = (targetH - sourceH)/2;

};

PIXI.DisplayObjectContainer.prototype.fitToTop = function(sourceW, sourceH, targetW, targetH) {
	var s = utils.fitToAll(sourceW,sourceH, targetW, targetH);
	this.scale.x = s.x;
	this.scale.y = s.y;
	this.y = global.top;
	this.x = (global.viewWidth-sourceW*s.x) * 0.5 + global.left;
}

PIXI.DisplayObjectContainer.prototype.fitToBottom = function(sourceW, sourceH, targetW, targetH) {
	var s = utils.fitToAll(sourceW,sourceH, targetW, targetH);
	this.scale.x = s.x;
	this.scale.y = s.y;
	this.y = (global.viewHeight-sourceH*s.y) + global.top;
	this.x = (global.viewWidth-sourceW*s.x) * 0.5 + global.left;
}
PIXI.DisplayObjectContainer.prototype.fitToCenter = function(sourceW, sourceH, targetW, targetH) {
	var s = utils.fitToAll(sourceW,sourceH, targetW, targetH);
	this.scale.x = s.x;
	this.scale.y = s.y;
	this.y = (global.viewHeight-sourceH*s.y) * 0.5 + global.top;
	this.x = (global.viewWidth-sourceW*s.x) * 0.5 + global.left;
}
PIXI.DisplayObjectContainer.prototype.fitToAll = function(sourceW, sourceH, targetW, targetH) {
	var s = utils.fitToAll(sourceW,sourceH, targetW, targetH);
	this.scale.x = s.x;
	this.scale.y = s.y;
}


PIXI.DisplayObjectContainer.prototype.stretch = function(sourceW, sourceH, targetW, targetH) {
	var s = utils.stretch(sourceW,sourceH, targetW, targetH);
	this.scale.x = s.x;
	this.scale.y = s.y;
	this.x = global.left;
	this.y = global.top;
}


Phaser.Sprite.prototype.fitToWidth = function(targetW, targetH) {
	var s = utils.fitToWidth(this.width, this.height, targetW, targetH);
	this.scale.x = s.x;
	this.scale.y = s.y;
};
Phaser.Sprite.prototype.fitToHeight = function(targetW, targetH) {
	var s = utils.fitToHeight(this.width, this.height, targetW, targetH);
	this.scale.x = s.x;
	this.scale.y = s.y;
};

Phaser.Sprite.prototype.stretch = function(targetW, targetH) {
	this.width = targetW;
	this.height = targetH;
};


utils.scaleObject = function (obj, sx, sy) {
	obj.width = Math.floor(obj.width * sx);
	obj.height = Math.floor(obj.height * sy);
}



Phaser.Sprite.prototype.fitToWidth = function(targetW, targetH) {

	var s = utils.fitToWidth(this.width, this.height, targetW, targetH);

	this.scale.x = s.x;

	this.scale.y = s.y;

};

Phaser.Sprite.prototype.fitToHeight = function(targetW, targetH) {

	var s = utils.fitToHeight(this.width, this.height, targetW, targetH);

	this.scale.x = s.x;

	this.scale.y = s.y;

};

Phaser.Sprite.prototype.stretch = function(targetW, targetH) {

	this.width = targetW;

	this.height = targetH;

	// var s = utils.stretch(this.width, this.height, targetW, targetH);

	// this.scale.x = s.x;

	// this.scale.y = s.y;

};



Function.prototype.inherit = function(proto, parentClass) {

	if (parentClass) {
		this.prototype = Object.create(parentClass.prototype);
		this.prototype.$parent = parentClass;
	}

	this.prototype.constructor = this;
	extend(this.prototype, proto);
};

extend = function(obj, extObj) {

    if (arguments.length > 2) {

        for (var a = 1; a < arguments.length; a++) {

            extend(obj, arguments[a]);

        }

    } else {

        for (var i in extObj) {

            obj[i] = extObj[i];

        }

    }

    return obj;

};

Phaser.Group.prototype.getFirstInstanceOf =  function(obj, alive) {

	trace("getFirstInstanceOf");

	result = null;

	if (alive == true) {

		this.forEachAlive(function(item) {

			if (item instanceof obj) {

				result = item;

				return;

			}

		});

	}

	else if (alive == false) {

		this.forEachDead(function(item) {

			trace((item instanceof obj), item);

			if (item instanceof obj) {

				result = item;

				return;

			}

		});

	}

	else {

		this.forEach(function(item) {

			if (item instanceof obj) {

				result = item;

				return;

			}

		});

	}

	return result;
};
