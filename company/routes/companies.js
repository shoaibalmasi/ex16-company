const express = require('express');
const router = express.Router();
const Company = require('../models/company');
const Employee = require('../models/employee');
const jalali=require("jalali-moment");
let filterResult;
let filterMode=false;

//add new company
router.post('/addCompany', (req, res) => {
    if (!req.body.companyName || !req.body.registrationNumber || !req.body.registrationDate ||
        !req.body.phoneNumber || !req.body.cityName || !req.body.provinceName) {
        return res.status(400).send('Empty field!');
    }

    Company.findOne({
        $or: [{
            companyName: req.body.companyName
        }, {
            registrationNumber: req.body.registrationNumber
        }]
    }, (err, company) => {
        if (err) return res.status(500).send('Something went wrong!');
        if (company) return res.status(406).send('Company name already exist!');

        const NEW_COMPANY = new Company({
            companyName: req.body.companyName,
            registrationNumber: req.body.registrationNumber,
            registrationDate:jalali.from(req.body.registrationDate, 'fa', 'YYYY/MM/DD').format('YYYY-MM-DD'),
            phoneNumber: req.body.phoneNumber,
            cityName: req.body.cityName,
            provinceName: req.body.provinceName,
        })

        NEW_COMPANY.save(function (err, newCompany) {
            if (err) return res.status(500).send("Something went wrong");
            return res.send("company added successfully");
        })

    })

});

//get all companies
router.get("/allCompanies", (req, res) => {

    Company.find({}, (err, companies) => {
        if (err) return res.status(500).send("Something went wrong in get all companies! \n" + err);
        if(filterMode===true){
            filterMode=false;
            return res.render("pages/companies", {
                companies:filterResult,
                jalali:jalali
            })
            
        }
        return res.render("pages/companies", {
            companies:companies,
            jalali:jalali
        })

    })
});

//update companies
router.put("/updateCompany/:companyId", (req, res) => {
    if (!req.body.companyName || !req.body.registrationNumber || !req.body.registrationDate ||
        !req.body.phoneNumber || !req.body.cityName || !req.body.provinceName) {
        return res.status(400).send('Empty field!');
    }
    Company.findOne({_id:req.params.companyId}, (err, company) => {
        if (err) return res.status(500).send('Something went wrong!');
        let chandedUnique;
        if(company.companyName!==req.body.companyName ){
            chandedUnique=[{companyName: req.body.companyName}]
        }
        if(company.registrationNumber !== req.body.registrationNumber){
            if(chandedUnique===undefined){
                chandedUnique=[{ registrationNumber: req.body.registrationNumber}]
            }else{
                
                chandedUnique=[{companyName: req.body.companyName}, {registrationNumber: req.body.registrationNumber}]
            }  
        }
        console.log(chandedUnique);
        req.body.registrationDate=jalali.from(req.body.registrationDate, 'fa', 'YYYY/MM/DD').format('YYYY-MM-DD');
        if(chandedUnique!==undefined){
            Company.findOne({$or: chandedUnique},(err2,comp)=>{
                if (err2) return res.status(500).send('Something went wrong!'+ err2);
                if (comp) return res.send('exist');

                Company.findByIdAndUpdate(req.params.companyId, req.body,  {new: true}, (err, company) => {
                 if (err) return res.status(500).send("Something went wrong in update company! \n" + err);
                 return res.send("apdated")
        });
           })
        }else{
            Company.findByIdAndUpdate(req.params.companyId, req.body,  {new: true}, (err, company) => {
                if (err) return res.status(500).send("Something went wrong in update company! \n" + err);
                return res.send("apdated")
       });
        }
 
    });
});

//delete companies
router.delete("/deleteCompany/:companyId", (req, res) => {
    Company.findByIdAndDelete(req.params.companyId, (err, company) => {

        if (err) return res.status(500).send("Something went wrong in delete company! \n" + err);
        if (!company) return res.status(404).send("Company not found");
        Employee.deleteMany({companyInfo: req.params.companyId},(err2,result)=>{
            if(err) return res.status(500).send("Something went wrong in delete company's employees! \n" + err)
            console.log(result);
            res.send("company deleted successfully")
            
        })
    })
});

// get for filtering by date
router.post('/filter', (req,res)=>{
  
    if(req.body.dateFrom === '' || req.body.dateTo === '') {
        return res.status(400).json({
            status:'failure',
            message: 'Please ensure you pick two dates'
             })
            }
   let startDate=jalali.from(req.body.dateFrom, 'fa', 'YYYY/MM/DD').format('YYYY-MM-DD');
   let endDate=jalali.from(req.body.dateTo, 'fa', 'YYYY/MM/DD').format('YYYY-MM-DD');
  
         Company.find(
         { registrationDate : { 
            $gte:new Date(startDate),
            $lt: new Date(endDate)
          }} ,
        
        (err,result)=>{
            console.log(result);
            if(err) return res.status(500).send("Something went wrong in filtering! \n" + err);;
            if (!result.length) return res.status(404).send("didn't find any company in date range")
            filterMode=true;
            filterResult=result;
            res.send("found")
      
        })
})



module.exports = router;