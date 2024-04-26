var mongoose = require("mongoose");

var Data = mongoose.model("Info",{
    ident: {
        required: true,
        unique: true,
        type:Number
    },
    username: {
        required: true,
        unique: true,
        type:String
    },
    password: {
        required: true,
        unique: true,
        type:String
    }
});

//var Data = mongoose.model("Info",{
//    ident: Number,
//    name: String
//});


module.exports = Data;

