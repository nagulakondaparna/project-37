var bg;
var dog, dogImg, happyImg, sadImg, rest;
var database;
var foodS, foodStock;

var gameState, gameS;

var bedroom, bedr, garden, gardn, bathroom, bathr;

var feed, add;
var fedTime, lastFed;
var currentTime;
var foodObj;
var name = "Oreo";

var response, responseJSON, datetime, hour, minute;

function preload()
{ 
  bg = loadImage("images/bg2.jpg");
  dogImg = loadImage("images/happy.png");
  play = loadImage("images/play.png");
  rest = loadImage("images/dogRest.png");
  bedr = loadImage("images/bedroom.jpg");
  gardn = loadImage("images/garden.jpg");
  bathr = loadImage("images/bathroom.jpg");
  sadImg = loadImage("images/sad.png");
  happyImg = loadImage("images/sleep.png");
}

function setup() {
  createCanvas(1500, 700);

  bedroom = createSprite(displayWidth/2, 250);
  bedroom.addImage(bedr);
  bedroom.scale = (2);

  bedroom.visible = false;

  bathroom = createSprite(displayWidth/2-20, 250);
  bathroom.addImage(bathr);
  bathroom.scale = (1.6);

  bathroom.visible = false;

  backyard = createSprite(displayWidth/2-10, 250);
  backyard.addImage(bg);
  backyard.scale = (2.5);

  backyard.visible = false;

  garden = createSprite(displayWidth/2, 250);
  garden.addImage(gardn);
  garden.scale = (2.6);

  garden.visible = false;
  
  database = firebase.database();

  dog = createSprite(1050, 550);
  dog.scale = (0.7);

  foodStock = database.ref("Food");
  foodStock.on("value", readStock);

  gameState = database.ref("gameState");
  gameState.on("value", readGameState);

  foodObj = new food();

  feed = createButton("Feed "+name)
  feed.position(1000,680)
  feed.size(120, 30);
  feed.mousePressed(function(){
    FeedDog();
  });

  add = createButton("Add Food")
  add.position(766, 663)
  add.size(120, 30);
  add.mousePressed(function(){
    AddFood();
  });

  home = createButton("Home")
  home.position(220, 40)
  home.size(120, 30);
  home.mousePressed(function(){
    update("House");
  });

  bed = createButton("Bedroom")
  bed.position(350, 40)
  bed.size(120, 30);
  bed.mousePressed(function(){
    update("Sleeping");
  });

  bath = createButton("Bathroom")
  bath.position(480, 40)
  bath.size(120, 30);
  bath.mousePressed(function(){
    update("Bathing");
  });

  gar = createButton("Garden")
  gar.position(610, 40)
  gar.size(120, 30);
  gar.mousePressed(function(){
    update("Playing");
  });
}


function draw() {  

  fedTime = database.ref('FeedTime');
  fedTime.on("value", readLastTime);


  if (gameS !== "House") {
    feed.hide();
    add.hide();
  }

  /*
  currentTime = hour;
   
  if (currentTime == (lastFed + 1)) {
    update("Playing");
    background(garden);
  }
  
  if (currentTime == (lastFed + 2)) {
    update("Sleeping");
    background(bedr);
  }
 
  if (currentTime > (lastFed + 2) && currentTime < (lastFed + 4)) {
    update("Bathing");
    background(bathr);
  }

  if (currentTime > (lastFed + 4)){
    update("hungry");
  }
  
  */


 drawSprites();

 if (gameS === "House") {
  bedroom.visible = false;
  bathroom.visible = false;
  garden.visible = false;

  backyard.visible = true;

  foodObj.display();
  
  feed.show();
  add.show();

  dog.addImage(dogImg);

  dog.x = 1050;
  dog.y = 550;

}
  
 if (gameS === "Sleeping") {
  bedroom.visible = true;

  bathroom.visible = false;
  garden.visible = false;
  backyard.visible = false;

  dog.addImage(rest);

  dog.x = 750;
  dog.y = 200;

}

 if (gameS === "Bathing") {
  bathroom.visible = true;

  bedroom.visible = false;
  backyard.visible = false;
  garden.visible = false;

  dog.addImage(happyImg);

  dog.x = 400;
  dog.y = 340;

}

if (gameS === "Playing") {
  bathroom.visible = false;
  bedroom.visible = false;
  backyard.visible = false;

  garden.visible = true;

  dog.addImage(play);

  dog.x = 600;
  dog.y = 500;

}

  

  
  worldTime();

  fill(255);
  textSize(30);
  textFont("Times New Roman");5
  text("Food Left : " +foodS +" 🥛", 390, 660);

  currentTime = hour;

  fill(255);
  textSize(30);
  textFont("Times New Roman");
  text("Last Fed : " +lastFed%12 +" pm", 40, 660);
  text("Time : " +currentTime%12 + " pm", 1240, 660);

}

function readLastTime(data) {
  lastFed = data.val();
}

function writeLastTime(t) {

  database.ref("/").update({
    FeedTime : t
  })
}

function readStock(data) {
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function writeStock(x) {

  if (x <= 0) {
    x = 0;
    
    dog.addImage(rest);
  }
  else {
    x = x - 1;
  }

  database.ref("/").update({
    Food : x
  })
}

function updateGameS() {
  database.ref('/').update({
    gameState : gameS
  })
}

function readGameState(data) {
  gameS = data.val();
}

async function worldTime() {
  response = await fetch("http://worldtimeapi.org/api/timezone/Asia/Kolkata");
  responseJSON = await response.json();

  datetime = responseJSON.datetime;
  hour = datetime.slice(11, 13) ;
  minute = datetime.slice(14, 16);
}

function FeedDog(){

  if(foodS>0){

    worldTime();

    database.ref('/').update({
    Food : foodObj.getFoodStock(),
    FeedTime : hour
  })

  foodS--

  dog.addImage(happyImg);
  
  database.ref('/').update({
    Food : foodS
  });

  }

}

function AddFood(){

  foodS++

  database.ref('/').update({
    Food : foodS
  });
}

function update(state) {
  database.ref('/').update({
    gameState : state
  })
}
