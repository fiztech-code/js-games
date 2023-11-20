// shape and its possible rotations
const shapeTypes = [
    [ [[]] ],
    [ [[0,0],[1,0],[2,0],[3,0]], [[0,0],[0,1],[0,2],[0,3]] ],                                                           // I
    [ [[0,0],[1,0],[0,1],[1,1]] ],                                                                                      // O
    [ [[0,0],[1,0],[2,0],[1,1]], [[0,0],[0,1],[0,2],[1,1]], [[1,0],[0,1],[1,1],[2,1]], [[1,0],[0,1],[1,1],[1,2]], ],    // T
    [ [[0,0],[1,0],[2,0],[2,1]], [[1,0],[1,1],[1,2],[0,2]], [[0,0],[0,1],[1,1],[2,1]], [[0,0],[1,0],[0,1],[0,2]], ],    // J
    [ [[2,0],[0,1],[1,1],[2,1]], [[0,0],[0,1],[0,2],[1,2]], [[0,0],[1,0],[2,0],[0,1]], [[0,0],[1,0],[1,1],[1,2]], ],    // L
    [ [[1,0],[2,0],[0,1],[1,1]], [[0,0],[0,1],[1,1],[1,2]] ],                                                           // S
    [ [[0,0],[1,0],[1,1],[2,1]], [[1,0],[0,1],[1,1],[0,2]] ],                                                           // Z
];

const shapeColors = [
    '',
    '#00ffff',  // cyan
    '#ffff00',  // yellow
    '#ff00ff',  // magenta
    '#0000ff',  // blue
    '#b05900',  // orange
    '#00b000',  // green
    '#b00000'   // red
]

class Shape {    
    // I, O, T, J, L, S, Z
    constructor() {                        
        this.newShape();
    }

    newShape() {
        this.type = Math.floor(Math.random() * 7) + 1;     
        this.r = 0;

        this.x = 3;
        this.y = 0;       
        this.tiles = shapeTypes[this.type][this.r]; 
    }

    moveX(x) {
        let result = this.x + x;
        let rightMost = Math.max(...shape.tiles.map(x => x[0]));
        if (result >= 0 && (result + rightMost) < gridWidth) {
            let collisionX = false;
            shape.tiles.forEach(s => {                
                if (grid[s[1] + shape.y][s[0] + shape.x + x]) {
                    collisionX = true; 
                }
            });

            if (!collisionX) {                
                this.x = result;
            }             
        }        
    }

    moveY(y) {
        this.y += y;
        this.hit();
    }

    rotate() {
        let tempR = (this.r + 1) % shapeTypes[this.type].length;
        let tempTiles = shapeTypes[this.type][tempR]; 
        let tempX = this.x;

        let collisionX;
        do {
            collisionX = false;

            tempTiles.forEach(s => {                
                if (s[0] + tempX >= gridWidth) {
                    collisionX = true; 
                }
            });

            if (collisionX) {                
                tempX -= 1;
            } 
        } while (collisionX && tempX);

        tempTiles.forEach(s => {                
            if (s[1] + this.y >= gridHeight || grid[s[1] + this.y][s[0] + tempX]) {
                collisionX = true; 
            }
        });

        if (collisionX) {
            return;
        }

        this.r = tempR;
        this.tiles = shapeTypes[this.type][this.r];
        this.x = tempX; 
    }

    hitFloor() {
        let lowestBlock = this.y + Math.max(...shape.tiles.map(y => y[1]));        
        return lowestBlock >= gridHeight;
    } 

    hitGrid() {
        let hit = false;
        shape.tiles.forEach(t => {
            if (!hit && grid[shape.y+t[1]][shape.x+t[0]]) {                
                hit = true;
            }            
        });

        return hit;
    }
    
    hit() {
        if (this.hitFloor() || this.hitGrid()) {
            
            for (let t = 0; t < shape.tiles.length; t++) {
                let tile = shape.tiles[t];

                let col = shape.y+tile[1]-1;
                let row = shape.x+tile[0];

                if (col < 0 || row < 0) {
                    newGame();
                    break;
                }

                grid[col][row] = shape.type;             
            }            

            let col = grid.length - 1;
            while (col) {
                if (grid[col].every(x => x)){
                    for (let _col = col; _col > 0; _col--){
                        grid[_col] = [...grid[_col-1]];                        
                    }                
                    continue;
                }
                col--;
            }  
            
            this.newShape();
        }        
    }

    draw() {        
        ctx.fillStyle = shapeColors[this.type];
        for (let i = 0; i < this.tiles.length; i++) {
            let tile = this.tiles[i];
            let x = offset + ((tile[0] + this.x)  * block);
            let y = offset + ((tile[1] + this.y) * block);

            ctx.fillRect(x, y, block, block);
        }        
    }
}