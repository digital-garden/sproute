#! /usr/bin/env node

console.log('This script populates some test plants, clippings and speciess to your database. Specified database as argument - e.g.: populatedb mongodb://your_username:your_password@your_dabase_url');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
if (!userArgs[0].startsWith('mongodb://')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}

var async = require('async')
var Plant = require('./models/plant')
var Clipping = require('./models/clipping')
var Species = require('./models/species')



var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

var clippings = []
var speciess = []
var plants = []


function clippingCreate(first_name, family_name, d_birth, d_death, cb) {
  clippingdetail = {first_name:first_name , family_name: family_name }
  if (d_birth != false) clippingdetail.date_of_birth = d_birth
  if (d_death != false) clippingdetail.date_of_death = d_death
  
  var clipping = new Clipping(clippingdetail);
       
  clipping.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Clipping: ' + clipping);
    clippings.push(clipping)
    cb(null, clipping)
  }  );
}

function speciesCreate(name, cb) {
  var species = new Species({ name: name });
       
  species.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Species: ' + species);
    speciess.push(species)
    cb(null, species);
  }   );
}

function plantCreate(title, summary, isbn, clipping, species, cb) {
  plantdetail = { 
    title: title,
    summary: summary,
    clipping: clipping,
    isbn: isbn
  }
  if (species != false) plantdetail.species = species
    
  var plant = new Plant(plantdetail);    
  plant.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Plant: ' + plant);
    plants.push(plant)
    cb(null, plant)
  }  );
}





function createSpeciesClippings(cb) {
    async.parallel([
        function(callback) {
          clippingCreate('Patrick', 'Rothfuss', '1973-06-06', false, callback);
        },
        function(callback) {
          clippingCreate('Ben', 'Bova', '1932-11-8', false, callback);
        },
        function(callback) {
          clippingCreate('Isaac', 'Asimov', '1920-01-02', '1992-04-06', callback);
        },
        function(callback) {
          clippingCreate('Bob', 'Billings', false, false, callback);
        },
        function(callback) {
          clippingCreate('Jim', 'Jones', '1971-12-16', false, callback);
        },
        function(callback) {
          speciesCreate("Fantasy", callback);
        },
        function(callback) {
          speciesCreate("Science Fiction", callback);
        },
        function(callback) {
          speciesCreate("French Poetry", callback);
        },
        ],
        // optional callback
        cb);
}


function createPlants(cb) {
    async.parallel([
        function(callback) {
          plantCreate('The Name of the Wind (The Kingkiller Chronicle, #1)', 'I have stolen princesses back from sleeping barrow kings. I burned down the town of Trebon. I have spent the night with Felurian and left with both my sanity and my life. I was expelled from the University at a younger age than most people are allowed in. I tread paths by moonlight that others fear to speak of during day. I have talked to Gods, loved women, and written songs that make the minstrels weep.', '9781473211896', clippings[0], [speciess[0],], callback);
        },
        function(callback) {
          plantCreate("The Wise Man's Fear (The Kingkiller Chronicle, #2)", 'Picking up the tale of Kvothe Kingkiller once again, we follow him into exile, into political intrigue, courtship, adventure, love and magic... and further along the path that has turned Kvothe, the mightiest magician of his age, a legend in his own time, into Kote, the unassuming pub landlord.', '9788401352836', clippings[0], [speciess[0],], callback);
        },
        function(callback) {
          plantCreate("The Slow Regard of Silent Things (Kingkiller Chronicle)", 'Deep below the University, there is a dark place. Few people know of it: a broken web of ancient passageways and abandoned rooms. A young woman lives there, tucked among the sprawling tunnels of the Underthing, snug in the heart of this forgotten place.', '9780756411336', clippings[0], [speciess[0],], callback);
        },
        function(callback) {
          plantCreate("Apes and Angels", "Humankind headed out to the stars not for conquest, nor exploration, nor even for curiosity. Humans went to the stars in a desperate crusade to save intelligent life wherever they found it. A wave of death is spreading through the Milky Way galaxy, an expanding sphere of lethal gamma ...", '9780765379528', clippings[1], [speciess[1],], callback);
        },
        function(callback) {
          plantCreate("Death Wave","In Ben Bova's previous novel New Earth, Jordan Kell led the first human mission beyond the solar system. They discovered the ruins of an ancient alien civilization. But one alien AI survived, and it revealed to Jordan Kell that an explosion in the black hole at the heart of the Milky Way galaxy has created a wave of deadly radiation, expanding out from the core toward Earth. Unless the human race acts to save itself, all life on Earth will be wiped out...", '9780765379504', clippings[1], [speciess[1],], callback);
        },
        function(callback) {
          plantCreate('Test Plant 1', 'Summary of test plant 1', 'ISBN111111', clippings[4], [speciess[0],speciess[1]], callback);
        },
        function(callback) {
          plantCreate('Test Plant 2', 'Summary of test plant 2', 'ISBN222222', clippings[4], false, callback)
        }
        ],
        // optional callback
        cb);
}




async.series([
    createSpeciesClippings,
    createPlants
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('unknow error in pop.db');
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});




