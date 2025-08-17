const fileInput = document.getElementById("fileInput");
const compressBtn = document.getElementById("compressBtn");
const originalSize = document.getElementById("originalSize");
const compressedSize = document.getElementById("compressedSize");
const downloadLink = document.getElementById("downloadLink");

compressBtn.addEventListener("click", async () => {
  const file = fileInput.files[0];
  if (!file) return alert("Please select a file!");

  // Show original size
  originalSize.textContent = `Original Size: ${(file.size / 1024 / 1024).toFixed(2)} MB`;

  if (file.type.startsWith("image/")) {
    // IMAGE COMPRESSION
    const options = {
      maxSizeMB: 1, // target max size in MB
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      compressedSize.textContent = `Compressed Size: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`;

      // Download link
      const url = URL.createObjectURL(compressedFile);
      downloadLink.href = url;
      downloadLink.style.display = "block";
    } catch (error) {
      console.error(error);
      alert("Error compressing image!");
    }
  } else if (file.type === "application/pdf") {
    // PDF COMPRESSION (basic re-save, not heavy compression)
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);

      // re-save (this may remove metadata, sometimes reduce size)
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });

      compressedSize.textContent = `Compressed Size: ${(blob.size / 1024 / 1024).toFixed(2)} MB`;

      // Download link
      const url = URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = "compressed.pdf";
      downloadLink.style.display = "block";
    } catch (error) {
      console.error(error);
      alert("Error compressing PDF!");
    }
  } else {
    alert("Only Images and PDFs are supported!");
  }
});
