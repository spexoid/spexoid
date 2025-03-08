Element.prototype.qs = Element.prototype.querySelector;
Element.prototype.qsa = Element.prototype.querySelectorAll;
window.dqs = (e) => document.querySelector(e);
window.dqsa = (e) => document.querySelectorAll(e);

const video = dqs("#video");
const canvas = dqs("#canvas");
const result = dqs("#result");
const button = dqs("#button");

document.addEventListener("DOMContentLoaded", (e) => {
    navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
            video.srcObject = stream;
            video.play();
        })
        .catch((err) => {
            console.error("Error accessing the camera: ", err);
        });
});

button.addEventListener("click", (e) => {
    const context = canvas.getContext("2d");
    const width = video.videoWidth;
    const height = video.videoHeight;
    const size = Math.min(width, height);
    const x = (width - size) / 2;
    const y = (height - size) / 2;
    context.drawImage(
        video,
        x,
        y,
        size,
        size,
        0,
        0,
        canvas.width,
        canvas.height
    );
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);
    if (code) {
        result.textContent = code.data;
    } else {
        result.textContent = "No QR code found";
    }
});
