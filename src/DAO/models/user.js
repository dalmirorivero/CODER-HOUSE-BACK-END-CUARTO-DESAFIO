import { model,Schema } from 'mongoose';

const collection = 'users'

const schema = new Schema({
    name: {type: String, required: true },
    photo: {
        type: String, 
        default: 
        "https://cdn-icons-png.flaticon.com/512/17/17004.png" 
    },
    mail: {type: String, unique: true, index: true, required: true },
    age: {type: Number},
    role: {type: Number, default: 0 },
    password: {type: String, required: true }
});

const User = model(collection, schema);
export default User;
