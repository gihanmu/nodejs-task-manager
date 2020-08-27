const express = require('express');
const router = express.Router();
const crud = require('../db/mongoose');
const auth = require('../middleware/auth');


router.get('/tasks', async (req, res) => {
    const tasks = await crud.getTasks();
    res.send(tasks);
});

router.get('/task/:id', auth, async (req, res) => {
    const task = await crud.getTask(req.params.id);
    await task.populate('owner').execPopulate();
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