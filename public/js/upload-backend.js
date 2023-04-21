const form = document.getElementById('form');
const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('button1');

// form.addEventListener('submit', async (e) => {
//   e.preventDefault();
//   const file = fileInput.files[0];
  
//   if (!file){
//     notiToast();
//     // return;
//   } 

//   const data = new FormData();
//   data.append('file', file);

//   try {
//     const res = await fetch('/upload', {
//       method: 'POST',
//       body: data,
//     });
//     if (!res.ok) throw new Error(res.statusText);

//     // loading.style.display = 'none';
//     // success.style.display = 'flex';
//   } catch (error) {
//     console.error(error);
//   }
// });


form.addEventListener('submit',  (e) => {
  e.preventDefault();

  // Check if a file has been selected
  if (fileInput.files.length > 0) {
    // Display a notification to the user
    // alert('Document upload in progress...');
    notiToast2('Document Upload in Progress....' , 'success');

    // Make an AJAX request to upload the file to the server
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/upload', true);
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    xhr.send(formData);
    xhr.onload = () => {
      if (xhr.status === 500) {
        // Display a success notification to the user
        
        notiToast2('Filesize is larger Than 1MB!' , 'error');}

      else if (xhr.status === 200) {
        // Display a success notification to the user
        
        notiToast2('Document Successfully Uploaded in the Database!' , 'success');
      } else {
        // Display an error notification to the user
        // alert('An error occurred while uploading the document. Please try again.');
        notiToast2('An error occurred while uploading the document. Please try again.' , 'error');
      }
    };
  } else {
    // Display an error notification to the user
    // alert('Please select a document to upload.');
    notiToast2('Please Select a Document to Upload' , 'error');
  }
});


//Main Fucntion For Calling Notification Toast


const notiToast2 = (message, messageType) =>{
  
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