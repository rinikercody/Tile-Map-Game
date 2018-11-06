import Input from './input';
import Tilemap from './tilemap';
var tilemap = new Tilemap();

/** @class Game
  * A class representing the high-level functionality
  * of a game - the game loop, buffer swapping, etc.
  */
export default class Game {
  /** @constructor
    * Creates the game instance
    * @param {integer} width - the width of the game screen in pixels
    * @param {integer} heght - the height of the game screen in pixels
    */
  constructor(width, height) {
    this._start = null;
    this.WIDTH = width;
    this.HEIGHT = height;
    this.input = new Input();
    this.entities = [];
	this.gravity = 2; //How much force draws each entity to the ground.

    // Set up the back buffer
    this.backBuffer = document.createElement('canvas');
    this.backBuffer.width = this.WIDTH;
    this.backBuffer.height = this.HEIGHT;
    this.backBufferCtx = this.backBuffer.getContext('2d');

    // Set up the screen buffer
    this.screenBuffer = document.createElement('canvas');
    this.screenBuffer.width = this.WIDTH;
    this.screenBuffer.height = this.HEIGHT;
    this.screenBufferCtx = this.screenBuffer.getContext('2d');
	this.screenBuffer.style.margin = "0px 50px 50px 200px"; //Center the screen
    document.body.append(this.screenBuffer);
	
	
  }
  /** @method addEntity
    * Adds an entity to the game world
    * Entities should have an update() and render()
    * method.
    * @param {Object} entity - the entity.
    */
  addEntity(entity) {
    this.entities.push(entity);
  }
 
  /** @method checkCollsion
    * Determines if player is touching tiles.
	* Checks if player touching a solid,bouncy,or damage tile and adjust players stats accordingly.
	*/
  checkCollsion(){
	 var player = this.entities[0];
	 var groundCheck = false;
	 var moveLeft = true;
	 var moveRight = true;
	 for(var i = 0; i < tilemap.tiles.length; i++){
		var tile = tilemap.tiles[i];
		if(tile.index != 0 && tile.index != 2 && tile.index != 6 && tile.index != 8){
			if(player.x + 20 >= tile.x && player.x + 10 <= tile.x + 32){
					if(player.y + 33 >= tile.y && player.y < tile.y){
						groundCheck = true;
					}
					if(player.y <= tile.y + 32 && player.y >= tile.y){
						player.jump = 1000;
					}
			}
			if(player.x + 10 - 2 <= tile.x + 32 && player.x + 20 > tile.x && player.y + 30 >= tile.y && player.y < tile.y + 32){
				moveLeft = false;
				groundCheck = false;
			}
			
			if(player.x + 24 >= tile.x && player.x + 32 < tile.x + 32 && player.y + 30 >= tile.y && player.y < tile.y + 32){
				moveRight = false;
				groundCheck = false;
			}
		}
		if(tile.index == 4){
			if(player.x + 16 >= tile.x && player.x + 16 <= tile.x + 32 && player.y + 32 >= tile.y - 5 && player.y < tile.y + 32){
				player.bounced = true;
			}
		}
		if(tile.index == 5 || tile.index == 13){
			if(player.x + 25 >= tile.x && player.x <= tile.x + 25 && player.y + 32 >= tile.y - 2 && player.y < tile.y + 34){
				player.x = player.startx;
				player.y = player.starty;
				player.currentScroll = 0;
				player.verticalScroll = -850;
			}
		}
		if(tile.index == 9){
			if(player.x >= tile.x && player.x <= tile.x + 32 && player.y + 32 >= tile.y - 1 && player.y < tile.y + 32){
				player.bounceHeight = 1700;
				player.bounced = true;
			}
		}
	}
	player.moveLeft = moveLeft;
	player.moveRight = moveRight;
	player.grounded = groundCheck;
	
	if(!player.grounded){
		player.y += this.gravity;
	}
	
	if(player.y > 1600 && player.verticalScroll == -850){
		player.verticalScroll = -1600;
	}
	if(player.verticalScroll == -1600 && player.y < 1600){
		player.verticalScroll = -850;
	}
	if(player.verticalScroll == -850 && player.y < 900){
		player.verticalScroll = 0;
	}
	if(player.verticalScroll == 0 && player.y > 700){
		player.verticalScroll = -850;
	}
  }
	
  /** @method update
    * Updates the game state
    * @param {integer} elapsedTime - the number of milliseconds per frame
    */
  update(elapsedTime) {
	//Check what the player is touching.
	this.checkCollsion();
	
	// Update game entitites
	this.entities.forEach(entity => entity.update(elapsedTime, this.input));
    

    // Swap input buffers
    this.input.update();
	
  }
  /** @method render
    * Renders the game state
    * @param {integer} elapsedTime - the number of milliseconds per frame
    */
  render(elapsedTime) {
    // Clear the back buffer
    this.backBufferCtx.fillStyle = "white";
    this.backBufferCtx.fillRect(0,0,this.WIDTH, this.HEIGHT);
	
    // Render entities
	this.backBufferCtx.save();
	this.backBufferCtx.translate(this.entities[0].currentScroll,this.entities[0].verticalScroll);
	
	//Render map
	tilemap.render(this.backBufferCtx);
	
    this.entities.forEach(entity => entity.render(elapsedTime, this.backBufferCtx, this.input));
	this.backBufferCtx.restore();
	
    // Flip the back buffer
    this.screenBufferCtx.drawImage(this.backBuffer, 0, 0);
  }
  /** @method loop
    * Updates and renders the game,
    * and calls itself on the next draw cycle.
    * @param {DOMHighResTimestamp} timestamp - the current system time
    */
  loop(timestamp) {
    var elapsedTime = this._frame_start ? timestamp - this._frame_start : 0;
    this.update(elapsedTime);
    this.render(elapsedTime);
    this._frame_start = timestamp;
    window.requestAnimationFrame((timestamp) => {this.loop(timestamp)});
  }
}
