Weapon = function (options) {
	console.log("base weapon init");
	this.ctx = options.ctx;
	
	this.game = this.ctx.game;
	this.player = this.ctx.player;
	this.weapon_name = this.weapon_name || "DEFAULT";
};

Weapon.prototype.pickup = function(trigger) {
	if (trigger) {
		this.ctx.game.add.tween(trigger).to( {
			y: trigger.y - 100,
			alpha: 0,
		} , 400, Phaser.Easing.Linear.None, true);
		this.game.add.tween(trigger.scale).to( {x: trigger.scale.x * 2.0, y: trigger.scale.y * 2.0} , 400, Phaser.Easing.Linear.None, true);
		
		this.trigger = trigger;
		this.ctx.time.events.add(1000, function() {
			this.trigger.destroy();
		}, this);
	}
	
	if (!this.player.weapons_available.includes(this.weapon_key)) {
		this.player.weapons_available.push(this.weapon_key);
	}
	
	if (!this.player.weapon) {
		this.equip();
	}
	
	
};

Weapon.prototype.equip = function() {
	var fontStyle = { font: "25px Arial", fill: "#ffffff", align: "left" };
	this.weapon_label = this.game.add.text(10, 10, this.weapon_name, fontStyle);
	
	
	var fontStyle = { font: "25px Arial", fill: "#000000", align: "left" };
	this.weapon_label_o = this.game.add.text(12, 12, this.weapon_name, fontStyle);
	this.ctx.ui.addChild(this.weapon_label_o);
	this.ctx.ui.addChild(this.weapon_label);
};

Weapon.prototype.unequip = function() {
	this.weapon_label.destroy();
	this.weapon_label_o.destroy();
};

Weapon.prototype.update = function(blockers) {
	if (blockers) {
		this.ctx.physics.arcade.overlap(this.bullets, blockers, this.onBlockerHit, null, this);
	}
};

Weapon.prototype.onBlockerHit = function(bullet, blocker) {
	bullet.kill();
};


//------------------------------------------- MACHINE GUN ---------------------------------------

Weapon_Machinegun = function(options) {
	this.weapon_name = "MACHINE GUN";
	this.weapon_key = "machinegun";
	return Weapon.call(this, options);
};

Weapon_Machinegun.prototype = Object.create(Weapon.prototype);
Weapon_Machinegun.prototype.constructor = Weapon;
Weapon_Machinegun.prototype.parent = Weapon.prototype;

//Weapon_Machinegun.prototype.pickup = function(trigger) {
//	this.parent.pickup.call(this, trigger);
//};

Weapon_Machinegun.prototype.equip = function() {
	this.parent.equip.call(this);
	
	this.sprite = this.game.add.sprite(0, 0, "gun_machinegun");
	this.sprite.scale.setTo(0.3, 0.3);
	this.sprite.anchor.setTo(0, 0.2);

	this.player.addChild(this.sprite);
	
	if (!this.weapon) {
		this.weapon = this.ctx.add.weapon(30, "items");
		this.weapon.setBulletFrames(8, 10, true);
		this.weapon.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;
		this.weapon.bulletSpeed = 400;
		this.weapon.bulletGravity.y = -800;
		this.weapon.fireRate = 100;
		
		this.bullets = this.weapon.bullets;
		this.ctx.bullet_layer.addChild(this.weapon.bullets);
		
		this.damage = 25;
	}
	
	this.player.weapon = this;
};

Weapon_Machinegun.prototype.update = function(blockers) {
	this.parent.update.call(this, blockers);
	
	var scalefix = (this.player.scale.x > 0) ? 1 : -1;
	this.sprite.rotation = Phaser.Math.angleBetween(scalefix * this.sprite.world.x, this.sprite.world.y, 
																   scalefix * this.game.input.activePointer.worldX, this.game.input.activePointer.worldY);
	var gun_barrel = {
			x: this.sprite.world.x + (this.sprite.width * 1.2) * scalefix * Math.cos(this.sprite.rotation),
			y: this.sprite.world.y + (this.sprite.width * 1.2) * Math.sin(this.sprite.rotation),
		};
	
	if (this.ctx.player_has_control && (this.ctx.buttons.fire.isDown || this.game.input.activePointer.leftButton.isDown)) {
		this.weapon.fire(gun_barrel, this.game.input.activePointer.worldX, this.game.input.activePointer.worldY);
	}
};

Weapon_Machinegun.prototype.unequip = function() {
	this.parent.unequip.call(this);
	
	this.sprite.destroy();
};



//------------------------------------------- LASER ---------------------------------------

Weapon_Laser = function(options) {
	this.weapon_name = "LASER";
	this.weapon_key = "laser";
	return Weapon.call(this, options);
};

Weapon_Laser.prototype = Object.create(Weapon.prototype);
Weapon_Laser.prototype.constructor = Weapon;
Weapon_Laser.prototype.parent = Weapon.prototype;


Weapon_Laser.prototype.equip = function() {
	this.parent.equip.call(this);
	
	this.sprite = this.game.add.sprite(0, 0, "gun_laser");
	this.sprite.scale.setTo(0.6, 0.6);
	this.sprite.anchor.setTo(0, 0.3);

	this.player.addChild(this.sprite);
	
	if (!this.weapon) {
		this.weapon = this.ctx.add.weapon(30, "laser_beam");
		this.weapon.setBulletFrames(2, 2, true);
		this.weapon.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;
		this.weapon.bulletSpeed = 5000;
		this.weapon.bulletGravity.y = -800;
		this.weapon.fireRate = 100;
		this.weapon.charge = 0;
		this.weapon.chargeRate = 2;
				
		this.bullets = this.weapon.bullets;
		this.ctx.bullet_layer.addChild(this.weapon.bullets);
		
		this.damage = 250;
	}
	
	this.player.weapon = this;
};

Weapon_Laser.prototype.update = function(blockers) {
	this.parent.update.call(this);
	
	var scalefix = (this.player.scale.x > 0) ? 1 : -1;
	this.sprite.rotation = Phaser.Math.angleBetween(scalefix * this.sprite.world.x, this.sprite.world.y, 
																   scalefix * this.game.input.activePointer.worldX, this.game.input.activePointer.worldY);
	var gun_barrel = {
			x: this.sprite.world.x + (this.sprite.width * 1.2) * scalefix * Math.cos(this.sprite.rotation),
			y: this.sprite.world.y + (this.sprite.width * 1.2) * Math.sin(this.sprite.rotation),
		};
	
//	console.log(this.sprite.rotation, this.sprite.width, this.sprite.height, "x: ", gun_barrel_projectile.x, Math.cos(this.sprite.rotation), "y: ", gun_barrel_projectile.y, Math.sin(this.sprite.rotation));
	
	if (this.ctx.player_has_control && (this.ctx.buttons.fire.isDown || this.game.input.activePointer.leftButton.isDown)) {
		if (this.weapon.charge == 0) {
			//TODO: start charging noise audio here
		}
		
		this.weapon.charge += this.weapon.chargeRate;
		
		if (this.weapon.charge >= 80) { this.sprite.frame = 1; }
		if (this.weapon.charge >= 100) {
			
			var beam_sprite_base = this.game.add.sprite(0, 0, "laser_beam", 0);
			this.ctx.bullet_layer.addChild(beam_sprite_base);
			beam_sprite_base.anchor.set(0, 0.5);
			beam_sprite_base.position.set(gun_barrel.x, gun_barrel.y);
			
			beam_sprite_base.rotation = Phaser.Math.angleBetween(gun_barrel.x, gun_barrel.y, this.game.input.activePointer.worldX, this.game.input.activePointer.worldY);
			var beam_sprite_body = this.game.add.sprite(30, 0, "laser_beam", 1);
			beam_sprite_body.scale.set(30, 1);
			beam_sprite_body.anchor.set(0, 0.5);
			beam_sprite_base.addChild(beam_sprite_body);
			this.weapon.fire(gun_barrel, this.game.input.activePointer.worldX, this.game.input.activePointer.worldY);
			
			this.weapon.charge = 0;
			this.game.add.tween(beam_sprite_base).to( {alpha: 0} , 600, Phaser.Easing.Linear.None, true);
			this.sprite.frame = 0;
			
			this.ctx.time.events.add(1000, function() {
				beam_sprite_base.destroy();
				beam_sprite_body.destroy();
			}, {
				beam_sprite_base: beam_sprite_base,
				beam_sprite_body: beam_sprite_body,
			});
			
			
		}
		
	} else {
		this.weapon.charge = 0;
		this.sprite.frame = 0;
		//TODO: stop charging audio here
		//TODO: play wind down audio here
	}
};

Weapon_Laser.prototype.unequip = function() {
	this.parent.unequip.call(this);
	
	this.sprite.destroy();
};

//------------------------------------------ Rocket Launcher -------------------------------------
// shoots small and slow rockets that explode on impact for medium damage
// TODO: add splash damage

Weapon_Rocket = function(options) {
	this.weapon_name = "ROCKET";
	this.weapon_key = "rocket";
	return Weapon.call(this, options);
};

Weapon_Rocket.prototype = Object.create(Weapon.prototype);
Weapon_Rocket.prototype.constructor = Weapon;
Weapon_Rocket.prototype.parent = Weapon.prototype;

//Weapon_Machinegun.prototype.pickup = function(trigger) {
//	this.parent.pickup.call(this, trigger);
//};

Weapon_Rocket.prototype.equip = function() {
	this.parent.equip.call(this);
	
	this.sprite = this.game.add.sprite(0, 0, "gun_rocket");
	this.sprite.scale.setTo(0.3, 0.3);
	this.sprite.anchor.setTo(0, 0.2);

	this.player.addChild(this.sprite);
	
	if (!this.weapon) {
		this.weapon = this.ctx.add.weapon(30, "items");
		this.weapon.setBulletFrames(8, 10, true);
		this.weapon.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;
		this.weapon.bulletSpeed = 400;
		this.weapon.bulletGravity.y = -800;
		this.weapon.fireRate = 100;
		
		this.bullets = this.weapon.bullets;
		this.ctx.bullet_layer.addChild(this.weapon.bullets);
		
		this.damage = 25;
	}
	
	this.player.weapon = this;
};

Weapon_Rocket.prototype.update = function(blockers) {
	this.parent.update.call(this, blockers);
	
	var scalefix = (this.player.scale.x > 0) ? 1 : -1;
	this.sprite.rotation = Phaser.Math.angleBetween(scalefix * this.sprite.world.x, this.sprite.world.y, 
																   scalefix * this.game.input.activePointer.worldX, this.game.input.activePointer.worldY);
	var gun_barrel = {
			x: this.sprite.world.x + (this.sprite.width * 1.2) * scalefix * Math.cos(this.sprite.rotation),
			y: this.sprite.world.y + (this.sprite.width * 1.2) * Math.sin(this.sprite.rotation),
		};
	
	if (this.ctx.player_has_control && (this.ctx.buttons.fire.isDown || this.game.input.activePointer.leftButton.isDown)) {
		this.weapon.fire(gun_barrel, this.game.input.activePointer.worldX, this.game.input.activePointer.worldY);
	}
};

Weapon_Rocket.prototype.unequip = function() {
	this.parent.unequip.call(this);
	
	this.sprite.destroy();
};

//------------------------------------------- Tesla Cannon ---------------------------------------
// tracks to nearest enemy within X units and creates a lightning effect while draining health, could drain faster when closer to player

//------------------------------------------- Davey Crocket ---------------------------------------
// mini nuke with screen desaturation effect

