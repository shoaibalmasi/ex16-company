const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    nationalCode:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['male','female']
    },
    isManager:{
        type: Boolean,
        required: true
    },
    birthdayDate:{
        type: Date,
        required:true
    },
    companyInfo:{
        type: Schema.Types.ObjectId,
        ref: "Company",
        required: true
    }
});


module.exports = mongoose.model('Employee', EmployeeSchema);