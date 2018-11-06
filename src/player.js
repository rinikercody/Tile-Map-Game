/** @module Player
  * A class representing the player.
  */
export default class Player {
  /** @constructor
    * Constructs a new player instance
    * @param {float} x - the player's x position
    * @param {float} y - the player's y position
    */
  constructor(x, y) {
    this.x = x;
    this.y = y;
	this.startx = x; //For respawning
	this.starty = y; //For respawning
	this.spriteSheet = new Image;
	this.spriteSheet.src = 'PlayerAnimation.png';
	this.runSpeed = 2; //How fast the player moves side to side
	this.animationTimer = 0; //Used to time players animations
	
	this.runAnimation = 0; //Used to track the players current running animation.
	this.jumpAnimation = 0; //Used to track the players current jumping animation.
	this.crouchAnimation = 0; //Used to track the players current crouching animation.
	this.idleAnimation = 0; //Used to track the players current idle animation.
	this.idle = true; //Is the player not doing anything
	this.jumpHeight = 200; //How high the player can jump.
	
	this.grounded = false; //Is the player standing on top of something.
	this.isJumping = false; //Is the player in the middle of a jump.
	this.bounced = false; //If the character just steped on a bouncy block.
	this.bounceHeight = 400; //Max height after a bounce.
	this.jumpSpeed = 5; //How fast the player moves through the air.
	this.jump = 0; //Used to make jump animatation more smooth. basiclly the players rise but not the fall.
	this.facing = 1; //0 left, 1 right
	this.moveRight = false; //Can the player move to the right.
	this.moveLeft = false; //Can the player move to the left.
	this.currentScroll = 0; //The horizontal scroll of the screen based on the players location.
	this.verticalScroll = -850; //Which level of the world is the player on.
  }

  /** @method update
    * Updates the player
    * @param {double} deltaT - the elapsed time
    * @param {Input} input - the input object
    */
  update(deltaT, input) {
	//Decrement players x
    if(input.keyPressed("ArrowLeft") && this.moveLeft){ 
		this.x -= this.runSpeed;
		//Adjust scroll if player is not to close to the edge of the screen.
		if(this.currentScroll < 0 && this.x < 3000){
			this.currentScroll += this.runSpeed;
		}
		this.facing = 0;
	}
	//Increment players x
    if(input.keyPressed("ArrowRight") && this.moveRight){
		this.x += this.runSpeed;
		//Adjust scroll if player is not to close to edge of the screen. 
		if(this.currentScroll > -2150 && this.x > 300){
			this.currentScroll -= this.runSpeed;
		}
		this.facing = 1;
	}
	//Jump
    if(input.keyPressed("ArrowUp")) {
		if(this.grounded){
			this.isJumping = true;
			this.grounded = false;
		}
	}
	//Bounce off bouncy block
	if(this.bounced){
		this.y -= this.jumpSpeed * 2;
		this.jump += this.jumpSpeed * 2;
		if(this.jump >= this.bounceHeight){
			this.bounced = false;
			this.jump = 0;
			this.bounceHeight = 400;
		}
	}
	//Adjust y slowly during a jump
	else if(this.isJumping){
		this.y -= this.jumpSpeed;
		this.jump += this.jumpSpeed;
		if(this.jump >= this.jumpHeight){
			this.isJumping = false; //Done rising now falling
			this.jump = 0;
		}
	}
  }

  /** @method render
    * Renders the player
    * @param {double} deltaT - elapsed time
    * @param {Context2D} context - the rendering context
    */
  render(deltaT, context, input) {
	var animation = 0; //Column
	var animationRow = 0; //Row
	
	//Run left animation
	if(input.keyPressed("ArrowLeft") && this.grounded){
		this.idle = false;
		animationRow = 2;
		if(this.animationTimer >= 200){
			if(this.runAnimation == 2) this.runAnimation = 0;
			else this.runAnimation++;
			this.animationTimer = 0;
		}
		this.animationTimer+= deltaT;
		animation = this.runAnimation;
	}
	//Run right animation
    if(input.keyPressed("ArrowRight") && this.grounded){
		this.idle = false;
		animationRow = 1;
		if(this.animationTimer >= 200){
			if(this.runAnimation == 2) this.runAnimation = 0;
			else this.runAnimation++;
			this.animationTimer = 0;
		}
		this.animationTimer+= deltaT;
		animation = this.runAnimation;
	}
	
	if(this.bounced){ //Play animation for bouncing
		this.idle = false;
		animation = 0;
		animationRow = 6;
		if(this.facing == 0){
			animation = 0;
		}
		else{
			animation = 1;
		}
	}
    else if(this.isJumping) { //If the player jumped and didnt fall off a cliff
		this.idle = false;
		animation = 0; //jump
		if(this.facing == 0){
			animationRow = 3
		}
		else{
			animationRow = 2;
		}
		if(this.animationTimer >= 25){
			if(this.jumpAnimation == 2) this.jumpAnimation = 2; //Leave on final frame; //Kinda of a stupid way to do it
			else this.jumpAnimation++;
			this.animationTimer = 0;
		}
		this.animationTimer+= deltaT;
		animation = this.jumpAnimation;
	}
	else if(!this.grounded){ //If the player just fell off something and didn't jump
		this.idle = false;
		animation = 0;
		if(this.facing == 0){
			animationRow = 4;
		}
		else{
			animationRow = 3;
		}
	}
	//Crouching animaion
    if(input.keyPressed("ArrowDown") && this.grounded){
		this.idle = false;
		animationRow = 5;
		animation = 0;
		if(this.animationTimer >= 100){
			if(this.crouchAnimation == 1){
				animation = 1;
			}
			else{
				this.crouchAnimation = 1;
				this.animationTimer = 0;
			}
			animation = this.crouchAnimation;
			this.animationTimer += deltaT;
		}
	}
	
	//Animation for when player is doing nothing
	if(this.idle){
		animationRow = 0;
		if(this.animationTimer >= 400){
			if(this.idleAnimation == 5){
				this.idleAnimation = 0;
			}
			else this.idleAnimation++;
			this.animationTimer = 0;
		}
		this.animationTimer += deltaT;
		animation = this.idleAnimation;
	}
	
	//Draw sprite, account for 1px border
	context.drawImage(this.spriteSheet,animation * 31, animationRow * 31,32,32,this.x,this.y,32,32);
	
	this.idle = true; //Reset each frame.
  }
}
