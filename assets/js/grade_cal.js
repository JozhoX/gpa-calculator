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

let totalGradeUnit = 0;

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

/* XLSX Export */
function ExportXLSX() {
    if (subjectCount == 0) {
        Swal.fire({
            title: 'เกิดข้อผิดพลาด',
            text: 'ยังไม่สามารถบันทึกได้หากยังไม่มีข้อมูล',
            icon: 'warning',
            showCloseButton: true,
            confirmButtonText: 'Ok'
        })
        return;
    }
    var wb = XLSX.utils.table_to_book(document.getElementById("subject-table"));
    XLSX.writeFile(wb, "output.xlsx");
}

/* CSV Export */
function ExportCSV() {
    if (subjectCount == 0) {
        Swal.fire({
            title: 'เกิดข้อผิดพลาด',
            text: 'ยังไม่สามารถบันทึกได้หากยังไม่มีข้อมูล',
            icon: 'warning',
            showCloseButton: true,
            confirmButtonText: 'Ok'
        })
        return;
    }
    download_table_as_csv('subject-table')
}

function download_table_as_csv(table_id, separator = ',') {
    // Select rows from table_id
    var rows = document.querySelectorAll('table#' + table_id + ' tr');
    // Construct csv
    var csv = [];
    for (var i = 0; i < rows.length; i++) {
        var row = [], cols = rows[i].querySelectorAll('td, th');
        for (var j = 0; j < cols.length; j++) {
            // Clean innertext to remove multiple spaces and jumpline (break csv)
            var data = cols[j].innerText.replace(/(\r\n|\n|\r)/gm, '').replace(/(\s\s)/gm, ' ')
            // Escape double-quote with double-double-quote (see https://stackoverflow.com/questions/17808511/properly-escape-a-double-quote-in-csv)
            data = data.replace(/"/g, '""');
            // Push escaped string
            row.push('"' + data + '"');
        }
        csv.push(row.join(separator));
    }
    var csv_string = csv.join('\n');
    // Download it
    var filename = 'export_' + table_id + '_' + new Date().toLocaleDateString() + '.csv';
    var link = document.createElement('a');
    link.style.display = 'none';
    link.setAttribute('target', '_blank');
    link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv_string));
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Update Everything & display
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
    $('#total-grade').text(totalGradeUnit.toFixed(1));
    $('#total-credit').text(totalCredit.toFixed(1));
    let avgGrade = parseFloat(totalGrade) / parseFloat(totalCredit);
    $('#avg').text(avgGrade.toFixed(2));
    return false;
}

// Resort subject index
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

// Remove everything & reset values
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
    totalGradeUnit = 0
    gradeList = []; creditList = []; subjectCount = 0;
    var table = document.getElementById("subject-table");
    table.style.display="none";
    $("#subject-table td").remove();
    MakeCalculate();
    UpdateSummary();
}

// Calculate GPA
async function MakeCalculate() {
    totalGrade = 0 // Reset
    totalCredit = 0 // Reset
    totalGradeUnit = 0
    // Re-calculate by each
    gradeList.forEach(function(item, i) {
        console.log("gradeList I " + gradeList[i])
        console.log("creditList  " + creditList[i])
        totalGradeUnit += Number(gradeList[i])
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

// Remove item from array. method
function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}

// Show GPA calculation formula with sweetalert
function ShowFormula() {
    Swal.fire({
        title: 'สูตรการคำนวณหาเกรดเฉลี่ย',
        text: 'นำเกรดที่ได้ของแต่ละวิชามาคูณกับหน่วยกิตของวิชานั้นๆ แล้วนำมาบวกกันให้หมด จากนั้นหารด้วยผลรวมของหน่วยกิตทั้งหมด เช่น (วิชาคณิตได้เกรด 3.0 x หน่วยกิตวิชาคณิต 2.0) + (วิชาภาษาไทยได้เกรด 3.5 x หน่วยกิตวิชาภาษาไทย 1.0) + (วิชาสังคมได้เกรด 4.0 x หน่วยกิตวิชาสังคม 1.5) รวมกันได้ (3 x 2) + (3.5 x 1) + (4 x 1.5)  =  6 + 3.5 + 6  =  15.5 แล้วหารด้วยจำนวนหน่วยกิตทั้งหมด 15.5 / (2 + 1 + 1.5)  =  15.5/4.5 ดังนั้นหน่วยกิตที่ได้จากตัวอย่างนี้คือ 3.44',
        icon: 'question',
        toast: true,
        confirmButtonText: 'ปิด',
        width: '700px',
    })
}