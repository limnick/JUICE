Weapon = function (options) {
	console.log("base weapon init");
	this.ctx = options.ctx;
	
	this.game = this.ctx.game;
	this.player = this.ctx.player;
};

Weapon.prototype.pickup = function() {

};

Weapon.prototype.equip = function() {

};

Weapon.prototype.unequip = function() {
	
};



Weapon_Machinegun = function(options) {
	return Weapon.call(this, options);
};

Weapon_Machinegun.prototype = Object.create(Weapon.prototype);
Weapon_Machinegun.prototype.constructor = Weapon;
Weapon_Machinegun.prototype.parent = Weapon.prototype;

Weapon_Machinegun.prototype.pickup = function(trigger) {
	this.parent.pickup.call(this);

	this.ctx.game.add.tween(trigger).to( {
		y: trigger.y - 80,
		alpha: 0,
	} , 400, Phaser.Easing.Linear.None, true);
	this.game.add.tween(trigger.scale).to( {x: 1, y: 1} , 400, Phaser.Easing.Linear.None, true);

};

Weapon_Machinegun.prototype.equip = function() {
	this.parent.equip.call(this);
	//TODO: show weapon UI? just leave 1 weapon at a time?
	
	this.sprite = this.game.add.sprite(0, 0, "gun_machinegun");
	this.sprite.scale.setTo(0.3, 0.3);
	this.sprite.anchor.setTo(0, 0.2);

	this.player.addChild(this.sprite);
	
	this.weapon = this.ctx.add.weapon(30, "items");
	this.weapon.setBulletFrames(8, 10, true);
	this.weapon.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;
	this.weapon.bulletSpeed = 400;
	this.weapon.bulletGravity.y = -800;
	this.weapon.fireRate = 100;
	
	this.bullets = this.weapon.bullets;
	
	this.damage = 25;
	
	this.player.weapon = this;
};

Weapon_Machinegun.prototype.update = function() {
	var scalefix = (this.player.scale.x > 0) ? 1 : -1;
	this.sprite.rotation = Phaser.Math.angleBetween(scalefix * this.sprite.world.x, this.sprite.world.y, 
																   scalefix * this.game.input.activePointer.worldX, this.game.input.activePointer.worldY);
	var gun_barrel = {
			x: this.sprite.world.x + (this.sprite.width * 1.2) * scalefix * Math.cos(this.sprite.rotation),
			y: this.sprite.world.y + (this.sprite.width * 1.2) * Math.sin(this.sprite.rotation),
		};
	
	if (this.ctx.player_has_control && (this.ctx.fireButton.isDown || this.game.input.activePointer.leftButton.isDown)) {
		this.weapon.fire(gun_barrel, this.game.input.activePointer.worldX, this.game.input.activePointer.worldY);
	}
};

Weapon_Machinegun.prototype.unequip = function() {
	this.parent.unequip.call(this);
	
	this.sprite.destroy();
};