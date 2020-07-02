const Employee = require('../models/employee');
function randomDate(date1, date2){
    function randomValueBetween(min, max) {
      return Math.random() * (max - min) + min;
    }
    var date1 = date1 || '01-01-1970'
    var date2 = date2 || new Date().toLocaleDateString()
    date1 = new Date(date1).getTime()
    date2 = new Date(date2).getTime()
    if( date1>date2){
        return new Date(randomValueBetween(date2,date1)).toLocaleDateString()   
    } else{
        return new Date(randomValueBetween(date1, date2)).toLocaleDateString()  

    }
}
let companyIdArray=['5efd853881476031b409000e','5efd856881476031b409000f','5efd85ac81476031b4090010',
'5efd861b81476031b4090011','5efd866a81476031b4090012']
let j=0;


function maker(){
    console.log('enter');
    
    for(i=0;i<60;i++){
let gender;
if(i%2===0){
    gender="male"
}else{
    gender="female"
}
if(j>4){j=0}

        const NEW_EMPLOYEE = new Employee({
            firstName: Math.random().toString(36).substring(7),
            lastName: Math.random().toString(36).substring(7),
            nationalCode: Math.floor(Math.random()*100000),
            gender: gender,
            isManager: false,
            birthdayDate: randomDate('02/13/2000', '01/01/1980'),
            companyInfo: companyIdArray[j]
    
        })
        j++;
        // console.log(NEW_EMPLOYEE);
        NEW_EMPLOYEE.save(function (err, newEmployee) {
            if (err) return console.log(err);
            
            return console.log(newEmployee);
            
        })
    }
}


module.exports=maker;