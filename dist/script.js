Element.prototype.qs = Element.prototype.querySelector;
Element.prototype.qsa = Element.prototype.querySelectorAll;
window.dqs = (e) => document.querySelector(e);
window.dqsa = (e) => document.querySelectorAll(e);

const video = dqs("#video");
const canvas = dqs("#canvas");
const result = dqs("#result");
const scanbtn = dqs("#scanbtn");
const switchbtn = dqs("#switchbtn");
const fullscreenbtn = dqs("#fullscreenbtn");
const cameralist = dqs("#cameralist");

document.addEventListener("DOMContentLoaded", (e) => {
    navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
            devices.forEach((device) => {
                if (device.kind === "videoinput") {
                    const option = document.createElement("option");
                    option.value = device.deviceId;
                    option.textContent =
                        device.label || `Camera ${cameralist.length + 1}`;
                    cameralist.appendChild(option);
                }
            });
        })
        .catch((err) => {
            console.error("Error enumerating devices: ", err);
        });
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

scanbtn.addEventListener("click", (e) => {
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

switchbtn.addEventListener("click", (e) => {
    const tracks = video.srcObject.getTracks();
    tracks.forEach((track) => {
        result.textContent += "t";
        if (track.kind === "video") {
            track.getSources().then((sources) => {
                const newSourceId = sources.find(
                    (source) => source.id !== track.getSettings().sourceId
                ).id;
                track.applyConstraints({
                    advanced: [{ sourceId: newSourceId }],
                });
            });
        }
    });
});

fullscreenbtn.addEventListener("click", (e) => {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        // make window fullscreen
        document.documentElement.requestFullscreen();
    }
});
