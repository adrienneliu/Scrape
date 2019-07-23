var mongoose = require("mongoose"); 

//save reference to schema constructor
var Schema = mongoose.Schema; 

//new object 
var RecipeSchema = new Schema ({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    saved: {
        type: Boolean,
        default: false
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

var Recipe = mongoose.model("Recipe", RecipeSchema);

module.exports = Recipe; 