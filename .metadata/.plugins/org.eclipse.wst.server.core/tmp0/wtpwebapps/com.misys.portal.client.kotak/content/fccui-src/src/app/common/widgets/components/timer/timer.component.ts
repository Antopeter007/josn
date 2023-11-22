import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReauthService } from '../../../services/reauth.service';
import { FccGlobalConstant } from './../../../core/fcc-global-constants';

@Component({
  selector: 'fcc-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit, OnDestroy {

  timeLeft: number; // decreasing time
  minutes;
  seconds;
  timer;  // Timer to show in UI (HH : MM)
  timeout = false;  // Flag to check timeout
  baseNumber = FccGlobalConstant.LENGTH_10; // Base of Integer
  timerInterval;


  constructor(protected reauthService: ReauthService) {
  }
  
  ngOnDestroy(): void {
    if(this.timerInterval){
      clearInterval(this.timerInterval);
    }
  }

  ngOnInit(): void {
    this.setTime();
    this.startTimer();
    this.reauthService.restartTimer.subscribe(flag => {
      if (flag) {
        this.resetTimer();
      }
    });
  }

  setTime() {
    this.reauthService.getConfigurationValue('OTP_EXPIRE_TIMEOUT').subscribe(val => {
      this.timeLeft = val;
    });
  }

  startTimer() {
    this.setTimer();
    this.timerInterval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        this.setTimer();
      } else {
        if (!this.timeout) {
          this.reauthService.timeOver.next(true);
        }
        this.timeout = true;
      }
    }, FccGlobalConstant.LENGTH_1000);
  }

  setTimer() {
    this.timeout = false;
    this.timeLeft = this.timeLeft ? this.timeLeft : 0;
    this.minutes = Math.floor(this.timeLeft / FccGlobalConstant.LENGTH_60);
    this.minutes = this.minutes < this.baseNumber ? '0' + this.minutes : this.minutes;
    this.seconds = Math.floor(this.timeLeft % FccGlobalConstant.LENGTH_60);
    this.seconds = this.seconds < this.baseNumber ? '0' + this.seconds : this.seconds;
    this.timer = this.minutes.toString(this.baseNumber) + ':' + this.seconds.toString(this.baseNumber);
  }

  resetTimer() {
    this.setTime();
    this.reauthService.restartTimer.next(false);
  }
}
