const fileInput = document.querySelector('#fileInput');
const label = document.querySelector('label[for="fileInput"]');

fileInput.addEventListener('change', function() {
  const file = this.files[0];
  const allowedTypes = ['pdf', 'doc', 'docx', 'txt'];
  const fileType = file.name.split('.').pop();

  if (!allowedTypes.includes(fileType)) {
    alert('Invalid file type. Only PDF, Word, and text files are allowed.');
    return;
  }

  label.innerHTML = 'Uploading...';
  label.style.backgroundColor = '#8B61DB';

  setTimeout(function() {
    label.innerHTML = 'Upload Completed';
    label.style.backgroundColor = '#34A853';
  }, 3000);
});
