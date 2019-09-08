// These are the global variables
    // to make a game we need to tell what canvas we are using
var canvasBg       = document.getElementById("canvasBg"),
    // what we actually draw is context
    ctxBg          = canvasBg.getContext("2d"),
    //this is the canvas for the game entities
    canvasEntities = document.getElementById("canvasEntities"),
    //the 2d in the parameter should be in small otherwise it will not work
    ctxEntities    = canvasEntities.getContext("2d"),
    //getting the height and width of canvas
    canvasWidth    = canvasBg.width,
    canvasHeight   = canvasBg.height,

    player1 = new Player(),
    //the enemies defined are stored here in this array
    enemies = [],
    //the number of enemies is initialised
    numEnemies = 100,
    //obstacles defined are stored here
    obstacles = [],
    //bool variable which defines the game is running or not
    isPlaying = false,

    //this is the sham it is basically a variable that is set to one in an order which one is available
    //the last part of the sham is the fallback condition so that game can run across all browser
    requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {window.setTimeout(callback, 1000/60);},
    //sprite file
    imgSprite        = new Image();
    //source file of the sprite
    imgSprite.src    = "images/sprite.png";
    //we are adding the event listner so that if the sorce image has been loaded the game should initialises
    //there are the 3 parameters
    // 1.what event do we listner for
    // 2.what function we actully gonna call
    imgSprite.addEventListener('load',init, false);

    


//init function is that which initialises everything and then call the begin function to start the game
function init() {
//these are the two event listners
//the line function(e){checkKey(e, true)} is an anonymous with the parameters //1. e is an event //2. true and false is due to that it will set the function value to be true or false
  document.addEventListener("keydown", function(e) {checkKey(e, true);}, false);
  document.addEventListener("keyup", function(e) {checkKey(e, false);}, false);
//we have called the define obstacle function to create the obstace on the canvas
  defineObstacles();
//we have  called this function to create the enemies on the 
  initEnemies();
//this function is called to actully start the game
  begin();
}
//this function actully begins the game
function begin() {
//1st thing is to draw the background and to draw the background we have to choose the context on which we have to draw it
//there are the bunch of parameters which are in the function drawImage
//1. what image we are trying to use.
//2. source x position (top left x position).
//3. source y position (top left y position).
//4. width of the image how much you want to draw.
//5. height of the image how much you want to draw.
//6. from draw x, is that from where you want to draw in the canvas in x.
//7. from draw y, is that from where you want to draw in the canvas in y.
//8. to draw x, is that till where you want to draw in the canvas in x.
//9. to draw y, is that till where you want to draw in the canvas in y.
  ctxBg.drawImage(imgSprite, 0, 0, canvasWidth, canvasHeight, 0, 0, canvasWidth, canvasHeight);
  isPlaying = true;
  requestAnimFrame(loop);
}

function update() {
//we are clearing the canvas entities
  clearCtx(ctxEntities);
  updateAllEnemies();
  player1.update();
}

//this function actully draws ton the context
function draw() {
  drawAllEnemies();
  player1.draw();
}

//this is the function which actually draws(calls the function) the game in every frame that browser request
function loop() {
  //if the is playing is se to the false then the game is paused and loop will stop executing
  if(isPlaying) {
    update();
    draw();
    requestAnimFrame(loop);
  }
}

//every time we draw a canvas we have to clear the canvas so that we can draw otherwise it will draw on the top of each other.
function clearCtx(ctx) {
//clearRect parameters
//1. draw x position
//2. draw y position
//3. how wide you want to clear the canvas
//4. how high you want to clear the canvas
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}

//this function wil return the random value b/w the min and max
function randomRange(min, max) {
  return Math.floor(Math.random() * (max + 1 - min)) + min;
}

//drawing the player
function Player() {
//srcX is just like background srcX which is the player x position in the sprite file
  this.srcX = 0;
  this.srcY = 600;
//height & width of a player
  this.width = 35;
  this.height = 54;
//position on the canvas where to draw
  this.drawX = 400;
  this.drawY = 300;
//these two variables will determine the center of the player
  this.centerX = this.drawX + (this.width / 2);
  this.centerY = this.drawY + (this.height /2);
//this will determine how speed the player will move (2px per frame)
  this.speed = 2;
  this.isUpKey = false;
  this.isRightKey = false;
  this.isLeftKey = false;
  this.isSpacebar = false;
  this.isShooting = false;
//we are using this variable inside this function beacuse we wanted it to be lived inside the function beacuse we  dont need it anywhere else
  var numBullets = 10;
  this.bullets = [];
  this.currentBullet = 0;
  for(var i = 0; i < numBullets; i++) {
     this.bullets[this.bullets.length] = new Bullet();
   }
}

//creating a prototype for the player
//A prototype is basically adding a method to the object
//we are adding the update function for the player that is (we are prototyping the Player and adding the update function)
Player.prototype.update = function () {
//first of all we need to calculate the new position of the centerX and centerY beacuse as the position of the player changes the center also changes
  this.centerX = this.drawX + (this.width / 2);
  this.centerY = this.drawY + (this.height /2);
//this will check in which way the player is facing
  this.checkDirection();
  this.checkShooting();
  this.updateAllBullets();
};

Player.prototype.draw = function () {
  this.drawAllBullets();
//drawing the player
  ctxEntities.drawImage(imgSprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
};

//this is where a person actully checks its direction
Player.prototype.checkDirection = function () {
  var newDrawX = this.drawX,
      newDrawY = this.drawY,
//initially we will set the obstacle collosion to the false
      obstacleCollision = false;
//we we only use if we ac move player at the angles.
//but if you don't want to move at the angles then use if else.
    if(this.isUpKey) {
//if the up key is pressed then the y coordinate of the player is decresed by the speed
        newDrawY -= this.speed;
        this.srcX = 35; //this tells that the player is facing towards the north or upside the value is given according to the sprite file
       }
    else if(this.isDownKey) {
        newDrawY += this.speed;
        this.srcX = 0; //this tells that the player is facing towards the south or downwards the value is given according to the sprite file
       }
    else if(this.isRightKey) {
        newDrawX += this.speed;
        this.srcX = 105; //this tells that the player is facing towards the East or rightside the value is given according to the sprite file
       }
    else if(this.isLeftKey) {
        newDrawX -= this.speed;
        this.srcX = 70; //this tells that the player is facing towards the west or leftside the value is given according to the sprite file
       }

    obstacleCollision = this.checkObstacleCollide(newDrawX, newDrawY);

    //this condition mill make sure that we are not colliding with an obstace or moving out of the bounds of the game area.
    if(!obstacleCollision && !outOfBounds(this, newDrawX, newDrawY)) {
        //this thing will allow the player to move to the new position on the canvas when the draw function is called.
        this.drawX = newDrawX;
        this.drawY = newDrawY;
       }

};

//this will check if the player is colliding with the object then it is not allowed to move
Player.prototype.checkObstacleCollide = function (newDrawX, newDrawY) {
    var obstacleCounter = 0,
        newCenterX = newDrawX + (this.width / 2),
        newCenterY = newDrawY + (this.height / 2);
    for(var i = 0; i < obstacles.length; i++) {
        //what we are checking here is the colliding condition that is if the center of the player is in the three boundary so it is colliding with the tree or obstacle
        //we have used the negative 20 so that the player will be stopped at nore natural looking position
        if(obstacles[i].leftX < newCenterX && newCenterX < obstacles[i].rightX && obstacles[i].topY - 20 < newCenterY && newCenterY < obstacles[i].bottomY - 20) {
           obstacleCounter = 0;
           }else{
           obstacleCounter++;
           }
    }

    //this if else pair is beacuse of that
    //if the number of obstacles is equal to the number of items present in the list then the player is allowed to move in that direction beacuse he is not colliding with any of the obstacles
    //and if he collides with the any of the obstace then the alue of the obstacleCounter will be set as zero.
    if(obstacleCounter === obstacles.length) {
        //we are returning false beacuse we did not hit an object
       return false;
    }else{
        //we will return the true beacuse we hi an object
       return true;
       }
};



Player.prototype.checkShooting = function () {
    //it means that the space bar is being pressed and if there is no shooting then shoot the bullets
    //it is help in preventing the hold down of the space bar
    if(this.isSpacebar && !this.isShooting) {
        this.isShooting = true;
        //this will take care of the bullets and will loop through it
        this.bullets[this.currentBullet].fire(this.centerX, this.centerY);
        this.currentBullet++;
        //if we use all of our bullets we will go back to the first bullet
        //we will use this function as a recycler of the bullets
        if(this.currentBullet >= this.bullets.length) {
           this.currentBullet = 0;
           }
       } 
    else if(!this.isSpacebar) {
        this.isShooting = false;
    }
};

Player.prototype.updateAllBullets = function () {
    for(var i = 0; i < this.bullets.length; i++) {
        if(this.bullets[i].isFlying) {
            //we are using it beacuse we want to update that bullests which are in the air
            this.bullets[i].update();
        }            
    }
};

Player.prototype.drawAllBullets = function () {
    for(var i = 0; i < this.bullets.length; i++) {
        if(this.bullets[i].isFlying) {
            this.bullets[i].draw();
        }            
    }
};




function Bullet() {
    //we will be using the inbulted shapes to draw over the canvas
    //one thing we keep int mind that the drawX and the drawY is the actual centre of the circle not the top left corner of the bullet
    this.radius = 2;
    this.width = this.radius * 2;
    this.height = this.radius * 2;
    this.drawX = 0;
    this.drawY = 0;
    //this will be used to check if the bullet is fired or not
    this.isFlying = false;
    //how fast is the bullet is going in x direction and y direction
    this.xVel = 0;
    this.yVel = 0;
    //this.speed is the speed, in which it will go in the one of the direction
    this.speed = 6;
}

Bullet.prototype.update = function() {
    this.drawX += this.xVel;
    this.drawY -= this.yVel;
    this.checkHitEnemy();
    this.checkHitObstacle();
    this.checkOutOfBounds();
};

Bullet.prototype.draw = function() {
    ctxEntities.fillStyle = "white";
    ctxEntities.beginPath();
    //arc has several parameters
    //1. position of x where to draw
    //2. position of y where to draw
    //3. of how much radius we have to draw
    //4. starting angle
    //5. ending algle
    //Not to mention the angles are the Radians
    //6. ture or false for the anticlock or clockwise direction
    ctxEntities.arc(this.drawX, this.drawY, this.radius, 0, Math.PI * 2, false);
    ctxEntities.closePath();
    ctxEntities.fill();
};

//as we are using the player center to fire the bullets so the two parameters are as follows
//1. it is for the current x position for the player to shoot
//2. it is for the current y position for the player to shoot
//the player will shoot in the direction he will be facing
Bullet.prototype.fire = function (startX, startY) {
    var soundEffect = new Audio("audio/shooting.wav");
    soundEffect.play();
    this.drawX = startX;
    this.drawY = startY;
    //we are using the elseif beacuse a bullet cannot move in two direction at the same time
    if(player1.srcX === 0) {
        //the player is facing towards the south
        //so the velocity in the x direction will not change
        this.xVel = 0;
        this.yVel = -this.speed;
    }
    else if(player1.srcX === 35) {
        //the player is facing towards the north
        this.xVel = 0;
        this.yVel = this.speed;
   }
    else if(player1.srcX === 70) {
        //the player is facing towards the west
        this.xVel = -this.speed;
        this.yVel = 0;
    }
    else if(player1.srcX === 105) {
        //the player is facing towards the East
        this.xVel = this.speed;
        this.yVel = 0;
    }
    this.isFlying = true;
};


Bullet.prototype.recycle = function () {
    this.isFlying = false;
};

Bullet.prototype.checkHitEnemy = function () {
    //we are using the loop to check that the weather any bullet has hit the enemy
    //if collision b/w bullet and the enemy happens and the enemy is not ed so then enemy willl be dead
    for(var i = 0; i < enemies.length; i++) {
        if(collision(this, enemies[i]) && !enemies[i].isDead) {
            this.recycle();
            enemies[i].die();
        }
    }
};

Bullet.prototype.checkHitObstacle = function () {
    for(var i = 0; i < obstacles.length; i++) {
        if(collision(this, obstacles[i])) {
            this.recycle();
        }
    }
};

Bullet.prototype.checkOutOfBounds = function () {
    if(outOfBounds(this, this.drawX, this.drawY)) {
       this.recycle();
       }

};


//it is an obstacle object which takes the four parameters
//1. x poaition
//2. y position
//3. w = width
//4. h = height
function Obstacle(x, y, w, h){
    //this is for the x and y positon's and the height and width
    this.drawX = x;
    this.drawY = y;
    this.width = w;
    this.height = h;
    this.leftX = this.drawX;
    this.rightX = this.drawX + this.width;
    this.topY = this.drawY;
    this.bottomY = this.drawY + this.height;
}

function defineObstacles() {
    //here what we have done is that we have defined the obstacles dimensions
    //1. tree width is 65 px
    //2. tree height is 90 px
    //3. rock width & height is same and it is 30
    //4. bush varies in the width so we will only take the height of the bush which is 28 px
    var treeWidth = 65,
        treeHeight = 90,
        rockDimensions = 30,
        bushHeight = 28;

    obstacles = [
        //how we re filling the obstacles is that we are giving the x and the y position of the obstacle with its properties
        new Obstacle(78, 360, treeWidth, treeHeight),
        new Obstacle(390, 395, treeWidth, treeHeight),
        new Obstacle(415, 102, treeWidth, treeHeight),
        new Obstacle(619, 184, treeWidth, treeHeight),
        new Obstacle(97, 63, rockDimensions, rockDimensions),
        new Obstacle(296, 379, rockDimensions, rockDimensions),
        new Obstacle(295, 25, 150, bushHeight),
        new Obstacle(570, 138, 150, bushHeight),
        new Obstacle(605, 492, 90, bushHeight)];
}


function checkKey(e, value) {
    //it is the varible which get the key value from the keyboard,
    // if e.keyCode doesn't work or the browser does't support it then get it throught the e.which
    var keyID = e.keyCode || e.which;
    //we will declare the if statement to check the value
    if(keyID === 38) {
        //38 is for the up arrow
        //what is happening here is if we press the keydown on the keyboard then the value will be set to true,
        //and if the keyup is prssed then the value is set to the false.
        player1.isUpKey = value;
        //e.prevent default is used to prevent the default actions of the key in this case up and down key is used to,
        //navigate the website
        e.preventDefault();
       }
    if(keyID === 39) {
        //right arrow
        player1.isRightKey = value;
        e.preventDefault();
       }
    if(keyID === 40) {
        //down arrow
        player1.isDownKey = value;
        e.preventDefault();
       }
    if(keyID === 37) {
        //left arrow
        player1.isLeftKey = value;
        e.preventDefault();
       }
    if(keyID === 32) {
        //Space bar
        player1.isSpacebar = value;
        e.preventDefault();
       }
}

//this function will return the true or false based on the player position on the canvas
// if the player is out of the canvas it will
//the function takes the three parameters
//1. a is the opjects
//2. the object's x position
//3. the object's y position
function outOfBounds(a, x, y) {
    //to check for the collision we have declared thest variables
    //we are adding the a.height and a.width to the varable beacuse the top of the player plus his height is equal to the bottom of the player asame comcept goes for the width
    var newBottomY = y + a.height,
        newTopY = y,
        newRightX = x + a.width,
        newLeftX = x,
        //this is the values of the top, bottom, right and the left boundary of the sprite to define the border
        //player cannot surpass these lines
        treeLineBottom = 570,
        treeLineTop = 5,
        treeLineRight = 750,
        treeLineLeft = 65;
    //if any of these is true then it will return the true
    return newBottomY > treeLineBottom || newTopY < treeLineTop || newRightX > treeLineRight || newLeftX < treeLineLeft;
}

//detects the bullet collides with the something
//takes the two parameters
//first and the second parameters are both objects
//for example first one will be the bullet and second one will be the enemy
function collision(a, b) {
    return a.drawX <= b.drawX + b.width && a.drawX >= b.drawX && a.drawY <= b.drawY + b.height && a.drawY >= b.drawY;
}





function Enemy() {
this.srcX = 140;
this.srcY = 600;
this.width = 45;
this.height = 54;
this.drawX = randomRange(0, canvasWidth - this.width);
this.drawY = randomRange(0, canvasHeight - this.height);
this.centerX = this.drawX + (this.width / 2);
this.centerY = this.drawY + (this.height / 2);

//these are the location on which enemy wants to move randomly
this.targetX = this.centerX;
this.targetY = this.centerY;

this.randomMoveTime = randomRange(4000, 10000);
this.speed = 1;
var that = this;

//what moveInterval does is it will call the anonomys function (function() {that.setTargetLocation();}) for every randomMoveTime millisecond
//this is how often this function will be called
//the point is it will call the setTargetLocation every random millisecond
this.moveInterval = setInterval(function() {that.setTargetLocation();}, that.randomMoveTime);
this.isDead = false;
}

Enemy.prototype.update = function() {
this.centerX = this.drawX + (this.width / 2);
this.centerY = this.drawY + (this.height / 2);
this.checkDirection();
};

Enemy.prototype.draw = function() {
ctxEntities.drawImage(imgSprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);

};

//this function will create a random location, to which enemy wnats to go
Enemy.prototype.setTargetLocation = function () {
this.randomMoveTime = randomRange(4000, 10000);
//we have defined it with + or - 50 beacse we want enemy to choose a random location in 50 by 50 area surrounding it
var minX = this.centerX - 50,
    maxX = this.centerX + 50,
    minY = this.centerY - 50,
    maxY = this.centerY + 50;
//but if the enemy is near to the boundary then making him 50 px could leve him out of the map
//so to solve this problem
if(minX < 0) {
   minX = 0;
}
if(maxX > canvasWidth) {
   maxX = canvasWidth;
}
if(minY < 0) {
   minY = 0;
}
if(maxY > canvasHeight) {
   maxY = canvasHeight;
}

this.targetX = randomRange(minX, maxX);
this.targetY = randomRange(minY, maxY);
};

//this function will help enemy to go to that location
Enemy.prototype.checkDirection = function () {
if(this.centerX < this.targetX) {
    this.drawX += this.speed;
}
else if(this.centerX > this.targetX) {
    this.drawX -= this.speed;
}

if(this.centerY < this.targetY) {
    this.drawY += this.speed;
}
else if(this.centerY > this.targetY) {
    this.drawY -= this.speed;
}

};

//this function will check if the enemy is hit by the bullet it will die
Enemy.prototype.die = function () {
//Defining the audio for the dying enemies
var soundEffect = new Audio("audio/dying.wav");
soundEffect.play();
//we need to clear interval beacuse if the enemy dies then we don;t want his deadbody floatring around
clearInterval(this.moveInterval);
this.srcX = 185;
this.isDead =true;
};



//this is the function which creates the enemies
function initEnemies() {
for(var i = 0; i < numEnemies; i++) {
    //this line adds the enemies to the canvas
    enemies[enemies.length] = new Enemy();
}
}

//this function will update the enemies on the canvas
function updateAllEnemies() {
for (var i = 0; i < enemies.length; i++) {
    //to update all the enemies
    enemies[i].update();
}
}

//this function will draw the enemies
function drawAllEnemies() {
for (var i = 0; i < enemies.length; i++) {
    //to update all the enemies
    enemies[i].draw();
}
}