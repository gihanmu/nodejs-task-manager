const mongoose = require('mongoose');


const Task = mongoose.model('Task', {
    description : {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner : {
       type: mongoose.Schema.Types.ObjectId,
       required: true,
       ref: 'User' //This will pick the whole user object
    }
});

module.exports = Task;