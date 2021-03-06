const config = require('config-yml');
const mongoose = require('mongoose');
const user = require('../entities/entity-user');

mongoose.set('useFindAndModify', false);

let arrayConns = [], db = {};

if (config.db.mongodb && config.db.mongodb.length > 0) {
    config.db.mongodb.map((c)=>{
        mongoose.connect(`mongodb://${c.host}/${c.database}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            poolSize: 10 
          });
        db[c.nameconn] = {}
        db[c.nameconn].conn = mongoose;
        db[c.nameconn].User = user(mongoose);
    })
    exports.db = db;
} else {
    console.log("Error connecting to database");
}
