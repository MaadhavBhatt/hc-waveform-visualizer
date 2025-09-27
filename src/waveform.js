const context = new AudioContext();

class WaveformVisualizer {
  constructor(canvasId, audioBuffer) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.audioBuffer = audioBuffer;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
  }

  drawWaveform() {
    const channelData = this.audioBuffer.getChannelData(0);
    const samplesPerPixel = Math.floor(channelData.length / this.width);

    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.strokeStyle = '#00ff00';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();

    for (let x = 0; x < this.width; x++) {
      const sampleIndex = x * samplesPerPixel;
      const sample = channelData[sampleIndex] || 0;
      const y = (sample * this.height) / 2 + this.height / 2;

      if (x === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }

    this.ctx.stroke();
  }

  loadAudioFile(file) {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      context
        .decodeAudioData(e.target.result)
        .then((audioBuffer) => {
          this.audioBuffer = audioBuffer;
          this.drawWaveform();
        })
        .catch((error) => console.error('Error decoding audio:', error));
    };
    fileReader.readAsArrayBuffer(file);
  }
}

export { WaveformVisualizer };
