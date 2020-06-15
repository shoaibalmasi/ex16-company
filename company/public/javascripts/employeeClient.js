// call date picker
$(function() {
    $("#birthday").persianDatepicker(); 
       
});

// Ajax req to add new employee
function addEmployee(companyId){
    if($('#first-name').val()==="" || $('#last-name').val()==="" || $('#national-code').val()==="" ||
     $('#birthday').val()==="" ){
        alert("please fill all fields")
    }else{

    let employeeInfo={
       firstName:$('#first-name').val(),
       lastName:$('#last-name').val(),
       nationalCode:$('#national-code').val(),
       gender:$('#gender').val(),
       isManager:$('#isManager').val(),
       birthdayDate:$('#birthday').val(),
       companyInfo: companyId
    }
    $.ajax({
        type: "Post",
        url: "/employees/addEmployee",
        data: employeeInfo,
        // dataType: "text",
        success: function (res) {
          
             document.location=`/employees/${companyId}`;
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

//func for delete employee
function deleteEmployee(id,companyId){
    if(confirm('Are you sure?')){
        $.ajax({
            type: "DELETE",
            url: `/employees/${id}`,
            success: function (response) {
                  document.location=`/employees/${companyId}`;
            },
            error: function(err){
                document.location='/error'
            }
        });
    }
    }

    //func for edit company
let lastrow;
function editEmployee(id,compId,row){
    lastrow=$(`#${row}`).html();
    let lastInfo={
        rowNum:$(`#${row}-row`).html(),
        firstName:$(`#${row}-firstName`).html(),
        lastName:$(`#${row}-lastName`).html(),
        nationalCode:$(`#${row}-national`).html(),
        gender:$(`#${row}-gender`).html(),
        isManager:$(`#${row}-isManager`).html(),
        birthdayDate:$(`#${row}-birthday`).html(),

    }
    console.log(lastInfo.isManager);
    
    $(`#${row}`).html(`
    <td>${lastInfo.rowNum}</td>
    <td><input type="text" id="new-first-name" value="${lastInfo.firstName}" class="form-control col-10"></td>
    <td><input type="text" id="new-last-number" value="${lastInfo.lastName}" class="form-control col-10"></td>
    <td><input type="text" id="new-national" value="${lastInfo.nationalCode}" class="form-control col-10"></td>
    <td><select id="new-gender" class="form-control">
        ${lastInfo.gender==='male'? 
          '<option value="female">زن</option> <option value="male" selected>مرد</option>':' <option value="female" selected>زن</option><option value="male" >مرد</option>'
            }
        </select></td>
        <td><select id="new-post" class="form-control col-10">
        ${lastInfo.isManager==='Manager'? 
          '<option value="false">کارمند</option> <option value="true" selected>مدیر</option>':' <option value="false" selected>کارمند</option><option value="true" >مدیر</option>'
            }
        </select></td>
    <td><input type="text" id="new-birth" value="${lastInfo.birthdayDate}" class="form-control col-10"></td>
    <td>
    <button type="button" class="btn btn-success col-12 btn-edit" onclick="saveEdit('${id}','${compId}')" >Save</button>
    <button type="button" class="btn btn-warning col-12 btn-edit" onclick="cancleEdit('${row}')" >Cancle</button>
    </td>
    `)
    $(function() {
        $("#new-birth").persianDatepicker();     
    });
}

//func for cancle edit
function cancleEdit(row){
   $(`#${row}`).html(lastrow);
}

//func for save edit
function saveEdit(id,companyId){

    if($('#new-first-name').val()==="" || $('#new-last-number').val()==="" || $('#new-national').val()==="" ||
    $('#new-gender').val()==="" || $('#new-post').val()==="" || $('#new-birth').val()==="" ){
        alert("please fill all fields")
    }else{
        
    let newInfo={
        firstName:$('#new-first-name').val(),
        lastName:$('#new-last-number').val(),
        nationalCode:$('#new-national').val(),
        gender:$('#new-gender').val(),
        isManager:$('#new-post').val(),
        birthdayDate:$('#new-birth').val()
    }
    $.ajax({
        type: "PUT",
        url: `/employees/${id}`,
        data: newInfo,
        dataType: "text",
        success: function (response) {
            if(response==='exist'){
                alert('national code is already exist!')
            }else{
                document.location=`/employees/${companyId}`;
            }  
        },
        // error: function(err){
        //     document.location='/error'
        // }
    });
    }
}