document.getElementById('uploadForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const formData = new FormData();
    const fileInput = document.getElementById('fileInput');
    formData.append('file', fileInput.files[0]);

    const response = await fetch('/upload', {
        method: 'POST',
        body: formData
    });
    const filename = await response.text();
    const videoUrl = `/uploads/${filename}`;
    
    const videoContainer = document.getElementById('videoContainer');
    const videoPreview = document.getElementById('videoPreview');
    videoPreview.src = videoUrl;
    videoContainer.style.display = 'block';

    document.getElementById('playFullVideo').addEventListener('click', () => {
        videoPreview.play();
    });

    document.getElementById('customizeVideo').addEventListener('click', () => {
        document.getElementById('customizeContainer').style.display = 'block';
    });

    document.getElementById('applyCustomization').addEventListener('click', async () => {
        const startHour = parseInt(document.getElementById('startHour').value) || 0;
        const startMinute = parseInt(document.getElementById('startMinute').value) || 0;
        const startSecond = parseInt(document.getElementById('startSecond').value) || 0;
        const endHour = parseInt(document.getElementById('endHour').value) || 0;
        const endMinute = parseInt(document.getElementById('endMinute').value) || 0;
        const endSecond = parseInt(document.getElementById('endSecond').value) || 0;

        const startTime = (startHour * 3600) + (startMinute * 60) + startSecond;
        const endTime = (endHour * 3600) + (endMinute * 60) + endSecond;
        
        const response = await fetch('/process_video', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                filename: filename,
                start_time: startTime,
                end_time: endTime
            })
        });
        const customFilename = await response.text();
        const customVideoUrl = `/uploads/${customFilename}`;
        
        const customVideo = document.getElementById('customVideo');
        customVideo.src = customVideoUrl;
        customVideo.style.display = 'block';
        customVideo.play();
    });
});
