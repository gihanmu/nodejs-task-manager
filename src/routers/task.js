const express = require('express');
const router = express.Router();
const crud = require('../db/mongoose');
const auth = require('../middleware/auth');

//GET tasks?completed=true/false (Use query params)
//use limit and skip for pagination
//Use sort for sorting
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {};
    const sortByParts = req.query.sortBy ? req.query.sortBy.split('_') : [];
    if (sortByParts.length) {
        sort[sortByParts[0]] =  sortByParts[1] === 'desc' ? -1 : 1; // 1 for ASC, -1 for DESC
    }
 
    if(req.query.completed) {
        match['completed'] = req.query.completed === 'true';
    }
  
    await req.user.populate({
        path: 'tasks',
        match,
        options: {
            limit: parseInt(req.query.limit),
            skip: parseInt(req.query.skip),
            sort
        }
    }).execPopulate();
    res.send({ tasks: req.user.tasks});
});

router.get('/tasks/:id', auth, async (req, res) => {
    const task = await crud.getTask(req.params.id, req.user._id);
    if (!task) {
        res.status(404).send('Not found');
    }
    res.send(task);
});

router.post('/task', auth, async (req, res) => {
   const task = {
       ...req.body,
       owner: req.user._id
   };
   const result = await crud.createTask(task);
   res.send(result);
})

router.patch('/task/:id', async (req, res) => {
    const result = await crud.updateTask(req.params.id, req.body);
    res.send(result);
});

router.delete('/task/:id', async (req, res) => {
    const task = await crud.deleteTask(req.params.id);
    if (!task) {
        res.status(404).send('Not found');
    }
    res.send(task);
   
});

module.exports = router;