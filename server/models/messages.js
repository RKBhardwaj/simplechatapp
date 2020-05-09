const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messagesSchema = new Schema({ 
    name : String, 
    message : String
});

mongoose.model('Messages', messagesSchema);
