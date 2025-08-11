// Simple QR generator + scanner (uses qrcodejs & jsQR)
// Author: Generated for user
const genBtn = document.getElementById('genBtn');
const downloadBtn = document.getElementById('downloadQR');
const qrcodeContainer = document.getElementById('qrcode');
const qrInput = document.getElementById('qrText');

let qrInstance = null;

genBtn.addEventListener('click', () => {
  const text = qrInput.value.trim();
  if(!text) return alert('Please enter text or URL to encode.');

  // Clear previous
  qrcodeContainer.innerHTML = '';
  qrInstance = new QRCode(qrcodeContainer, {
    text,
    width: 220,
    height: 220,
    colorDark : '#d3d2d2ff',
    colorLight : '#ffffff00',
    correctLevel : QRCode.CorrectLevel.H
  });

  // enable download button
  setTimeout(()=> downloadBtn.disabled = false, 250);
});

// Download generated QR as PNG
downloadBtn.addEventListener('click', () => {
  if(!qrInstance) return;
  const img = qrcodeContainer.querySelector('img') || qrcodeContainer.querySelector('canvas');
  if(!img) return alert('QR not ready yet.');

  // If image element
  if(img.tagName === 'IMG'){
    const src = img.src;
    const a = document.createElement('a');
    a.href = src;
    a.download = 'qr.png';
    a.click();
  } else {
    // canvas
    const url = img.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qr.png';
    a.click();
  }
});

/* ------------------ Scanner ------------------ */
const video = document.getElementById('video');
const startScanBtn = document.getElementById('startScan');
const stopScanBtn = document.getElementById('stopScan');
const scanResult = document.getElementById('scanResult');

let stream = null;
let scanning = false;
let rafId = null;

startScanBtn.addEventListener('click', async () => {
  if(scanning) return;
  try{
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    video.srcObject = stream;
    await video.play();
    scanning = true;
    startScanBtn.disabled = true;
    stopScanBtn.disabled = false;
    scanLoop();
  }catch(err){
    alert('Could not access camera. Make sure you allowed permission and are on HTTPS or localhost.');
    console.error(err);
  }
});

stopScanBtn.addEventListener('click', () => {
  stopScanning();
});

function stopScanning(){
  scanning = false;
  startScanBtn.disabled = false;
  stopScanBtn.disabled = true;
  if(rafId) cancelAnimationFrame(rafId);
  if(stream){
    stream.getTracks().forEach(t => t.stop());
    stream = null;
  }
  video.pause();
  video.srcObject = null;
}

function scanLoop(){
  if(!scanning) return;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  if(canvas.width === 0 || canvas.height === 0){
    rafId = requestAnimationFrame(scanLoop);
    return;
  }
  ctx.drawImage(video,0,0,canvas.width,canvas.height);
  const imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
  const code = jsQR(imageData.data, canvas.width, canvas.height, { inversionAttempts: 'attemptBoth' });
  if(code){
    scanResult.innerHTML = 'Result: <span>' + escapeHtml(code.data) + '</span>';
    // optional: stop scanning automatically
    // stopScanning();
  } else {
    rafId = requestAnimationFrame(scanLoop);
  }
}

function escapeHtml(str){
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
