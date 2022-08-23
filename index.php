<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
<script src="https://kit.fontawesome.com/2d749b1946.js" crossorigin="anonymous"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/popper.js@1.12.9/dist/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.3.0/css/font-awesome.css" rel="stylesheet"  type='text/css'>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11.4.29/dist/sweetalert2.all.min.js"></script>
<link rel="stylesheet" href="./assets/css/main.css">
<title>GPA Calculator</title>
</head>
<body>
<!--<div id="background"></div>-->
<div id="navbar">
    <nav class="navbar navbar-expand-lg navbar-dark custom-nav">
    <a class="navbar-brand" href="#"><i class="fa-solid fa-graduation-cap"></i> GPA Calculator</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
            <li class="nav-item active">
                <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#" onclick="Swal.fire({
                    title: 'สูตรการคำนวณหาเกรดเฉลี่ย',
                    text: '-',
                    icon: 'question',
                    toast: true,
                    confirmButtonText: 'ปิด'
                })">Formula</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#" onclick="Swal.fire({
                    title: 'เกี่ยวกับเว็บไซต์',
                    text: 'คำนวนหาเกรดเฉลี่ย โดยกรอกหน่วยกิตและเกรดที่ได้ โปรแกรมจะคิดเกรดเฉลี่ย (GPA) ออกมา',
                    icon: 'question',
                    confirmButtonText: 'ปิด'
                })">About</a>
            </li>
        </ul>
        <ul class="navbar-nav ml-auto">
            <li class="nav-item">
                <a class="nav-link" href="https://github.com/InshallahX" target="_blank"><i class="fa-brands fa-github"></i> Github</a>
            </li>
        </ul>
    </div>
    </nav>
</div>
<div id="main" class="container">
    <div class="vertical-row">
        <div class="col-md-8">
            <div class="content-frame">
                <!-- Student Management -->
                <h4 style="color: darkgray"><i class="fa-solid fa-user"></i> นักเรียน</h4>
                <form id="student-form">
                    <input type="number" placeholder="รหัสนักเรียน" style="width: 120px;" autocomplete="off" maxlength="5" name="student-id" id="id" disabled/>
                    <select id="prefix" disabled>
                        <option value="คุณ">-</option>
                        <option value="นาย">นาย</option>
                        <option value="นางสาว">นางสาว</option>
                    </select>
                    <input type="text" placeholder="ชื่อจริง" autocomplete="off" maxlength="40" name="student-name" id="name" disabled/>
                    <input type="text" placeholder="นามสกุล" autocomplete="off" maxlength="40" name="student-surname" id="surname" disabled/>
                </form>
                <!-- Table -->
                <table id="subject-table" style="display: none;">
                    <tr>
                        <th>ลำดับ</th>
                        <th>ชื่อวิชา</th>
                        <th>คะแนนที่ได้</th>
                        <th>หน่วยกิต</th>
                        <th>เกรด</th>
                    </tr>
                </table>
                </br>
                <!-- Form -->
                <h4><i class="fa-solid fa-book"></i> เพิ่มวิชา</h4>
                <form method="action" id="form" onsubmit="AppendSubject().then(UpdateSummary())">
                    <label for="subject">วิชา</label>
                    <input type="text" placeholder="ชื่อวิชา" autocomplete="off" maxlength="40" name="subject-name" id="subject" form="form" required/>
                    </br>
                    <label for="score">คะแนน</label>
                    <input type="number" placeholder="0" min="0" max="100" pattern="\d*" maxlength="3" name="subject-score" id="score" form="form" style="width: 60px;" oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength)" required/>
                    </br>
                    <label for="credit">หน่วยกิต</label>
                    <input type="number" placeholder="0" min="0.5" max="10" step=".5" pattern="\d*" maxlength="3" name="subject-credit" id="credit" form="form" style="width: 50px;" oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength)" required/>
                    </br>
                    <button type="button" form="form" class="btn btn-info" id="export" onclick="Export()"><i class="fa-solid fa-floppy-disk"></i> บันทึก</button>
                    <button type="submit" form="form" class="btn btn-success" id="submit"><i class="fa-solid fa-plus"></i> เพิ่มวิชา</button>
                    <button type="button" form="form" class="btn btn-danger" id="purge" onclick="Clear()"><i class="fa-solid fa-trash-can"></i> ลบทั้งหมด</button>
                </form>
                <!-- Management -->
                <h4><i class="fa-solid fa-bars-progress"></i> การจัดการ</h4>
                <form method="action" id="management-form" onsubmit="RemoveSubject().then(UpdateSummary())">
                    <label for="score">ลำดับวิชา</label>
                    <input type="number" placeholder="1" min="1" max="99" pattern="\d*" maxlength="2" name="subject-index" id="index" form="management-form" style="width: 60px;" oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength)" required/>
                    </br>
                    <button type="submit" form="management-form" class="btn btn-danger" id="specific-remove"><i class="fa-solid fa-trash-can"></i> ลบ</button>
                </form>
            </div>
        </div>
        <div class="col-md-4 col-sm-2 col-xs">
            <div class="content-frame">
                <h4>สรุป (<span id="total-subject">0</span> วิชา)</h4>
                <p>เกรดรวม <span id="total-grade" style="color: red">0</span></p>
                <p>หน่วยกิตรวม <span id="total-credit" style="color: red">0</span></p>
                <p>เกรดเฉลี่ย <span id="avg" style="color: red">-</span></p>
            </div>
        </div>
    </div>
</div>
</body>
<script defer src="./assets/js/grade_cal.js" type="text/javascript"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.cells.min.js"></script>
<script>
return;
VANTA.CELLS({
  el: "#background",
  mouseControls: true,
  touchControls: true,
  gyroControls: false,
  minHeight: 200.00,
  minWidth: 200.00,
  scale: 1.50,
  color1: 0x2d7f7f,
  color2: 0x262ec3,
  speed: 2.00
})
</script>
</html>