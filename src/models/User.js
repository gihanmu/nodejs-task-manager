const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
    ]
});

userSchema.pre('save', async function(next){
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10);

    }
    next();
})

userSchema.methods.generateAuthToken = async function(){
    const user = this;
    const token = jwt.sign({_id : user._id.toString()}, 'thisisahugesecretkey', {expiresIn: '7 days'});
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;
}

userSchema.methods.toJSON = function(){
    const {name, age} = this;
    return {
      name, age
    }
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