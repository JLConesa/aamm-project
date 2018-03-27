/*
Proyecto Web Aplicaciones Multimedia Curso 2017/2018

María Alonso Arroyo
José Luis Conesa Pérez
Pablo Lago Álvarez
Kenza Marrakchi Chikri
*/


var asteroids = [];
var bullets = [];


var Backg = function(){
    this.draw = function(ctx){
        ctx.fillStyle="#0E0E18";
        ctx.rect(0,0,4000,3000); /*Probablemente sea muy grande*/
        ctx.fill();
    }

}

var Ship = function(){
    this.side = 70;
    this.lives = 3; /*Vidas*/
    this.inmune = true;

  	this.x = window.innerWidth/2;  /*Se inicializa en el centro*/
  	this.y = window.innerHeight/2; /*Se inicializa en el centro*/

    this.xRight = this.x + this.side/2;
    this.yRight = this.y + this.side;

    this.xLeft = this.x - this.side/2;
    this.yLeft = this.y + this.side;

    this.centerX = (this.xRight-this.xLeft)/2;
    this.centerY = this.y+this.side/2;


    this.direction = 0; /*esta variable indicará hacia donde apunta la nave*/
    this.speedX = 0;
    this.speedY = -10;
    this.speed = 15; /*Velocidad general de la nave*/

    this.init = function(){
      this.side = 70;
      this.lives = 3; /*Vidas*/
      this.inmune = true;

      this.x = window.innerWidth/2;  /*Se inicializa en el centro*/
      this.y = window.innerHeight/2; /*Se inicializa en el centro*/

      this.xRight = this.x + this.side/2;
      this.yRight = this.y + this.side;

      this.xLeft = this.x - this.side/2;
      this.yLeft = this.y + this.side;

      this.centerX = (this.xRight-this.xLeft)/2;
      this.centerY = this.y+this.side/2;


      this.direction = 0; /*esta variable indicará hacia donde apunta la nave*/
      this.speedX = 0;
      this.speedY = -10;
      this.speed = 15; /*Velocidad general de la nave*/
    }

    this.move = function(){  /*acelera en la direction de la nave*/
        this.x = this.x + this.speedX;
        this.xRight = this.xRight + this.speedX;
        this.xLeft = this.xLeft + this.speedX;

        this.y = this.y + this.speedY;
        this.yRight = this.yRight + this.speedY;
        this.yLeft = this.yLeft + this.speedY;
        console.log("Acelerando...");
    }

    this.inertia = function(){ /*Debería activarse al dejar de acelerar*/
      this.speedX = 0;
      this.speedY = 0;
    }
    this.rotate = function(sense,ctx){
        var sensibility = Math.PI/8;
        if(sense === "left"){

            this.direction = this.direction + sensibility;
            /*this.x = ship.side*cos(this.direction);
            this.y = ship.side*sin(this.direction);*/
        }
        if(sense === "right"){
            this.direction = this.direction - sensibility;
        }
        this.speedX = -this.speed*Math.sin(this.direction);
        this.speedY = -this.speed*Math.cos(this.direction);
    }

  	this.draw = function(ctx, collition){
      if(collition){
        ctx.strokeStyle="red";
      }else if(this.inmune){
        ctx.strokeStyle="blue";

      }else{
        ctx.strokeStyle="#FFFFFF";
      }
      ctx.lineWidth="1";
      ctx.save();
      ctx.translate(this.x,this.y);
      ctx.rotate(-this.direction);

  		//ctx.moveTo(this.x,this.y);
      ctx.beginPath();
  		//ctx.lineTo(this.xRight,this.yRight);
      ctx.lineTo(-this.side/2, this.side);
  		//ctx.lineTo(this.xLeft,this.yLeft);
      ctx.lineTo(this.side/2,this.side);
  		//ctx.lineTo(this.x,this.y);
      ctx.lineTo(0,0);
  		ctx.closePath();
  		ctx.stroke();
      //ctx.translate(this.x, this.y);
      ctx.restore();
  	}

    this.shoot = function(bullet){
      bullet.push(new Bullet(this.x, this.y, 4, this.direction, 3));
      // console.log("pium");
      pew.play();
    }

    this.death = function(){
      /*Desaparece la nave, quita una vida o pierdes el juego*/
      if(this.inmune === false){
      this.x = 8000;
      this.side = 0; //meter animación destrozar lol
      this.lives = this.lives-1;
      this.inmune = true;
      //setTimeout(0,3000);
      if(this.lives<=0){
        this.side=0;
        gameOver();
      }
      }
      this.init();
    }
    this.hasCollided = function(asteroid){
        dx1 = Math.abs(asteroid.x - this.x);
        dy1 = Math.abs(asteroid.y - this.y);

        dx2 = Math.abs(asteroid.x - this.xRight);
        dy2 = Math.abs(asteroid.y - this.yRight);

        dx3 = Math.abs(asteroid.x - this.xLeft);
        dy3 = Math.abs(asteroid.y - this.yLeft);

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

        distanceCollition = Math.sqrt(Math.pow(this.side/2, 2) + Math.pow(asteroid.radius, 2));
        if(Math.sqrt(Math.pow(minDist1, 2) + Math.pow(minDist1, 2)) < distanceCollition){
          return true;
        }else{
          return false;
        }
      }
}

var Bullet = function(x,y, speed, angle, longitude){
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.speedX = - Math.sin(angle) * speed;
    this.speedY = - Math.cos(angle) * speed;
    this.longitude = longitude;
    this.bottomX = this.x - Math.sin(angle) * this.longitude;
    this.bottomY = this.y - Math.cos(angle) * this.longitude;

    this.draw = function(ctx){
        ctx.strokeStyle="#FFFFFF";
        ctx.lineWidth = '2';
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.bottomX, this.bottomY);
        ctx.closePath();
        ctx.stroke();
    }

    this.move = function(){
      this.x = this.x + this.speedX;
      this.y = this.y + this.speedY;

      this.bottomX = this.bottomX + this.speedX;
      this.bottomY = this.bottomY + this.speedY;
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
        ctx.strokeStyle="#FFFFFF";
		ctx.lineWidth = '2';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
        ctx.closePath();
		ctx.stroke();
    }

    this.destroy = function(ctx){
      /*Aquí el asteroide se dividirá en 2 pequeños o si es pequeño (radio<algo)
      saldrá una secuencia de destrozar*/
      this.radius = 0;
    }

    this.hasCollided = function(bullet){
        if(Math.abs(bullet.x-this.x)<this.radius && Math.abs(bullet.y-this.y)<this.radius){
          return true;
        }else{
          return false;
        }
    }
}

function resizeCanvas(canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

}

function removeOutOfBoundBullet(bullets){
  if(bullets.length > 0){
    for(i = 0; i<bullets.length; i++){
      if(bullets[i].x<-45 || bullets[i].y<-45 || bullets[i].x>window.innerWidth+45 || bullets[i].y>window.innerHeight+45){
        bullets.splice(i, 1);
      }
    }
  }
}

function gameOver(){
  var canvas = document.getElementById("fondo");
  var ctx = canvas.getContext("2d");
  ctx.fillStyle =("#FFFFFF");
  ctx.font = "30px Arial";
  ctx.fillText("GAME OVER",10,50);
  endSound.play();
}

function muteGame(){

  var btn = document.getElementById("mute");

  if(!pew.muted){
  pew.muted = true;
  startSound.muted = true;
  endSound.muted = true;
  reactor.muted = true;
  explosion.muted = true;
  document.getElementById("speaker").textContent =  "volume_up";
}
  else{
    pew.muted = false;
    startSound.muted = false;
    endSound.muted = false;
    reactor.muted = false;
    explosion.muted = false;
    document.getElementById("speaker").textContent =  "volume_off";
  }
}



function refresh(ship, asteroid, bullets, contexto, backg){
    backg.draw(contexto);
    ship.draw(contexto, false);
    if (ship.lives<=0){gameOver();}
    /*if(ship.inmune){
      setTimeout(function(){ship.inmune = false;},4000);
    }*/
    //setTimeout(function(){if(ship.inmune){ship.inmune = false;}},3000);

    for(i=0; i<asteroid.length; i++){
        asteroid[i].move();
        asteroid[i].draw(contexto);
        if(ship.hasCollided(asteroid[i])){
          ship.draw(contexto, true); //(Debug) lo pone en rojo
          //ship.death();
        }

          for(j=0; j<bullets.length; j++){
            bullets[j].move();
            bullets[j].draw(contexto);
            if(asteroid[i].hasCollided(bullets[j])){
              asteroid[i].destroy();
              explosion.play();
              bullets.splice(j,1); /*Elimina la bullet del array*/
            }
          }
    }
    console.log('lives: '+ship.lives);
    // console.log("inmune? "+ship.inmune)
}

function spawnAsteroids(asteroids,number, level){ //level aumentará la speed
//https://stackoverflow.com/questions/6254050/how-to-add-an-object-to-an-array
    for(i=0; i<number; i++){
        asteroids.push(new Asteroid(Math.random()*window.innerWidth,Math.random()*window.innerHeight,55,Math.random()*5-Math.random()*5,Math.random()*5-Math.random()*5,Math.random()*5));
    }
}

function key (e,ship, bullets,contexto){
		tecla  = e.which;
		switch (tecla){
			case 38: /*up*/
			   ship.move();
			break;
			case 37: /*left*/
			   ship.rotate("left",contexto);
			break;
			case 39: /*right*/
			   ship.rotate("right");
			break;
      case 32: /*space*/
        ship.shoot(bullets);
      break;
		}
}

window.onload = function(){
  var startSound = document.getElementById("startSound");
  var endSound = document.getElementById("endSound");
  var pew = document.getElementById("pew");
  var reactor = document.getElementById("reactor");
  var explosion = document.getElementById("explosion");

	var elemCanvas = document.getElementById('fondo');
	if (elemCanvas && elemCanvas.getContext){
		var contexto = elemCanvas.getContext('2d');
		var ship = new Ship();
    var backg = new Backg();
    resizeCanvas(elemCanvas);
    spawnAsteroids(asteroids,5,2);
    startSound.play();
    //var asteroids = [];
    //var bullets = [];
    document.onkeydown = function(e) {
		    key(e, ship, bullets, contexto);
	  }
    setInterval(function(){refresh(ship, asteroids, bullets, contexto,backg)}, 16);
    //setTimeout(function(){if(ship.inmune){ship.inmune = false;}},3000);
	}
    else{
		alert('Navegador Incompatible');
    }
}
