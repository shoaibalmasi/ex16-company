// call date picker
$(function() {
    $("#reg-date").persianDatepicker();     
});


// Ajax req to add new company
function addCompany(){
    if($('#company-name').val()==="" || $('#reg-number').val()==="" || $('#reg-date').val()==="" ||
    $('#phone-number').val()==="" || $('#city').val()==="" || $('#province').val()==="" ){
        alert("please fill all fields")
    }else{

    let companyInfo={
        companyName:$('#company-name').val(),
        registrationNumber:$('#reg-number').val(),
        registrationDate:$('#reg-date').val(),
        phoneNumber:$('#phone-number').val(),
        cityName:$('#city').val(),
        provinceName:$('#province').val(),
    }
    $.ajax({
        type: "Post",
        url: "/companies/addCompany",
        data: companyInfo,
        // dataType: "text",
        success: function (res) {
          
             document.location='/companies/allCompanies';
        },
        error: function(err){
            document.location='/error'
        }
    });
}
}


// func for cancle 
function cancleFunc(){
$('input').val('');   
}

//func for delete company
function deleteCompany(id){

if(confirm('Are you sure?')){
    $.ajax({
        type: "DELETE",
        url: `/companies/deleteCompany/${id}`,
        success: function (response) {
             document.location='/companies/allCompanies';
        },
        error: function(err){
            document.location='/error'
        }
    });
}
}

//func for edit company
let lastrow;
function editCompany(id,row){
    lastrow=$(`#${row}`).html();
    let lastInfo={
        rowNum:$(`#${row}-row`).html(),
        companyName:$(`#${row}-name`).html(),
        registrationNumber:$(`#${row}-regNum`).html(),
        registrationDate:$(`#${row}-regDate`).html(),
        phoneNumber:$(`#${row}-phone`).html(),
        cityName:$(`#${row}-city`).html(),
        provinceName:$(`#${row}-province`).html(),

    }
    $(`#${row}`).html(`
    <td>${lastInfo.rowNum}</td>
    <td><input type="text" id="company-new-name" value="${lastInfo.companyName}" class="form-control col-10"></td>
    <td><input type="text" id="reg-new-number" value="${lastInfo.registrationNumber}" class="form-control col-10"></td>
    <td><input type="text" id="reg-new-date" value="${lastInfo.registrationDate}" class="form-control col-10"></td>
    <td><input type="text" id="new-phone-number" value="${lastInfo.phoneNumber}" class="form-control col-10"></td>
    <td><input type="text" id="new-city" value="${lastInfo.cityName}" class="form-control col-10"></td>
    <td><input type="text" id="new-province" value="${lastInfo.provinceName}" class="form-control col-10"></td>
    <td>
    <button type="button" class="btn btn-success col-12 btn-edit" onclick="saveEdit('${id}')" >Save</button>
    <button type="button" class="btn btn-warning col-12 btn-edit" onclick="cancleEdit('${row}')" >Cancle</button>
    </td>
    `)
    $(function() {
        $("#reg-new-date").persianDatepicker(); 
           
    });
}

//func for cancle edit
function cancleEdit(row){
   $(`#${row}`).html(lastrow);
}

//func for save edit
function saveEdit(id){

    if($('#company-new-name').val()==="" || $('#reg-new-number').val()==="" || $('#reg-new-date').val()==="" ||
    $('#new-phone-number').val()==="" || $('#new-city').val()==="" || $('#new-province').val()==="" ){
        alert("please fill all fields")
    }else{
        
    let newInfo={
        companyName:$('#company-new-name').val(),
        registrationNumber:$('#reg-new-number').val(),
        registrationDate:$('#reg-new-date').val(),
        phoneNumber:$('#new-phone-number').val(),
        cityName:$('#new-city').val(),
        provinceName:$('#new-province').val(),
    }
    $.ajax({
        type: "PUT",
        url: `/companies/updateCompany/${id}`,
        data: newInfo,
        dataType: "text",
        success: function (response) {
            if(response==='exist'){
                alert('company name or registering number is already exist!')
            }else{
                  document.location='/companies/allCompanies';
            }  
        },
        error: function(err){
            document.location='/error'
        }
    });
    }
}

//function for get company's employees
function companyPage(id){
    $.ajax({
        type: "GET",
        url: `/employees/${id}`,
        success: function (response) {
            console.log(response);
            
         document.location=`/employees/${id}`;
        } ,
        error: function (err){
            document.location='/error' 
        }
    });
}