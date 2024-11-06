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
  textSize(25);
  fill(50);
  textAlign(CENTER, TOP);
  text("Data Visualization 2: Population Map", width / 2, 20);

  // Display the author's name below the title
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

    fill(255, 0, 0, 100);
    ellipse(pos.x, pos.y, popSize, popSize);
  }
}

// function to show details of the city when clicked on it
function mousePressed() {
  selectedCity = null;  // Clear previous selection
  for (let r = 0; r < data.getRowCount(); r++) {
    let currentLat = data.getString(r, 'latitude');
    let currentLong = data.getString(r, 'longitude');
    let pos = myMap.latLngToPixel(currentLat, currentLong);

    let d = dist(mouseX, mouseY, pos.x, pos.y);
    if (d <= 10) {  // Increase click radius
      selectedCity = {
        city: data.getString(r, 'city'),
        country: data.getString(r, 'country'),
        population: data.getString(r, 'population'),
        x: mouseX,
        y: mouseY
      }
     }
   }
}

// function to display the city information box
function displayCityInfoBox(city) {
  // Box dimensions and padding
  let boxWidth = 200;
  let boxHeight = 80;
  let padding = 10;

  // Draw the background rectangle
  fill(255, 255, 255, 200);  // semi transparent white
  stroke(0); 
  strokeWeight(1);
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

// Resize canvas on window resize
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
