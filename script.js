document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('reading-form');
    const meterPhotoInput = document.getElementById('meterPhoto');
    const uploadButton = document.getElementById('upload-button');
    const fileNameSpan = document.getElementById('file-name');


    // Make the custom button trigger the hidden file input
    uploadButton.addEventListener('click', () => {
        meterPhotoInput.click();
    });

    // Show the selected file name
    meterPhotoInput.addEventListener('change', () => {
        if (meterPhotoInput.files.length > 0) {
            fileNameSpan.textContent = meterPhotoInput.files[0].name;
        } else {
            fileNameSpan.textContent = '';
        }
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent the form from reloading the page

        // 1. Get form data
        const meterId = document.getElementById('meterId').value;
        const reading = document.getElementById('reading').value;


        // 3. Get GPS location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {

                }
            );
        } else {
            // Geolocation not supported by the browser

    }
});
