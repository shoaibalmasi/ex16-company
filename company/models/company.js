const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const companySchema = new Schema({
    companyName: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    registrationNumber: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    registrationDate: {
        type: Date,
        required: true
    },
    phoneNumber:{
        type: String,
        trim: true
    },
    cityName: {
        type: String,
        trim: true
    },
    provinceName:{
        type: String,
        trim: true
    }
});


module.exports = mongoose.model('Company', companySchema);

