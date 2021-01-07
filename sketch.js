//Create variables here
var dog, happyDog, foodS, database, foodStock;
var dogImg, happyDogImg;
var count = 20;
var fedTime, lastFed, foodObj, feedPet, AddFood;

function preload()
{
  //load images here
  dogImg = loadImage("images/dogImg.png");
  happyDogImg = loadImage("images/dogImg1.png");

}

function setup() {
  createCanvas(1000, 500);
  
  dog = createSprite(800, 200);
  dog.addImage(dogImg);
  dog.scale = 0.2;

  database = firebase.database();

  foodStock = database.ref('Food')
  foodStock.on("value", (data)=>{
    foodS = data.val();
    foodObj.updateFoodStock(foodS);
  });

  foodObj = new Food();

  feedPet = createButton("Feed the dog");
  feedPet.position(700, 20);
  feedPet.mousePressed(feedDog);

  AddFood = createButton("Add food");
  AddFood.position(800, 20);
  AddFood.mousePressed(addFoods);

}


function draw() {  
  background(46, 139, 87);

  foodObj.display();

  fedTime = database.ref('FeedTime');
  fedTime.on("value", function(data){
    lastFed = data.val();
  });

  fill(255, 255, 254);
  textSize(15);
  if (lastFed >= 12){
    text("Last fed: "+lastFed%12+"PM", 500, 30);
}else if (lastFed == 0){
    text("Last fed : 12 AM", 500, 30);
}else {
    text("Last fed : " + lastFed + "AM", 500, 30);
}

  drawSprites();

  foodObj.display();

  //add styles here
  textSize(20);
  fill("white");
  text("Food Remaining: " + foodS, 200, 100);
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food : foodS
  });
}

function feedDog(){
  dog.addImage(happyDogImg);

  foodObj.updateFoodStock(foodObj.foodStock-1);
  database.ref('/').update({
    Food : foodObj.foodStock,
    FeedTime : hour()
  });
}