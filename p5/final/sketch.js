var sunriseImg;
var googleFont;
var weather;
var api = 'https://api.openweathermap.org/data/2.5/weather?q=';
var apiKey = '&appid=11769368576be5c3583c2050bd6ad840'; //apiKey
var units = '&units=metric';
var input;
var rain = []; //empty rain array
var drizzle = []; //empty drizzle array
var snow = []; //empty snow array
var gravity;
var cloudx = 0;
var lightningImg;

function preload() {
  sunriseImg = loadImage('sunrise.jpeg'); //https://www.collinsdictionary.com/us/dictionary/english/sunrise
  lightningImg = loadImage('lightning.jpeg'); //https://www.independent.co.uk/climate-change/news/lightning-length-world-record-where-longest-duration-distance-wmo-a9587101.html
  googleFont = loadFont("Raleway-VariableFont_wght.ttf"); //https://fonts.google.com/specimen/Raleway#standard-styles
}

function setup() {
  createCanvas(500,500);
  textFont('Raleway'); //change the font

  var button = select('#submit');
  button.mousePressed(weatherResults); //shows results when mouse is pressed

  input = select('#city');

  gravity = createVector(0, 0.03); //gravity of the snow falling

  for (i = 0; i < 100; i++) {
    rain[i] = new drawRain();
    drizzle[i] = new drawDrizzle();
  }
}

function weatherResults() {
  var url = api + input.value() + apiKey + units;
  loadJSON(url, gotData);
}

function gotData(data) {
  weather = data;
}

function draw() {
  background(sunriseImg);

  //stylize "Today's Weather"
  fill(255);
  noStroke();
  textSize(30);
  textAlign(CENTER,CENTER);
  text("Today's Weather...", 250, 250);
  textSize(12);

  //current date and time //https://editor.p5js.org/stephaniepaige/sketches/HyQqX_1UG
  m = month();
  d = day();
  y = year();
  text(m + "/" + d + "/" + y, 250, 50);
  hr = hour();
  min = minute();
  sec = second();
  text(hr + ":" + min + ":" + sec, 250, 450);

  //Conditionals for the different visuals based on the weather
  if (weather) {
    if (weather.weather[0].main === "Clouds") {
      background(150, 195, 255); //sky blue
      drawCloud(cloudx-250,100);
      drawCloud(cloudx+20,80);
      drawCloud(cloudx+400,100);
      drawCloud(cloudx,250);
      drawCloud(cloudx+250,200);
      drawCloud(cloudx+370,330);
      drawCloud(cloudx+100,400);
      drawCloud(cloudx-200,450);
      drawCloud(cloudx-300,300);
      drawCloud(cloudx+420,480);
      cloudx+=.5; //speed of cloud
      if (cloudx>380){
        cloudx = 50;
      } //when some clouds reach the end, it will move back
    } else if (weather.weather[0].main === "Clear") {
      background(78, 129, 247); //blue
      drawSun();
    } else if (weather.weather[0].main === "Rain") {
      background(148); //grey
      for (i = 0; i < rain.length; i++) {
        rain[i].fallingRain();
      }
    } else if (weather.weather[0].main === "Drizzle") {
      background(148); //grey
      for (i = 0; i < drizzle.length; i++) {
        drizzle[i].fallingDrizzle();
      }
    } else if (weather.weather[0].main === "Haze") {
      background(210, 218, 236); //light periwinkle
      drawMist(random(0,250),random(0,250));
      drawMist(random(0,250),random(0,250));
      drawMist(random(0,250),random(250,500));
      drawMist(random(250,500),random(0,250));
      drawMist(random(250,500),random(250,500));
      drawMist(random(250,500),random(250,500));
      filter(BLUR, 5);
    } else if (weather.weather[0].main === "Mist") {
      background(210, 218, 236); //light periwinkle
      drawMist(random(0,250),random(0,250));
      drawMist(random(0,250),random(250,500));
      drawMist(random(250,500),random(0,250));
      drawMist(random(250,500),random(250,500));
      filter(BLUR, 2); //blur https://p5js.org/reference/#/p5/filter
    } else if (weather.weather[0].main === "Snow") {
      background(215, 242, 246); //light cyan
      snow.push(new drawSnow); //one new snowflake
      for (flake of snow) {
        flake.applyForce(gravity);
        flake.update();
        flake.render();
      } // for every snow in that array
      for (let i = snow.length - 1; i >= 0; i--) {
        if (snow[i].offScreen()) {
          snow.splice(i,1);
        }
      } //loop through an array backwards, splice remove one snowflake
    } else if (weather.weather[0].main === "Thunderstorm"){
      background(lightningImg);
    } else {
      background(164, 197, 151); // green
      fill(196, 217, 187); // mint
      noStroke();
      ellipse(250,250,400);
    }

    fill(50); //dark grey
    noStroke();
    textAlign(CENTER,CENTER);
    //stylize weather description
    textSize(30);
    textStyle(BOLD);
    text(weather.weather[0].description, 250, 230);
    //stylize "in" + city name
    textSize(24);
    textStyle(NORMAL);
    text("in " + weather.name, 250, 270); //city name

    print(weather.weather[0].main);
  }
}

class drawRain {
  constructor() {
    this.x = random(-200,700);
    this.y = random(-1000,0);
    this.length = 20;
  }
  fallingRain() {
    noStroke();
    fill(198, 215, 255); //light blue
    ellipse(this.x, this.y, 4, this.length);
    this.y = this.y + 6
    if (this.y > 500) {
      this.y = 0;
    }
    if (this.length < 0) {
      this.length = 0;
    }
  }
} //more dense and larger than drizzle

class drawDrizzle {
  constructor() {
    this.x = random(-500, 1000);
    this.y = random(-1000,0);
    this.length = 15;
  }
  fallingDrizzle() {
    noStroke();
    fill(198, 215, 255); //light blue
    ellipse(this.x, this.y, 2, this.length);
    this.y = this.y + 6
    if (this.y > 500) {
      this.y = 0;
    }
    if (this.length < 0) {
      this.length = 0;
    }
  }
}

class drawSnow {
  constructor() {
    let x = random(width);
    let y = random(-100,-10);
    this.pos = createVector(x, y);
    this.vel = createVector();
    this.acc = createVector();
    this.size = random(2,15); //give the snowflakes a random size from 2 to 15
  }
  applyForce(force){
    //parallax effect hack
    let f = force.copy();
    f.mult(this.size); //bigger size, stronger force
    this.acc.add(f);
  }
  update() {
    this.vel.add(this.acc); //gravity influence velocity //gets faster as y increases
    this.vel.limit(this.size * 0.18);
    this.pos.add(this.vel);
    this.acc.mult(0); //multiplies the vector by 0
  } //add the velocity to the position
  render() {
    stroke(255);
    strokeWeight(this.size);
    point(this.pos.x, this.pos.y);
  } //make the snowflakes
  offScreen() {
    return (this.pos.y > height + this.size);
  }
}

function drawSun() {
  fill(255, 218, 118); //yellow
  stroke(255, 218, 118); //yellow
  strokeWeight(20);
  push();
    scale(1);
    translate(250, 250); //center of screen
    rotate(radians(frameCount / 8)); //speed of rotation
    ellipse(0, 0, 180, 180);
    line(0, -210, 0, -130); //top
    line(0, 130, 0, 210); //bottom
    line(-135, -135, -90, -90); //top left
    line(135, -135, 90, -90); //top right
    line(-210, 0, -130, 0); //left
    line(130, 0, 210, 0); //right
    line(-135, 135, -90, 90); //bottom left
    line(135, 135, 90, 90); //bottom right
  pop();
  noFill();
}

function drawCloud(cloudx,cloudy) {
  noStroke();
  fill(255, 254, 250); //off white
  push();
  ellipse(cloudx, cloudy - 20, 75, 55);
  ellipse(cloudx - 55, cloudy - 5, 75, 55);
  ellipse(cloudx + 50, cloudy, 75, 55);
  ellipse(cloudx + 20, cloudy + 15, 75, 55);
  ellipse(cloudx - 30, cloudy + 13, 75, 55);
  pop();
}

function drawMist(mistx, misty) {
  noStroke();
  fill(226, 231, 243); //light grey
  push();
  blendMode(LIGHTEST);
  ellipse(mistx, misty - 20, 150);
  ellipse(mistx - 100, misty, 150);
  ellipse(mistx + 100, misty, 150);
  ellipse(mistx + 60, misty + 40, 130);
  ellipse(mistx - 50, misty + 30, 150);
  pop();
}

//<---REFERENCES--->
// 10.5: Working with APIs in Javascript - p5.js Tutorial https://youtu.be/ecT42O6I_WI
// 10.6: API Query with User Input - p5.js Tutorial https://youtu.be/4UoUqnjUC2c
// ---
// Current Weather Data for over 200,000 cities: https://openweathermap.org/current
// ---
// Rain: https://editor.p5js.org/son/sketches/ry8-HnOAQ
// ---
// Sun: https://editor.p5js.org/monicawen/sketches/HkU-BCJqm
// ---
// Snow: Coding Challenge #88:Snowfall by The Coding Train https://youtu.be/cl-mHFCGzYk
    // let snow = []; //empty snow array
    // let gravity;
    // function draw() {
    //   background(0);
    //   snow.push(new Snowflake); //one new snowflake
    //   for (flake of snow) {
    //     flake.applyForce(gravity);
    //     flake.update();
    //     flake.render();
    //   } // for every snow in that array
    //   for (let i = snow.length - 1; i >= 0; i--) {
    //     if(snow[i].offScreen()){
    //       snow.splice(i,1);
    //     }
    //   }
    // } //loop through an array backwards, splice remove one snowflake
    //
    // class Snowflake {
    //   constructor() {
    //     let x = random(width);
    //     let y = random(-100,-10);
    //     this.pos = createVector(x, y);
    //     this.vel = createVector(0,0);
    //     this.acc = createVector();
    //     this.r = random(1,36); //give the snowflakes a size
    //   }
    //   applyForce(force){
    //     //parallax effect hack
    //     let f = force.copy();
    //     f.mult(this.r); //bigger size, stronger force
    //     this.acc.add(f);
    //   }
    //   update() {
    //     this.vel.add(this.acc); //gravity influence velocity //gets faster as y increases
    //     this.vel.limit(this.r * 0.2);
    //     this.pos.add(this.vel);
    //     this.acc.mult(0);
    //   } //add the velocity to the position
    //   render() {
    //     stroke(255);
    //     strokeWeight(this.r);
    //     point(this.pos.x, this.pos.y);
    //   }
    //   offScreen() {
    //     return (this.pos.y > height + this.r);
    //   }
    // }
// ---
// Cloud: https://editor.p5js.org/mena-landry/sketches/D7ql4Nd3V
