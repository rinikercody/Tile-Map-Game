import GameMap from '../tilemaps/GameMap.json';

/** @class Tilemap
  * A representation of the game world using 32 X 32 pixel tiles.
  */
export default class Tilemap{
	/** @constructor
	  * Creates a new Tilemap.
	  */
	constructor(){
		//Load tileset
		this.tilemap = new Image;
		this.tilemap.src = 'tileset.png';
		this.height = GameMap.height;
		this.width = GameMap.width;
		
		//Load tiles
		this.tiles = [];
		var xpos = 0;
		var ypos = 0;
		//Load tiles with appropriate x and y cordinate.
		for(var i = 0; i < GameMap.layers[0].data.length; i++){
			if(i % this.width == 0){
				xpos = 0;
				ypos += 32;
			}
			this.tiles.push({index: GameMap.layers[0].data[i], x: xpos, y: ypos});
			xpos += 32;
		}
	}
	
	update(){
		//Game world doesn't change during gameplay
	}
	
	/** @function render
	  * Take all the tiles and display them to the user based on index in tileset.
	  * @param {Canvas context} ctx - The context that will render the tiles.
	  */
	render(ctx){
		for(var i = 0; i < this.tiles.length; i++){
			var tile = this.tiles[i];
			ctx.drawImage(this.tilemap,(tile.index - 1) * 32, 0, 32,32, tile.x, tile.y,32,32);
		}
	}
}