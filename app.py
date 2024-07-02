from flask import Flask, render_template, request, send_from_directory
from moviepy.video.io.ffmpeg_tools import ffmpeg_extract_subclip
import os

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads/'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return 'No file part'
    file = request.files['file']
    if file.filename == '':
        return 'No selected file'
    if file:
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(file_path)
        return file.filename
    return 'File upload failed'

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/process_video', methods=['POST'])
def process_video():
    data = request.get_json()
    filename = data['filename']
    start_time = data['start_time']
    end_time = data['end_time']
    input_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    output_path = os.path.join(app.config['UPLOAD_FOLDER'], f"custom_{filename}")
    ffmpeg_extract_subclip(input_path, start_time, end_time, targetname=output_path)
    return f"custom_{filename}"

if __name__ == '__main__':
    app.run(debug=True)
