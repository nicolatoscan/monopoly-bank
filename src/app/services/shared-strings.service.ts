import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedStringsService {

  constructor() { }

  public COLOR_BROWN: string = "#663300"
  public COLOR_CYAN: string = "#00ffff"
  public COLOR_PURPLE: string = "#ff0066"
  public COLOR_ORANGE: string = "#ff9900"
  public COLOR_RED: string = "#ff3300"
  public COLOR_YELLOW: string = "#d9d900"
  public COLOR_GREEN: string = "#009933"
  public COLOR_BLUE: string = "#0033cc"

  public COLOR_INDUSTRY: string = "#000000"
  public COLOR_SERVICE: string = "#999999"
}
