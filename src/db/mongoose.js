const mongoose = require('mongoose');
const User = require('../models/User');
const Task = require('../models/task');


mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true, 
    useCreateIndex: true,
    useUnifiedTopology: true
});


const createUser = (userData) => {
    const user = User(userData);
    return user.save();
}

const updateUser = (id, userData) => {
    const user = User.findByIdAndUpdate(id, userData, {new: true});
    return user;
}

const deleteUser = (id) => {
    const user = User.findByIdAndRemove(id);
    return user;
}

const getUsers = () => {
    return User.find({});
}

const getUser = (id) => {
    return User.findById(id);
}

const createTask = (taskData) => {
    const task = Task(taskData);
    return task.save();
}

const updateTask = (id, taskData) => {
    const task = Task.findByIdAndUpdate(id, taskData, {new: true});
    return task;
}

const deleteTask = (id) => {
    const task = Task.findByIdAndDelete(id);
    return task;
}

const getTasks = () => {
    return Task.find({});
}

const getTask = (id) => {
    return Task.findById(id);
}



const crud = {
    createUser,
    updateUser,
    deleteUser,
    getUsers,
    getUser,
    createTask,
    updateTask,
    getTasks,
    getTask,
    updateTask,
    deleteTask
    
}

module.exports = crud;