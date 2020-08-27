const express = require('express');
const router = express.Router();
const crud = require('../db/mongoose');
const User = require('../models/User');
const auth = require('../middleware/auth');


router.get('/users/me', auth, async (req, res) => {
    const user = req.user;
    await user.populate('tasks').execPopulate();
    if (!user) {
        res.status(404).send('Not found');
    }
    res.send({user});
});

router.get('/user/:id', async (req, res) => {
    // const user = await crud.getUser(req.params.id);
    // await user.populate('Task').execPopulate();
    // console.log(user)
    // if (!user) {
    //     res.status(404).send('Not found');
    // }
    // res.send({user});

    const user = await User.findById('5f478dbaf1b8c81148210e9b');
    await user.populate('tasks').execPopulate();
    res.send({user});
   
});

router.post('/user', async (req, res) => {
    const user = await crud.createUser(req.body);
    const token = await user.generateAuthToken();
    res.send({user, token});
});

router.patch('/user/:id', async (req, res) => {
    const result = await crud.updateUser(req.params.id, req.body);
    res.send(result);
});

router.delete('/user/:id', async (req, res) => {
    const user = await crud.deleteUser(req.params.id);
    if (!user) {
        res.status(404).send('Not found');
    }
    res.send(user);
   
});


router.post('/user/login', async (req, res) => {
    const user = await User.findByCredentials(req.body.name, req.body.password);
    const token = await user.generateAuthToken();
    res.send({user, token});
});

router.post('/user/logout', auth, async (req, res) => {
    try{
        const {user, token} = req;
        user.tokens = user.tokens.filter(tk => {
            return tk.token !== token
        });
        await user.save();
        res.status(200).send();
    }catch(error) {
        res.status(500).send({error})
    }

});

router.post('/user/logout/all', auth, async (req, res) => {
    try{
        const {user} = req;
        user.tokens = [];
        await user.save();
        res.status(200).send();
    }catch(error) {
        res.status(500).send({error})
    }

});


module.exports = router;