// const fileInputs = document.querySelector('#fileInput');
// const label = document.querySelector('label[for="fileInput"]');
// let timeoutId; // Declare a variable to store the setTimeout ID

// fileInputs.addEventListener('change', function() {
//   const file = this.files[0];
//   const allowedTypes = ['pdf', 'doc', 'docx', 'txt'];
//   const fileType = file.name.split('.').pop();

//   if (!allowedTypes.includes(fileType)) {
//     alert('Invalid file type. Only PDF, Word, and text files are allowed.');
//     return;
//   }

//   // Store the setTimeout ID in the variable
//  setTimeout(function() {
//     label.innerHTML = 'Click Upload';
//     label.style.backgroundColor = '#34A853';
//   }, 1000);
// });

// fileInputs.addEventListener('input', function() {
//   // Clear the setTimeout when the input is reset
//   // Check if the input value is empty
//   if (!this.value) {
//     // Clear the setTimeout when the input is reset
//     clearTimeout(timeoutId);
//     // Reset the label text and background color to their original values
//     label.innerHTML = 'Choose file';
//     label.style.backgroundColor = '#007bff';
//   }
// });




// const form = document.getElementById('form');
// const fileInput = document.getElementById('fileInput');
// const uploadBtn = document.getElementById('button1');

// form.addEventListener('submit', async (e) => {
//   e.preventDefault();
//   const file = fileInput.files[0];
//   if (!file) return;

//   const data = new FormData();
//   data.append('file', file);

//   try {
//     const res = await fetch('/upload', {
//       method: 'POST',
//       body: data,
//     });
//     if (!res.ok) throw new Error(res.statusText);

//     loading.style.display = 'none';
//     success.style.display = 'flex';
//   } catch (error) {
//     console.error(error);
//   }
//   setTimeout(function() {
//     label.innerHTML = 'Click Upload';
//     label.style.backgroundColor = '#34A853';
//   }, 1000);

// });