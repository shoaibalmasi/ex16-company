const express=require('express');
const router=express.Router();
const Company=require('../models/company')

//add new company
router.post('/addCompany',(req, res)=>{
    if(!req.body.companyName || !req.body.registrationNumber || !req.body.registrationDate
        || !req.body.phoneNumber || !req.body.cityName || !req.body.provinceName){
            return res.status(400).send('Empty field!');
        }
    
        // Company.findOne({$or: [{companyName: req.body.companyName.trim() },{registrationNumber:req.body.registrationNumber}]},
        //  (err, existCompany) => {
        //     if (err) return res.status(500).send('Something went wrong!');
        //     if (existCompany) return res.status(406).send('Company name or registration number already exist!');
        //    })


    const NEW_COMPANY= new Company({
        companyName:req.body.companyName,
        registrationNumber: req.body.registrationNumber,
        registrationDate:req.body.registrationDate,
        phoneNumber: req.body.phoneNumber,
        cityName: req.body.cityName,
        provinceName: req.body.provinceName,
    })

    NEW_COMPANY.save(function(err, newCompany) {        
        if (err) return res.status(500).send("Somthing went wrong");
        return res.json({
            newCompany,
            message: "company added successfully"
        })
    })
});

//get all companies
router.get("/allCompanies", (req, res) => {

    Company.find({}, (err, companies) => {
        if (err) return res.status(500).send("Something went wrong in get all companies! \n" + err);
        return res.json(companies)
    })
});

//update companies
router.put("/updateCompany/:companyId", (req, res) => {
    
    Company.findByIdAndUpdate(req.params.companyId, req.body, {new: true}, (err, company) => {
        if (err) return res.status(500).send("Something went wrong in update company! \n" + err);
        return res.json(company)
    })
});

//delete companies
router.delete("/deleteCompany/:companyId", (req, res) => {
    
    Company.findByIdAndDelete(req.params.companyId, (err, company) => {
        if (err) return res.status(500).send("Something went wrong in delete company! \n" + err);
        if (!company) return res.status(404).send("Company not found");
        return res.json(company)
    })
});


module.exports=router;