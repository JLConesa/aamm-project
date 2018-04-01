/*
Proyecto Web Aplicaciones Multimedia Curso 2017/2018

María Alonso Arroyo     100
José Luis Conesa Pérez  100
Pablo Lago Álvarez      100346367
Kenza Marrakchi Chikri  100
*/

/*******************************************************************************
                                 GLOBAL VARIABLES
*******************************************************************************/
var asteroids = [];
var bullets = [];


/*******************************************************************************
                                OBJECT DECLARATION
*******************************************************************************/

/*********************************BACKGROUND***********************************/
var Backg = function(){
    this.draw = function(ctx){
        ctx.fillStyle="#0E0E18";
        ctx.rect(0,0,4000,3000); /*Bigger than most screens*/
        ctx.fill();
    }

}

/********************************SPACESHIP*************************************/
var Ship = function(){

    /*init. values*/
    this.radius = 24;               /*radius obtained from sprite*/
    this.x = window.innerWidth/2;   /*centered initial position*/
  	this.y = window.innerHeight/2;  /*centered initial position*/

    /*hitbox, from the sprite*/
    this.scndradius = 13;
    this.topX = this.x;
    this.topY = this.y - 37;

    /*atributes*/
    this.lives = 3;
    this.inmune = true;
    this.exploding = false;
    this.dead = false;

    /*ship sprite*/
    this.sprite = new Image();
    this.sprite.src = "img/TempestShipIcon.png";
    this.explosion = new Image();
    this.explosion.src = "img/explosion.png";
    this.inmuneSprite = new Image();
    this.inmuneSprite.src = "img/Inmune.png";
    this.explosionXCounter = 0;
    this.explosionYCounter = 0;

    /*movement*/
    this.direction = 0;   /*this var stores where the ship is pointing*/
    this.speedX = 0;
    this.speedY = -10;
    this.speed = 15;      /*ship speed*/

    this.init = function(){
      /*init. values*/
      this.radius = 24;              /*radius obtained from sprite*/
      this.x = window.innerWidth/2;  /*centered initial position*/
    	this.y = window.innerHeight/2; /*centered initial position*/

      /*hitbox, from the sprite*/
      this.scndradius = 13;
      this.topX = this.x;
      this.topY = this.y - 37;

      /*ship sprite*/
      this.sprite = new Image();
      this.sprite.src = "img/TempestShipIcon.png";
      this.explosion = new Image();
      this.explosion.src = "img/explosion.png";
      this.explosionXCounter = 0;
      this.explosionYCounter = 0;

      /*movement*/
      this.direction = 0; /*this var stores where the ship is pointing*/
      this.speedX = 0;
      this.speedY = -10;
      this.speed = 15; /*ship speed*/
    }

    this.move = function(){  /*ship accelerates towards its direction*/
      if(this.exploding === false){
        if(this.x>window.innerWidth+this.radius/2){
          this.x = -this.radius/2;
          this.topX = -this.radius/2;
        }
        if(this.x<-this.radius/2){
          this.x = window.innerWidth+this.radius/2;
          this.topX = window.innerWidth+this.radius/2;
        }else{
          this.x = this.x + this.speedX;
  			  this.topX = this.topX + this.speedX;
        }
        if(this.y>window.innerHeight+this.radius/2){
          this.y = -this.radius/2;
          this.topY = -this.radius/2 - 37;
        }
        if(this.y<-this.radius/2){
          this.y = window.innerHeight+this.radius/2;
          this.topY = window.innerHeight+this.radius/2 - 37;
        }else{
          this.y = this.y + this.speedY;
  			  this.topY = this.topY + this.speedY;
        }
      }
    }

    this.rotate = function(sense,ctx){
        var sensibility = Math.PI/8;
        if(sense === "left"){
            this.direction = this.direction + sensibility;
        }
        if(sense === "right"){
            this.direction = this.direction - sensibility;
        }
        this.topX = this.x - 37*Math.sin(this.direction);
        this.topY = this.y - 37*Math.cos(this.direction);
        this.speedX = -this.speed*Math.sin(this.direction);
        this.speedY = -this.speed*Math.cos(this.direction);
    }

  	this.draw = function(ctx, collition){
      if(this.exploding === false){
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
          if(this.inmune){
            ctx.drawImage(this.inmuneSprite,-this.sprite.width/2,-60);
          }else{
            ctx.drawImage(this.sprite,-this.sprite.width/2,-60);
          }
          ctx.rotate(this.direction);

          ctx.beginPath();
          ctx.arc(0, 0, this.radius, 0, 2*Math.PI);
          ctx.closePath();
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(this.topX-this.x, this.topY-this.y, this.scndradius, 0, 2*Math.PI);
          ctx.closePath();
          ctx.stroke();
          ctx.restore();
      }else{
        ctx.save();
        ctx.translate(this.x,this.y);
        ctx.drawImage(this.explosion,this.explosionXCounter*100, this.explosionYCounter*100, 100, 100, -50, -50, 100, 100);
        ctx.restore();
        this.explosionXCounter = this.explosionXCounter + 1;
        this.explosionYCounter = this.explosionYCounter + 1;
        if(this.explosionXCounter === 10 && this.explosionYCounter === 10){
          this.exploding = false;
          this.inmune = true;
          this.explosionXCounter = 0;
          this.explosionXCounter = 0;
          if(this.lives >=0 ){
            startSound.play();
          }
          this.init();
        }
        if(this.explosionXCounter === 10){
          this.explosionXCounter = 0;
        }
      }
  	}

    this.shoot = function(bullet){
      bullet.push(new Bullet(this.topX, this.topY, 4, this.direction, 3));
      // console.log("pium");
      pew.play();
    }

    this.death = function(){

      /*Desaparece la nave, quita una vida o pierdes el juego*/
      if(this.inmune === false){
        explosion.play();
        this.exploding = true;
        this.inmune = true;
        this.lives = this.lives-1;
        if(this.lives<0){
          this.radius=0;
        }
      }

    }

    this.hasCollided = function(asteroid){
      if(this.exploding === false){
        dx = Math.abs(asteroid.x - this.x);
        dy = Math.abs(asteroid.y - this.y);

        dtopX = Math.abs(asteroid.x - this.topX);
        dtopY = Math.abs(asteroid.y - this.topY);

        distance = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));
        topDistance = Math.sqrt(Math.pow(dtopX,2)+Math.pow(dtopY,2));

        distCollition = this.radius + asteroid.radius;
        topDistCollition = this.scndradius + asteroid.radius

        if(distance < distCollition){
          return true;
        }else if(topDistance < topDistCollition){
          return true;
        }else{
          return false;
        }
      }else{
        return false;
      }
    }
}

/********************************BULLET****************************************/
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

/******************************ASTEROID****************************************/
var Asteroid = function(x,y, radius, speedX, speedY, rotationSpeed){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.sprite = new Image();
    if(this.radius === 55){
      this.sprite.src = "img/xlAsteroid.png";
    }else if(this.radius < 27.5){
      console.log(this.radius);
      this.sprite.src = "img/sAsteroid.png";
    }else{
      this.sprite.src = "img/mAsteroid.png";
    }

    // console.log(this.radius);
    this.speedX = speedX;
    this.speedY = speedY;
    this.rotationSpeed = rotationSpeed;
    this.direction = 0;

    this.move = function(){
        if(this.x>window.innerWidth+this.radius){
            this.x = -this.radius;
        }
        if(this.x<-this.radius){
            this.x = window.innerWidth+this.radius;
        }else{
            this.x = this.x + this.speedX;
        }
        if(this.y>window.innerHeight+this.radius){
            this.y = -this.radius;
        }
        if(this.y<-this.radius){
            this.y = window.innerHeight+this.radius;
        }else{
            this.y = this.y + this.speedY;
        }

        this.direction = this.direction + this.rotationSpeed;
    }

    this.draw = function(ctx) {
        ctx.save();
        ctx.translate(this.x,this.y);
        ctx.rotate(-this.direction);
        ctx.drawImage(this.sprite,-this.sprite.width/2,-this.sprite.height/2);
        ctx.rotate(this.direction);

        ctx.strokeStyle="#FFFFFF";
		    ctx.lineWidth = '2';
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, 2*Math.PI);
        ctx.closePath();
		    ctx.stroke();

        ctx.restore();
    }

    this.hasCollided = function(bullet){
        if(Math.abs(bullet.x-this.x)<this.radius && Math.abs(bullet.y-this.y)<this.radius){
          return true;
        }else{
          return false;
        }
    }
}

/********************************SCORE*****************************************/
var Score = function(lives,puntuation,ctx){
  this.draw = function(lives){
    ctx.fillStyle =("#FFFFFF");
    ctx.font = "40px Arial";
    ctx.textAlign="center";
    ctx.fillText("Lives: "+lives,window.innerWidth/2,50);

  }
}

/*******************************************************************************
                             OTHER FUNCTIONS
*******************************************************************************/
function resizeCanvas(canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

}

function spawnAsteroids(asteroids,number, level){
  /*level aumentará la speed*/

    for(i=0; i<number; i++){
        asteroids.push(new Asteroid(Math.random()*window.innerWidth,Math.random()*window.innerHeight,55,Math.random()*2-Math.random()*2,Math.random()*2-Math.random()*2,Math.random()*0.05));
    }
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

function gameOver(ctx){
  var gameOverImg = new Image();
  gameOverImg.src = "img/GameOver.png";
  ctx.drawImage(gameOverImg, window.innerWidth/2 - gameOverImg.width, window.innerHeight/2 - gameOverImg.height);

  endSound.play();
  if(endSound.ended){
    endSound.pause();
    endSound.muted = true;
  }
}

function muteGame(){
  if(!pew.muted){
  pew.muted = true;
  startSound.muted = true;
  endSound.muted = true;
  reactor.muted = true;
  explosion.muted = true;
  document.getElementById("speaker").textContent =  "volume_off";
  }else{
    pew.muted = false;
    startSound.muted = false;
    endSound.muted = false;
    reactor.muted = false;
    explosion.muted = false;
    document.getElementById("speaker").textContent =  "volume_up";
  }
}

/*******************************************************************************
                             REFRESH FUNCTION
*******************************************************************************/
function refresh(ship, asteroid, bullets, contexto, backg, score){
	/*Esta función nos ayuda a refrescar la pantalla del canvas, se realizará cada cierto tiempo*/
    backg.draw(contexto); /*dibuja el fondo de la pantalla*/

    if(startSound.ended){ /*end he inmune period*/
      ship.inmune = false;
    }

    for(i=0; i<asteroid.length; i++){
        asteroid[i].move();
        asteroid[i].draw(contexto);
        if(ship.hasCollided(asteroid[i]) && ship.dead == false){
          ship.draw(contexto, true); //(Debug) lo pone en rojo
          ship.death();
        }

        for(j=0; j<bullets.length; j++){
          bullets[j].move();
          bullets[j].draw(contexto);
          if(asteroid[i].hasCollided(bullets[j])){
			        if(asteroid[i].radius > 30){
				            asteroid.splice(i,1,new Asteroid(asteroid[i].x+asteroid[i].speedX,asteroid[i].y-asteroid[i].speedY,asteroid[i].radius/Math.sqrt(2),asteroid[i].speedX*3*Math.random(),asteroid[i].speedY*2*Math.random(),asteroid[i].rotationSpeed),
			                                  new Asteroid(asteroid[i].x-asteroid[i].speedX,asteroid[i].y+asteroid[i].speedY,asteroid[i].radius/Math.sqrt(2),asteroid[i].speedX*2*Math.random(),asteroid[i].speedY*3*Math.random(),asteroid[i].rotationSpeed));
              }else{
				            asteroid.splice(i,1);
			        }
			        explosion.play();
              bullets.splice(j,1); /*Elimina la bullet del array*/
            }
        }
    }
    if(asteroid.length<=0){
      spawnAsteroids(asteroid,3,2);
    }


    if (ship.lives<=0 && ship.exploding == false){
        ship.dead = true;
        gameOver(contexto);
    }else if (ship.dead == false){
      ship.draw(contexto, false);
    }
    if(ship.dead == false){
      score.draw(ship.lives);
    }
    console.log('lives: '+ship.lives);
    //console.log(asteroid.length);
    // console.log("inmune? "+ship.inmune)
}


/*******************************************************************************
                                 KEY DETECTION
*******************************************************************************/
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


/*******************************************************************************
                                 MAIN
*******************************************************************************/
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
    var score = new Score(ship.lives,0,contexto);
		resizeCanvas(elemCanvas);
		spawnAsteroids(asteroids,3,2);
    startSound.play();

		/*Listens if a key has been pressed*/
		document.onkeydown = function(e) {
      if(ship.dead == false){
				key(e, ship, bullets, contexto);
      }
		}
		/*SetInterval llama a una funcion cada cierto periodo de tiempo (en milisegundos)*/
		setInterval(function(){refresh(ship, asteroids, bullets, contexto, backg, score)}, 16);
	}
    else{
		alert('Navegador Incompatible con HTML5 Canvas');
    }
}
