let password = '';

document
  .getElementById('loginForm')
  .addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission

    var mobileNumber = document.getElementById('mobileNumber').value;

    // Load the Excel file from the root directory
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'studentData.xlsx', true);
    xhr.responseType = 'arraybuffer';

    xhr.onload = function (e) {
      var data = new Uint8Array(xhr.response);
      var workbook = XLSX.read(data, { type: 'array' });
      var sheetName = workbook.SheetNames[0];
      var sheet = workbook.Sheets[sheetName];

      var range = XLSX.utils.decode_range(sheet['!ref']);

      var found = false;

      // Loop through each row to find the mobile number
      for (var rowNum = range.s.r + 1; rowNum <= range.e.r; rowNum++) {
        // Start from row 2 to skip header
        var mobileCell = sheet[XLSX.utils.encode_cell({ r: rowNum, c: 1 })]; // Assuming mobile number is in the second column
        if (mobileCell && mobileCell.v == mobileNumber) {
          var idCell = sheet[XLSX.utils.encode_cell({ r: rowNum, c: 2 })]; // Username
          var passwordCell = sheet[XLSX.utils.encode_cell({ r: rowNum, c: 3 })]; // Password
          var modalContent =
            'User Name: ' + idCell.v + '<br>Password: ' + passwordCell.v;
          password = passwordCell.v;
          showModal(modalContent);
          found = true;
          break;
        }
      }

      // If mobile number not found
      if (!found) {
        showModal(
          'Please Check your Registered Number. Please contact the support team at 7410833331, 7410833330'
        );
      }
    };

    xhr.send();
  });

function showModal(content) {
  var modal = document.getElementById('myModal');
  var modalContent = document.getElementById('modalContent');
  modalContent.innerHTML = content;
  modal.style.display = 'block';

  var copyButton = document.getElementById('copyButton');
  if (content.includes('Password')) {
    copyButton.style.display = 'inline-block';
  } else {
    copyButton.style.display = 'none';
  }

  var closeBtn = document.getElementsByClassName('close')[0];
  closeBtn.onclick = function () {
    modal.style.display = 'none';
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  };
}

function copyToClipboard() {
  var modalContent = document.getElementById('modalContent').innerText;
    navigator.clipboard.writeText(modalContent).then(
      function () {
        // alert('Copied to clipboard!');
      },
      function () {
        alert('Failed to copy to clipboard!');
      }
    );
}
