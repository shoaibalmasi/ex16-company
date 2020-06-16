const express = require('express');
const router = express.Router();
const Employee = require('../models/employee');
const Company = require('../models/company');
const jalali = require("jalali-moment");

// add new employee
router.post('/addEmployee', (req, res) => {
    //check empty fields
    if (!req.body.firstName || !req.body.lastName || !req.body.nationalCode ||
        !req.body.gender || !req.body.birthdayDate || !req.body.companyInfo || req.body.isManager === undefined) {
        return res.status(400).send('Empty field!');
    }
    //Check the nationalCode  duplication
    Employee.findOne({
        nationalCode: req.body.nationalCode
    }, (err, existEmployee) => {
        if (err) return res.status(500).send('something went wrong');
        if (existEmployee) return res.status(406).send("employee's national code is already exist")

        // Making new employee object
        const NEW_EMPLOYEE = new Employee({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            nationalCode: req.body.nationalCode,
            gender: req.body.gender,
            isManager: req.body.isManager,
            birthdayDate: jalali.from(req.body.birthdayDate, 'fa', 'YYYY/MM/DD').format('YYYY-MM-DD'),
            companyInfo: req.body.companyInfo
        })

        //save employee
        NEW_EMPLOYEE.save(function (err, newEmployee) {
            if (err) return res.status(500).send("Something went wrong \n" + err);
            return res.send('successfull')
        })
    })
})

// get all employees
router.get("/:companyId", (req, res) => {
    // check companyId is exist or not
    Company.findOne({
        _id: req.params.companyId
    }, (err, company) => {
        if (err) return res.status(500).send("Something went wrong \n" + err);
        if (!company) return res.status(406).send("company id is'nt exist")
        //find the employees
        Employee.find({
            companyInfo: req.params.companyId
        }).populate('companyInfo').exec((err2, employees) => {
            if (err2) return res.status(500).send("Something went wrong in get all employees! \n" + err2);
            return res.render("pages/employees", {
                employees: employees,
                companyId: req.params.companyId,
                jalali: jalali
            })
        })
    })
});

// update employee
router.put("/:employeeId", (req, res) => {
    //check empty fields
    if (!req.body.firstName || !req.body.lastName || !req.body.nationalCode ||
        !req.body.gender || !req.body.birthdayDate || req.body.isManager === undefined) {
        return res.status(400).send('Empty field!');
    }
    //find laast info
    Employee.findOne({
        _id: req.params.employeeId
    }, (err, lastEmployee) => {
        if (err) return res.status(500).send("Something went wrong in update employee! \n" + err);

        //convert birthday date to Georgian date
        req.body.birthdayDate = jalali.from(req.body.birthdayDate, 'fa', 'YYYY/MM/DD').format('YYYY-MM-DD');

        // check nationalCode duplication and update
        if (lastEmployee.nationalCode == req.body.nationalCode) {
            Employee.findByIdAndUpdate(req.params.employeeId, req.body, {
                new: true
            }, (err2, employee) => {
                if (err2) return res.status(500).send("Something went wrong in update employee!! \n" + err2);
                return res.send('updated');
            })
        } else {
            Employee.findOne({
                nationalCode: req.body.nationalCode
            }, (err3, emp) => {
                if (err3) return res.status(500).send("Something went wrong in update employee!!! \n" + err3);
                if (emp) return res.send('exist');
                Employee.findByIdAndUpdate(req.params.employeeId, req.body, {
                    new: true
                }, (err2, employee) => {
                    if (err2) return res.status(500).send("Something went wrong in update employee! \n" + err2);
                    return res.send('updated');
                })
            })
        }
    })
});

// delete employee
router.delete("/:employeeId", (req, res) => {

    Employee.findByIdAndDelete(req.params.employeeId, (err, employee) => {
        if (err) return res.status(500).send("Something went wrong in delete employee! \n" + err);
        if (!employee) return res.status(404).send("Employee not found");
        return res.send('deleted');
    })
});


module.exports = router;