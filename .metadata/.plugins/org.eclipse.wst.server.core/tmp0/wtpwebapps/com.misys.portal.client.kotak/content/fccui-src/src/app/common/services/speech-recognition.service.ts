import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface IWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}
// declare var webkitSpeechRecognition: any;
@Injectable()
export class SpeechRecognitionService {
  // speechRecognition = new webkitSpeechRecognition();
  isSpeechStopped = false;
  speechRecognition;
  public text = '';
  tempWords;

  public speechText = new BehaviorSubject(null);

  constructor() {
    //eslint : no-empty-function
  }

  init() {
    const { webkitSpeechRecognition }: IWindow = window as unknown as IWindow; // required for browsers non-webkit based
    this.speechRecognition = new webkitSpeechRecognition();
    this.speechRecognition.continuous = true;
    this.speechRecognition.lang = 'en-US';
    this.speechRecognition.maxAlternatives = 1;
    this.speechRecognition.addEventListener('result', (e) => {
      const transcript = Array.from(e.results).map((result) => result[0]).map((result) => result.transcript).join('');
      this.tempWords = transcript;
      // eslint-disable-next-line no-console
      console.log('transcript is: ' + transcript);
      this.speechText.next(transcript);
    });
  }

  start() {
    this.isSpeechStopped = false;
    this.speechRecognition.start();
    this.speechRecognition.addEventListener('end', () => {
      if (this.isSpeechStopped) {
        this.speechRecognition.stop();
      } else {
        this.speechConcat();
        this.speechRecognition.start();
      }
    });
  }

  speechConcat() {
    this.text += ' ' + this.tempWords + '.';
    this.tempWords = '';
  }

  stop() {
    this.isSpeechStopped = true;
    this.speechConcat();
    this.speechRecognition.stop();
  }
}
