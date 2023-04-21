const originalButtonContent = document.getElementById("fileInput").innerHTML;
const originalButtonColor = window.getComputedStyle(document.getElementById("fileInput")).backgroundColor;
const label = document.querySelector('label[for="fileInput"]');

function toggleUploadButton() {
  const uploadButton = document.getElementById("fileInput");

  if (uploadButton.innerHTML !== originalButtonContent) {
  uploadButton.innerHTML = originalButtonContent;
  uploadButton.style.backgroundColor = originalButtonColor;
  }
}
// JavaScript code
function displayFileName() {
  // Get the input element that allows user to select a file
  const fileInput = document.getElementById("fileInput");

  // Get the selected file name and display it in a separate <div> element
  const fileNameDisplay = document.getElementById("fileNameDisplay");
  fileNameDisplay.textContent = fileInput.files[0].name;
  setTimeout(function() {
  label.innerHTML = 'Click Upload';
  label.style.backgroundColor = '#34A853';
  }, 1000);
  toggleUploadButton();
}
// const label = document.querySelector('label[for="fileInput"]');
function removeFile() {
  // Get the input element that allows user to select a file
  // const fileInput = document.getElementById("fileInput");
  
  // Check if a file has been selected
  if (fileInput.files.length === 0) {
    notiToast('Please Select The File first' , 'error');
    return;
  }
  
  // Clear the selected file by resetting the input element
  fileInput.value = null;
  setTimeout(function() {
  label.innerHTML = 'Choose File';
  label.style.backgroundColor = 'rgb(0, 0, 0)';
  }, 1000);
  
  // Clear the displayed file name
  const fileNameDisplay = document.getElementById("fileNameDisplay");
  fileNameDisplay.textContent = "";
  toggleUploadButton();
  // (Optional) Show a message to indicate that the file has been deleted
  notiToast('File deleted Successfully.' , 'success');
  
}

//Main Fucntion For Calling Notification Toast

const notiToast = (message, messageType) =>{
  
  const notificationContainer = document.getElementById('notification-toast');
 
  // const message = 'Please Choose The File';
  // const messageType ='error';
  
  if (message) {
    const notification = document.createElement('div');
    notification.classList.add('notification', messageType);
  
    const icon = document.createElement('span');
    icon.classList.add('notification-icon');
    if (messageType === 'success') {
      icon.innerHTML = '&#10003;'; // checkmark icon
    } else if (messageType === 'error') {
      icon.innerHTML = '&#10007;'; // cross icon
    }
    notification.appendChild(icon);
  
    const messageText = document.createElement('span');
    messageText.innerText = message;
    notification.appendChild(messageText);
  
    notificationContainer.appendChild(notification);
  
    setTimeout(() => {
      notification.classList.remove('slide-up');
      notification.classList.add('slide-down');
      setTimeout(() => {
        notificationContainer.removeChild(notification);
      }, 300);
    }, 5000);
  }

}