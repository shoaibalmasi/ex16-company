const express = require('express');
const router = express.Router();
const Company = require('../models/company');
const Employee = require('../models/employee');
const jalali = require("jalali-moment");
let filterResult;
let filterMode = false;

//add new company
router.post('/addCompany', (req, res) => {
    //check empty field
    if (!req.body.companyName || !req.body.registrationNumber || !req.body.registrationDate ||
        !req.body.phoneNumber || !req.body.cityName || !req.body.provinceName) {
        return res.status(400).send('Empty field!');
    }

    //Check the company name and registeration number  duplication
    Company.findOne({
        $or: [{
            companyName: req.body.companyName
        }, {
            registrationNumber: req.body.registrationNumber
        }]
    }, (err, company) => {
        if (err) return res.status(500).send('Something went wrong!');
        if (company) return res.send('exist');

        // Making new company object
        const NEW_COMPANY = new Company({
            companyName: req.body.companyName,
            registrationNumber: req.body.registrationNumber,
            registrationDate: jalali.from(req.body.registrationDate, 'fa', 'YYYY/MM/DD').format('YYYY-MM-DD'),
            phoneNumber: req.body.phoneNumber,
            cityName: req.body.cityName,
            provinceName: req.body.provinceName,
        })

        //saving new company
        NEW_COMPANY.save(function (err, newCompany) {
            if (err) return res.status(500).send("Something went wrong in company saveing");
            return res.send("successfully");
        })

    })

});

//get all companies
router.get("/allCompanies", (req, res) => {
    //finding companies
    Company.find({}, (err, companies) => {
        if (err) return res.status(500).send("Something went wrong in get all companies! \n" + err);
        // check filter mode
        if (filterMode === true) {
            filterMode = false;
            return res.render("pages/companies", {
                companies: filterResult,
                jalali: jalali
            })
        }
        return res.render("pages/companies", {
            companies: companies,
            jalali: jalali
        })
    })
});

//update companies
router.put("/updateCompany/:companyId", (req, res) => {

    // cheking empty fields
    if (!req.body.companyName || !req.body.registrationNumber || !req.body.registrationDate ||
        !req.body.phoneNumber || !req.body.cityName || !req.body.provinceName) {
        return res.status(400).send('Empty field!');
    }

    // CHECK: Has the companyName and registrationNumber changed or not?
    Company.findOne({
        _id: req.params.companyId
    }, (err, company) => {
        if (err) return res.status(500).send('Something went wrong!');
        let changedUnique;
        if (company.companyName !== req.body.companyName) {
            changedUnique = [{
                companyName: req.body.companyName
            }]
        }
        if (company.registrationNumber !== req.body.registrationNumber) {
            if (changedUnique === undefined) {
                changedUnique = [{
                    registrationNumber: req.body.registrationNumber
                }]
            } else {

                changedUnique = [{
                    companyName: req.body.companyName
                }, {
                    registrationNumber: req.body.registrationNumber
                }]
            }
        }
        console.log(changedUnique);
        //convert registrationDate to Georgian date
        req.body.registrationDate = jalali.from(req.body.registrationDate, 'fa', 'YYYY/MM/DD').format('YYYY-MM-DD');

        //Check the company name and registeration number  duplication  ***IF they have changed***
        if (changedUnique !== undefined) {
            //check duplication 
            Company.findOne({
                $or: changedUnique
            }, (err2, comp) => {
                if (err2) return res.status(500).send('Something went wrong!' + err2);
                if (comp) return res.send('exist');
                //update company
                Company.findByIdAndUpdate(req.params.companyId, req.body, {
                    new: true
                }, (err, company) => {
                    if (err) return res.status(500).send("Something went wrong in update company! \n" + err);
                    return res.send("apdated")
                });
            })
        } else {
            //update company
            Company.findByIdAndUpdate(req.params.companyId, req.body, {
                new: true
            }, (err, company) => {
                if (err) return res.status(500).send("Something went wrong in update company! \n" + err);
                return res.send("apdated")
            });
        }

    });
});

//delete companies route
router.delete("/deleteCompany/:companyId", (req, res) => {
    //delete company
    Company.findByIdAndDelete(req.params.companyId, (err, company) => {

        if (err) return res.status(500).send("Something went wrong in delete company! \n" + err);
        if (!company) return res.status(404).send("Company not found");
        //delete companie's employees
        Employee.deleteMany({
            companyInfo: req.params.companyId
        }, (err2, result) => {
            if (err2) return res.status(500).send("Something went wrong in delete company's employees! \n" + err2)
            return res.send("company deleted successfully")

        })
    })
});

// get for filtering by date
router.post('/filter', (req, res) => {
    //check empty fields;
    if (req.body.dateFrom === '' || req.body.dateTo === '') {
        return res.status(400).json({
            status: 'failure',
            message: 'Please ensure you pick two dates'
        })
    }
    //convert dates to  Georgian date     
    let startDate = jalali.from(req.body.dateFrom, 'fa', 'YYYY/MM/DD').format('YYYY-MM-DD');
    let endDate = jalali.from(req.body.dateTo, 'fa', 'YYYY/MM/DD').format('YYYY-MM-DD');

    // find companies that are between two dates
    Company.find({
            registrationDate: {
                $gt: new Date(startDate),
                $lt: new Date(endDate)
            }
        },

        (err, result) => {
            if (err) return res.status(500).send("Something went wrong in filtering! \n" + err);;
            if (!result.length) return res.send("notFound")
            filterMode = true;
            filterResult = result;
            return res.send("found")

        })
})

module.exports = router;