$("#form").submit(function(e) {
    e.preventDefault();
});

$("#management-form").submit(function(e) {
    e.preventDefault();
});

function GetGrade(score) {
    if (score <= 49) {
        return "0";
    } else if (score >= 50 && score <= 54) {
        return "1";
    } else if (score >= 55 && score <= 59) {
        return "1.5";
    } else if (score >= 60 && score <= 64) {
        return "2";
    } else if (score >= 65 && score <= 69) {
        return "2.5";
    } else if (score >= 70 && score <= 74) {
        return "3";
    } else if (score >= 75 && score <= 79) {
        return "3.5";
    } else if (score >= 80) {
        return "4";
    }
}

let subjectCount = 0; // จำนวนวิชาทั้งหมด

let totalGrade = 0; // เกรดเฉลี่ยทั้งหมด
let totalCredit = 0; // หน่วยกิตทั้งหมด

let creditList = new Array(); // ตารางหน่วยกิต
let gradeList = new Array(); // ตารางเกรด

async function AppendSubject() {
    ++subjectCount;
    var table = document.getElementById("subject-table");
    table.style.display="block";
    var row = table.insertRow(-1);
    row.setAttribute("id", "subject-row-" + subjectCount);

    var subjectIndex = row.insertCell(0);
    var subjectName = row.insertCell(1);
    var subjectScore = row.insertCell(2);
    var subjectCredit = row.insertCell(3);
    var subjectGrade = row.insertCell(4);
    subjectIndex.setAttribute("id", "subject-index-" + subjectCount);
    subjectIndex.className += "index";
    subjectIndex = subjectIndex.innerHTML = subjectCount;
    subjectName = subjectName.innerHTML = document.getElementById("subject").value;
    subjectScore = subjectScore.innerHTML = document.getElementById("score").value;
    subjectCredit = subjectCredit.innerHTML = document.getElementById("credit").value;
    subjectGrade = subjectGrade.innerHTML = GetGrade(document.getElementById("score").value);

    creditList.push(subjectCredit);
    gradeList.push(subjectGrade);

    // no Σ
    MakeCalculate();
}

async function RemoveSubject() {
    let targetIndex = document.getElementById("index").value; // target index
    var row = document.getElementById("subject-row-" + targetIndex); // get target subject row's
    if (row == null) {
        Swal.fire({
            title: 'เกิดข้อผิดพลาด',
            text: 'ไม่พบลำดับวิชาดังกล่าว',
            icon: 'error',
            showCloseButton: true,
            confirmButtonText: 'Ok'
        })
        return;
    }
    creditList = removeItemOnce(creditList, creditList[targetIndex - 1]); 
    gradeList = removeItemOnce(gradeList, gradeList[targetIndex - 1]);
    row.parentNode.removeChild(row); // remove row
    subjectCount--; // subtract subject amount
    SortSubjectByIndex();
    MakeCalculate();
}

function Export() {
    Swal.fire({
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถบันทึกข้อมูลได้',
        icon: 'warning',
        showCloseButton: true,
        confirmButtonText: 'Ok'
    })
}


function UpdateSummary() {
    $('#total-subject').text(subjectCount);
    if (subjectCount == 0) {
        $('#total-grade').text(totalGrade);
        $('#total-credit').text(totalCredit);
        $('#subject-table').css("display", "none");
        $('#avg').text('-');
        return;
    }
    //$('#avg').css("color", "rgb(166, 243, 255)");
    $('#total-grade').text(totalGrade.toFixed(1));
    $('#total-credit').text(totalCredit.toFixed(1));
    let avgGrade = parseFloat(totalGrade) / parseFloat(totalCredit);
    $('#avg').text(avgGrade.toFixed(2));
    return false;
}

function SortSubjectByIndex() {
    let row = $('#subject-table tr');
    // i = 1 (cuz skip header table row)
    for (var i = 1; i < row.length; i++) {
        row[i].setAttribute("id", "subject-row-" + i);
    };

    let newIndex = 1;
    $('#subject-table tr .index').each(function(){
        $(this).attr('id', 'subject-index-' + newIndex);
        $(this).text(newIndex++);
    });
}

function Clear() {
    if (subjectCount == 0) {
        Swal.fire({
            text: 'ข้อมูลว่างเปล่าอยู่แล้ว',
            icon: 'info',
            showCloseButton: true,
            confirmButtonText: 'Ok'
        })
        return;
    }
    gradeList = []; creditList = []; subjectCount = 0;
    var table = document.getElementById("subject-table");
    table.style.display="none";
    $("#subject-table td").remove();
    MakeCalculate();
    UpdateSummary();
}

async function MakeCalculate() {
    totalGrade = 0 // Reset
    totalCredit = 0 // Reset
    // Re-calculate by each
    gradeList.forEach(function(item, i) {
        console.warn(gradeList[i] * creditList[i])
        totalGrade += gradeList[i] * creditList[i]; // เกรด * หน่วยกิต
        totalCredit = parseFloat(totalCredit) + parseFloat(creditList[i]);
    });
    console.log("creditList size " + creditList.length);
    console.log("subjectList size " + gradeList.length);
    console.log("------------");
    console.log("creditList " + creditList);
    console.log("subjectList " + gradeList);
    console.log("------------");
    console.log("totalGrade " + totalGrade);
    console.log("totalCredit " + totalCredit);
    console.log("\n");
}

function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}