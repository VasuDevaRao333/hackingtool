document.getElementById('uploadForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const preview = document.getElementById('preview');
            preview.innerHTML = `<img src="${e.target.result}" alt="Uploaded Image">`;
        };

        reader.readAsDataURL(file);
    } else {
        alert('No file selected!');
    }
});


// script.js
document.getElementById('fileInput').addEventListener('change', function (event) {
    const preview = document.getElementById('preview');
    preview.innerHTML = ''; // Clear previous preview
    const file = event.target.files[0];

    if (file && file.type.startsWith('image/')) {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        preview.appendChild(img);
    } else {
        preview.innerHTML = 'Please upload a valid image file.';
    }
});
