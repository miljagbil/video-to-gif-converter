from flask import Flask, request, send_file
import subprocess
import os

app = Flask(__name__)

@app.route('/convert', methods=['POST'])
def convert():
    video = request.files['video']
    speed = float(request.form['speed'])
    
    video_path = 'input.mp4'
    gif_path = 'output.gif'
    
    video.save(video_path)
    
    # Convert video to GIF with interpolation and speed adjustment
    subprocess.run([
        'ffmpeg', '-i', video_path,
        '-filter_complex', f'[0:v]setpts={1/speed}*PTS,split[v1][v2];[v1]palettegen[p];[v2][p]paletteuse',
        gif_path
    ])
    
    return send_file(gif_path, mimetype='image/gif')

if __name__ == '__main__':
    app.run(debug=True)
