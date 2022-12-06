import { Injectable } from '@angular/core';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';


@Injectable({
  providedIn: 'root'
})
export class FfmpegService {
  isReady = false
  isRunning = false
  private ffmpeg;

  constructor() {
    this.ffmpeg = createFFmpeg({ log: true })  
  }

  async init() {
    if (this.isReady) {
      return
    }

    await this.ffmpeg.load()

    this.isReady = true
  }

  async getScreenshots(file: File) {
    this.isRunning = true
    const data = await fetchFile(file);

    this.ffmpeg.FS('writeFile', file.name, data);

    const seconds = [1,2,3];
    const commands: string[] = []

    seconds.forEach(second => {
      commands.push(
        //input
        '-i', file.name,
        //output options
        '-ss', `00:00:0${second}`,
        '-frames:v', '1',
        '-filter:v', 'scale=510:-1',
        //output
        `output_0${second}.png`
      )
    })

    await this.ffmpeg.run(
      ...commands
    );

    const screenshots: string[] = []
    seconds.forEach(second => {
      const screenshotFile = this.ffmpeg.FS('readFile', `output_0${second}.png`);


      const screenshotBlob = new Blob(
        [screenshotFile.buffer], {
          type: 'image/png'
        }
      )

      const screenshotUrl = URL.createObjectURL(screenshotBlob);
      screenshots.push(screenshotUrl);
    })
    this.isRunning = false
    return screenshots
  }

  async blobFromUrl(url: string) {
    const response = await fetch(url);
    const blob = await response.blob();

    return blob 
  }
}
