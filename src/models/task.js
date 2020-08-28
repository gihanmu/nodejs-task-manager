const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
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
}, {
    timestamps: true
})

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;