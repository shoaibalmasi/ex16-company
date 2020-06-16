// call date picker
$(function () {
    $("#reg-date").persianDatepicker();
    $("#from-date").persianDatepicker();
    $("#to-date").persianDatepicker();
});


// Ajax req to add new company
function addCompany() {

    //check empty fields
    if ($('#company-name').val() === "" || $('#reg-number').val() === "" || $('#reg-date').val() === "" ||
        $('#phone-number').val() === "" || $('#city').val() === "" || $('#province').val() === "") {
        alert("please fill all fields")
    } else {
        //  Making new company object
        let companyInfo = {
            companyName: $('#company-name').val(),
            registrationNumber: $('#reg-number').val(),
            registrationDate: $('#reg-date').val(),
            phoneNumber: $('#phone-number').val(),
            cityName: $('#city').val(),
            provinceName: $('#province').val(),
        }
        $.ajax({
            type: "Post",
            url: "/companies/addCompany",
            data: companyInfo,
            success: function (res) {
                if (res === 'exist') {
                    alert('نام شرکت یا شماره ثبت تکراری است')
                } else {
                    alert("با موفقیت اضافه شد")
                    document.location = '/companies/allCompanies';
                }
            },
            error: function (err) {
                document.location = '/error'
            }
        });
    }
}


// func for cancle 
function cancleFunc() {
    $('.modal-body input').val('');
}

//func for delete company
function deleteCompany(id) {

    if (confirm('میخواهید حذف کنید؟')) {
        $.ajax({
            type: "DELETE",
            url: `/companies/deleteCompany/${id}`,
            success: function (res) {
                if (res === "company deleted successfully") {
                    alert("با موفقیت حذف شد")
                    document.location = '/companies/allCompanies';
                }
            },
            error: function (err) {
                document.location = '/error'
            }
        });
    }
}

//func for edit company
let lastrow;

function editCompany(id, row) {

    //save last row html to use in cancle btn
    lastrow = $(`#${row}`).html();
    // save last row info as a object
    let lastInfo = {
        rowNum: $(`#${row}-row`).html(),
        companyName: $(`#${row}-name`).html(),
        registrationNumber: $(`#${row}-regNum`).html(),
        registrationDate: $(`#${row}-regDate`).html(),
        phoneNumber: $(`#${row}-phone`).html(),
        cityName: $(`#${row}-city`).html(),
        provinceName: $(`#${row}-province`).html(),

    }

    // change chosen row's html to inputs
    $(`#${row}`).html(`
    <td>${lastInfo.rowNum}</td>
    <td><input type="text" id="company-new-name" value="${lastInfo.companyName}" class="form-control"></td>
    <td><input type="text" id="reg-new-number" value="${lastInfo.registrationNumber}" class="form-control"></td>
    <td><input type="text" id="reg-new-date" value="${lastInfo.registrationDate}" class="form-control"></td>
    <td><input type="text" id="new-phone-number" value="${lastInfo.phoneNumber}" class="form-control"></td>
    <td><input type="text" id="new-city" value="${lastInfo.cityName}" class="form-control"></td>
    <td><input type="text" id="new-province" value="${lastInfo.provinceName}" class="form-control"></td>
    <td>
    <button type="button" class="btn btn-success btn-edit" onclick="saveEdit('${id}')" >ذخیره</button>
    <button type="button" class="btn btn-warning btn-edit" onclick="cancleEdit('${row}')" >انصراف</button>
    </td>
    `)
    // func for call datepicker
    $(function () {
        $("#reg-new-date").persianDatepicker();

    });
}

//func for save edit
function saveEdit(id) {

    //check empty fields
    if ($('#company-new-name').val() === "" || $('#reg-new-number').val() === "" || $('#reg-new-date').val() === "" ||
        $('#new-phone-number').val() === "" || $('#new-city').val() === "" || $('#new-province').val() === "") {
        alert("please fill all fields")
    } else {
        //  Making new company object
        let newInfo = {
            companyName: $('#company-new-name').val(),
            registrationNumber: $('#reg-new-number').val(),
            registrationDate: $('#reg-new-date').val(),
            phoneNumber: $('#new-phone-number').val(),
            cityName: $('#new-city').val(),
            provinceName: $('#new-province').val(),
        }
        $.ajax({
            type: "PUT",
            url: `/companies/updateCompany/${id}`,
            data: newInfo,
            dataType: "text",
            success: function (res) {
                if (res === 'exist') {
                    alert('نام شرکت یا شماره ثبت تکراری است')
                } else {
                    document.location = '/companies/allCompanies';
                }
            },
            error: function (err) {
                document.location = '/error'
            }
        });
    }
}

//func for cancle edit
function cancleEdit(row) {
    $(`#${row}`).html(lastrow);
}

//function for get company's employees
function companyPage(id) {
    $.ajax({
        type: "GET",
        url: `/employees/${id}`,
        success: function (response) {
            console.log(response);

            document.location = `/employees/${id}`;
        },
        error: function (err) {
            document.location = '/error'
        }
    });
}

//func for filtering companies by registeration date
function dateFilter() {
    //check empty fields
    if ($('#from-date').val() === "" || $('#to-date').val() === "") {
        alert("هر دو فیلد تاریخ را پر کنید")
    } else {

        $.ajax({
            type: "POST",
            url: "/companies/filter",
            data: {
                dateFrom: $('#from-date').val(),
                dateTo: $('#to-date').val()
            },
            success: function (res) {
                if (res === "notFound") {
                    alert("در این بازه شرکتی وجود ندارد")
                } else {
                    document.location = '/companies/allCompanies';
                }
            },
            error: function (err) {
                document.location = '/error'
            }
        });
    }
}