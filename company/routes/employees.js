const express = require('express');
const router = express.Router();
const Employee = require('../models/employee');


// add new employee
router.post('/addEmployee', (req, res) => {
    // if(!req.body.firstName || !req.body.lastName || !req.body.nationalCode
    //     || !req.body.gender || !req.body.isManager || !req.body.birthdayDate || !req.body.companyInfo){
    //         return res.status(400).send('Empty field!');
    //     }

    //     Employee.findOne({nationalCode: req.body.nationalCode}, (err,existEmployee)=>{
    //         if(err) return res.status(500).send('something went wrong');
    //         if(existEmployee) return res.status(406).send("employee's national code is already exist")
    //     })


    const NEW_EMPLOYEE = new Employee({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        nationalCode: req.body.nationalCode,
        gender: req.body.gender,
        isManager: req.body.isManager,
        birthdayDate: req.body.birthdayDate,
        companyInfo: req.body.companyInfo

    })
    NEW_EMPLOYEE.save(function (err, newEmployee) {
        if (err) return res.status(500).send("Something went wrong \n"+err);
        return res.json({
            newEmployee,
            message: "Employee added successfully"
        })
    })
})

// get all employees
router.get("/allEmployees", (req, res) => {

    Employee.find({}).populate('companyInfo').exec( (err, employees) => {
        if (err) return res.status(500).send("Something went wrong in get all employees! \n" + err);
        return res.json(employees)
    })
});

// update employee
router.put("/updateEmployee/:employeeId", (req, res) => {
    
    Employee.findByIdAndUpdate(req.params.employeeId, req.body, {new: true}, (err, employee) => {
        if (err) return res.status(500).send("Something went wrong in update employee! \n" + err);
        return res.json(employee)
    })
});

// delete employee
router.delete("/deleteEmployee/:employeeId", (req, res) => {
    
    Employee.findByIdAndDelete(req.params.employeeId, (err, employee) => {
        if (err) return res.status(500).send("Something went wrong in delete employee! \n" + err);
        if (!employee) return res.status(404).send("Employee not found");
        return res.json(employee)
    })
});


module.exports = router;