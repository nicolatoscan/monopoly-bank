import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedStringsService {

  constructor() { }

  public COLOR_BROWN: string = "#663300"
  public COLOR_CYAN: string = "#22bbbb"
  public COLOR_PURPLE: string = "#ff0066"
  public COLOR_ORANGE: string = "#ff9900"
  public COLOR_RED: string = "#ff3300"
  public COLOR_YELLOW: string = "#d9d900"
  public COLOR_GREEN: string = "#009933"
  public COLOR_BLUE: string = "#0033cc"

  public COLOR_INDUSTRY: string = "#000000"
  public COLOR_SERVICE: string = "#999999"

  public colorOrderMapping(colorS: string) {
    switch (colorS) {
      case "#663300": return 0;
      case "#22bbbb": return 1;
      case "#ff0066": return 2;
      case "#ff9900": return 3;
      case "#ff3300": return 4;
      case "#d9d900": return 5;
      case "#009933": return 6;
      case "#0033cc": return 7;
      case "#000000": return 8;
      case "#999999": return 9;
      default: return 10;
    }
  }
}
