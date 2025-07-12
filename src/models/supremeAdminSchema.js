const mongoose = require('mongoose');

const SupremeAdminSchema = new mongoose.Schema({
    supremeAdmin_id: {
        type: String,
        unique: true, // Ensures uniqueness in the database
        required: true, // Must be provided explicitly when creating an admin
    },
    name:{
        type: String,
        required: [true , "Name is required"]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    role: {
        type: String,
        enum: ['supremeadmin'], // Ensures only 'supremeadmin' role exists
        default: 'supremeadmin',
        immutable: true, // Prevents modification
    },
    status: {
        type: String,
        enum: ['active', 'inactive'], // Defines possible states
        default: 'active',
    },

}, { timestamps: true });

module.exports = mongoose.model('SupremeAdmin', SupremeAdminSchema);
