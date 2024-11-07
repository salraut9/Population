const options = {
  lat: 32,   // initial map coordinates
  lng: 100,
  zoom: 4,
  style: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
};

// Create an instance of Leaflet
const mappa = new Mappa('Leaflet');
let myMap;
let canvas;
let data;
let selectedCity = null;  // Stores the clicked city data
let boxColor = [255, 255, 255, 200];  // Initial box color (white with some transparency)

function preload() {
  data = loadTable('population_data.csv', 'csv', 'header');
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight).parent('canvasContainer'); // map on the <div>
  
  // Create a tile map and overlay the canvas on top.
  myMap = mappa.tileMap(options);
  myMap.overlay(canvas); // div -> map -> canvas
  myMap.onChange(mapPopulation);
}

function draw() {
  textSize(24);
  fill(50);
  textAlign(CENTER, TOP);
  text("Data Visualization 2: Population Map", width / 2, 20);

  textSize(16);
  text("Saloni Raut MM621", width / 2, 50);

  textSize(16);
  fill(0);
  textAlign(RIGHT, BOTTOM);
  text("Click to get data", width - 10, height - 10);

  // Display selected city data if a city has been clicked
  if (selectedCity) {
    displayCityInfoBox(selectedCity);
  }
}

// function to map population data on the mappa map
function mapPopulation(){
   clear();
   for (let r = 0; r < data.getRowCount(); r++) {
    let currentLat = data.getString(r, 'latitude');
    let currentLong = data.getString(r, 'longitude');
    let pop = data.getString(r, 'population');

    // convert latitude and longitude to x and y position
    let pos = myMap.latLngToPixel(currentLat, currentLong);

    // map population to ellipse size
    let popSize = map(pop, 0, 37000000, 1, 50);

    // random color each ellipse
    let rColor = random(50, 255);
    let gColor = random(50, 255);
    let bColor = random(50, 255);

    fill(rColor, gColor, bColor, 150);  // semi transparent color
    ellipse(pos.x, pos.y, popSize, popSize);
  }
}

// function to handle mouse click and display city info
function mousePressed() {
  selectedCity = null;  // clear previous selection
  for (let r = 0; r < data.getRowCount(); r++) {
    let currentLat = data.getString(r, 'latitude');
    let currentLong = data.getString(r, 'longitude');
    let pos = myMap.latLngToPixel(currentLat, currentLong);

    let d = dist(mouseX, mouseY, pos.x, pos.y);
    if (d <= 10) {  // increase click radius
      selectedCity = {
        city: data.getString(r, 'city'),
        country: data.getString(r, 'country'),
        population: data.getString(r, 'population'),
        x: mouseX,
        y: mouseY
      };
      
      // set a new random color for the box when a city is clicked
      boxColor = [
        random(50, 255),   
        random(50, 255),   
        random(50, 255), 
        200                // transparency
      ]
    }
  }
}

// function to display the city information box
function displayCityInfoBox(city) {
  // box dimensions 
  let boxWidth = 200;
  let boxHeight = 80;
  let padding = 10;

  // draw the background rectangle with the random color
  fill(boxColor);  //  randomly set box color
  stroke(0);       
  strokeWeight(0);
  rect(city.x, city.y, boxWidth, boxHeight, 8);  // Rounded corners

  // Display city information text inside the box
  fill(0);
  noStroke();
  textSize(14);
  textAlign(LEFT, TOP);
  text(`City: ${city.city}`, city.x + padding, city.y + padding);
  text(`Country: ${city.country}`, city.x + padding, city.y + padding + 20);
  text(`Population: ${city.population}`, city.x + padding, city.y + padding + 40);
}

// resize canvas on window resize
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
