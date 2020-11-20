import {Component }from '@angular/core'; 
import { Observable } from 'rxjs';


@Component( {
selector:'app-home', 
templateUrl:'home.page.html', 
styleUrls:['home.page.scss'], 
})
export class HomePage {

  public sampleRate = 360.0; 
  public signalLevel = 0.5; 
  public amplitudeMax = 30.0; 
  public frequency = 30; 
  private points = []; 
  private lastPointIndex = 0; 
  public newSignalLevel = 0.2;
  private intervalSenoide: any;

  public get history():string {
    return this.points.map(p => p.x + "," + p.y).join(' '); 
  }


  constructor() {
    this.makeSenoidal(); 
  }

  private makeSenoidal() {
    this.points = [];
    for (var n = 0; n < this.sampleRate; n++) {
      let amplitude = this.amplitudeMax * (1.0 - this.signalLevel); 
      var m = Math.sin((2.0 * Math.PI * n * this.frequency)/this.sampleRate); 
      var y = Math.trunc(this.amplitudeMax + (amplitude * m)); 
      var x = n; 
      this.points.push( {x:x, y:y }); 
    }
    this.lastPointIndex = this.sampleRate - 1; 
  }

  addSignal() {
    this.points.shift(); 
    for (var n = 0; n < this.points.length; n++) {
      this.points[n].x--;
    }

    if (this.lastPointIndex >= 359)
      this.lastPointIndex = -1;
    this.lastPointIndex++;

    let amplitude = this.amplitudeMax * (1.0 - this.newSignalLevel); 

    var m = Math.sin((2.0 * Math.PI * (this.lastPointIndex) * this.frequency)/this.sampleRate); 
    var y = Math.trunc(this.amplitudeMax + (amplitude * m)); 
    var x = this.points.length - 1; 
    this.points.push( {x:x, y:y }); 
  }

  incSignal() {
    if (this.newSignalLevel < 1.0)
      this.newSignalLevel = parseFloat((this.newSignalLevel + 0.100).toFixed(1));
  }

  decSignal() {
    if (this.newSignalLevel > 0.0)
    this.newSignalLevel = parseFloat((this.newSignalLevel - 0.100).toFixed(1));
  }

  stopSenoidal() {
    if (this.intervalSenoide) {
      clearInterval(this.intervalSenoide);
    }
  }

  startSenoidal() {
    this.makeSenoidal(); 
    this.intervalSenoide = setInterval(() => { 
      this.addSignal();
   }, 100);
  }
}
