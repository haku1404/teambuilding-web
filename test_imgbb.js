import fs from 'fs';
const IMGBB_API_KEY = "ebc1b1415afac7601fc8a887c8f4e632";

// Create a dummy 1x1 png in base64
const dummyBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

const formData = new FormData();
formData.append('image', dummyBase64);

fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
    method: 'POST',
    body: formData
}).then(res => res.json()).then(data => {
    console.log(JSON.stringify(data, null, 2));
}).catch(err => console.error(err));
