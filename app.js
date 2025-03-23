document.getElementById('uploadForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const videoInput = document.getElementById('videoInput').files[0];
    const speed = document.getElementById('speedSlider').value;
    
    const { createFFmpeg, fetchFile } = FFmpeg;
    const ffmpeg = createFFmpeg({ log: true });
    
    await ffmpeg.load();
    ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(videoInput));
    
    await ffmpeg.run('-i', 'input.mp4', '-filter_complex', `[0:v]setpts=${1/speed}*PTS,split[v1][v2];[v1]palettegen[p];[v2][p]paletteuse`, 'output.gif');
    
    const data = ffmpeg.FS('readFile', 'output.gif');
    const gifUrl = URL.createObjectURL(new Blob([data.buffer], { type: 'image/gif' }));
    
    document.getElementById('gifOutput').src = gifUrl;
});

document.getElementById('speedSlider').addEventListener('input', (event) => {
    document.getElementById('speedValue').textContent = `${event.target.value}x`;
});
