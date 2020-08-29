const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Task = require('./task');

const userSchema = mongoose.Schema({
    name: {
        type : String
    },
    password: {
        type: String,
        trim: true,
        required: true,
        minlength: 7,
        validate(value){
            
            if(validator.contains(value, 'password')){
                throw new Error('Password cannot contain the word password');

            }
        }
    },
    age : {
        type: Number
    },
    tokens: [
       {
           token : {
               type: String,
               required: true
           }
       }
    ],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
});

//By default virtual fields are not included in the output
userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });

userSchema.pre('save', async function(next){
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10);

    }
    next();
});

//Using middleware we delete all the tasks attached to a user when deleting a user
//Cascading delete
userSchema.pre('remove', async function(next){
    const user = this;
    console.log('Removing tasks first');
    await Task.deleteMany({owner: user._id});
    next();
})

userSchema.methods.generateAuthToken = async function(){
    const user = this;
    const token = jwt.sign({_id : user._id.toString()}, process.env.JWT_SECRET, {expiresIn: '7 days'});
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;
}

userSchema.methods.toJSON = function(){
    const user = this;
    const userObj = user.toObject();
    delete userObj.password;
    return userObj;
    
}

//This defines a relationship which will help to get tasks belong to a user
// A virtual field, so not stored in the db
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
});



userSchema.statics.findByCredentials = async (name, password) => {
    const user = await User.findOne({name});
    console.log('user', user);
    if (!user) {
        throw new Error('Unable to login');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
        return user;
    }else {
        throw new Error('Unable to login'); 
    }
}



const User = mongoose.model('User', userSchema);

module.exports = User;

