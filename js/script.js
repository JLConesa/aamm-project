/*
Proyecto Web Aplicaciones Multimedia Curso 2017/2018

María Alonso Arroyo
José Luis Conesa Pérez
Pablo Lago Álvarez
Kenza Marrakchi Chikri
*/

/* Al final creo que usaremos las CSS stars
var Stars = function(){
    this.draw = function(ctx){
        var stars = new Image();
        stars.src = 'img/stars.png';
        ctx.drawImage(stars,0,0);
    }

}
*/

var Backg = function(){
    this.draw = function(ctx){
        ctx.fillStyle="#0E0E18";
        ctx.rect(0,0,4000,3000); /*Probablemente sea muy grande*/
        ctx.fill();
    }

}

var Ship = function(x,y, speed, angle){
    this.side = 70;

  	this.x = window.innerWidth/2;
  	this.y = window.innerHeight/2;

    this.xRight = this.x + this.side/2;
    this.yRight = this.y + this.side;

    this.xLeft = this.x - this.side/2;
    this.yLeft = this.y + this.side;


    this.speedX = 0;
    this.speedY = 0;

    this.move = function(){ /*Yo haría que tuviera speed y rotation idk*/
        this.x = this.x + this.speedX;
        this.xRight = this.xRight + this.speedX;
        this.xLeft = this.xLeft + this.speedX;

        this.y = this.y + this.speedY;
        this.yRight = this.yRight + this.speedY;
        this.yLeft = this.yLeft + this.speedY;
    }

  	this.draw = function(ctx){
      ctx.strokeStyle="#FFFFFF";
  		ctx.beginPath();
  		ctx.moveTo(this.x,this.y);
  		ctx.lineTo(this.xRight,this.yRight);
  		ctx.lineTo(this.xLeft,this.yLeft);
  		ctx.lineTo(this.x,this.y);
  		ctx.closePath();
  /*
  		ctx.strokeStyle="#FFFFFF";
  		ctx.lineWidth = '3';
  */
  		ctx.stroke();
  	}

    this.collided = funtion(ctx){
      ctx.strokeStyle="red";
  		ctx.beginPath();
  		ctx.moveTo(this.x,this.y);
  		ctx.lineTo(this.xRight,this.yRight);
  		ctx.lineTo(this.xLeft,this.yLeft);
  		ctx.lineTo(this.x,this.y);
  		ctx.closePath();
  /*
  		ctx.strokeStyle="#FFFFFF";
  		ctx.lineWidth = '3';
  */
  		ctx.stroke();
    }
}

var Bullet = function(x,y, speedX, speedY){
/*idea: updatear speeds en función de la rotation de la nave*/
    this.x = x;
    this.y = y;
    this.draw = function(ctx){
        ctx.stroleStyle="red";
        ctx.lineWidth = '2';

    }

}

var Asteroid = function(x,y, radius, speedX, speedY, rotationSpeed){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speedX = speedX;
    this.speedY = speedY;
    this.rotationSpeed = rotationSpeed;

    this.move = function(){
        if(this.x>window.innerWidth+45){ /*cambiar 45 por this.radius*/
            this.x = -45;
        }
        if(this.x<-45){
            this.x = window.innerWidth+45;
        }else{
            this.x = this.x + this.speedX;
        }
        if(this.y>window.innerHeight+45){
            this.y = -45;
        }
        if(this.y<-45){
            this.y = window.innerHeight+45;
        }else{
            this.y = this.y + this.speedY;
        }
    }

    this.draw = function(ctx) {
        ctx.strokeStyle="red";
		ctx.lineWidth = '2';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
        ctx.closePath();
		ctx.stroke();
    }
}

function resizeCanvas(canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

}

function detectAsteroidToShipCollition(ship, asteroid){
    dx1 = abs(asteroid.x - ship.x);
    dy1 = abs(asteroid.y - ship.y);

    dx2 = abs(asteroid.x - ship.xRight);
    dy2 = abs(asteroid.y - ship.yRight);

    dx3 = abs(asteroid.x - ship.xLeft);
    dy3 = abs(asteroid.y - ship.yLeft);

    distance1 = Math.sqrt( Math.pow(dx1,2) +  Math.pow(dy1,2));
    distance2 = Math.sqrt( Math.pow(dx2,2) +  Math.pow(dy2,2));
    distance3 = Math.sqrt( Math.pow(dx3,2) +  Math.pow(dy3,2));

    minDist1 = distance1;
    minDist2 = distance2;

    if(minDist1 > distance3){
      minDist1 = distance3;
    }else if(minDist2 > distance3){
      minDist2 = distance3;
    }

    distanceCollition = Math.sqrt(Math.pow(ship.side/2, 2) + Math.pow(asteroid.radius, 2));

    if(minDist1+minDist2 < distanceCollition){
      return true;
    }else{
      return false;
    }
  }

function refresh(ship, asteroid, contexto, backg){
    backg.draw(contexto);
    ship.draw(contexto);
    for(i=0; i<asteroid.length; i++){
        asteroid[i].move();
        asteroid[i].draw(contexto);
        if(detectAsteroidToShipCollition(ship, asteroid[i])){
          ship.collided(contexto);
        }
    }
}

function spawnAsteroids(asteroids,number, level){ //level aumentará la speed
//https://stackoverflow.com/questions/6254050/how-to-add-an-object-to-an-array
    for(i=0; i<number; i++){
        asteroids.push(new Asteroid(Math.random()*window.innerWidth,Math.random()*window.innerHeight,55,Math.random()*5-Math.random()*5,Math.random()*5-Math.random()*5,Math.random()*5));
    }
}

window.onload = function(){
	var elemCanvas = document.getElementById('fondo');
	if (elemCanvas && elemCanvas.getContext){
		var contexto = elemCanvas.getContext('2d');
		var ship = new Ship();

        /*var asteroid = new Asteroid(500, 100, 55, 2, 2, 0);*/
        var backg = new Backg();
        resizeCanvas(elemCanvas);

        /*asteroid.draw(contexto);
        ship.draw(contexto);*/

        var asteroids = [];
        spawnAsteroids(asteroids,5,2);


        setInterval(function(){refresh(ship, asteroids, contexto,backg)}, 16);


	}
    else{
		alert('Navegador Incompatible');
    }
}
