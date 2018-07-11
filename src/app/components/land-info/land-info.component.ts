import { Component, OnInit, Input } from '@angular/core';
import { Player, ILand } from '../../models/_index';
import { List } from 'linqts';
import { SharedDataService } from '../../services/shared-data.service';


@Component({
  selector: 'app-land-info',
  templateUrl: './land-info.component.html',
  styleUrls: ['./land-info.component.less']
})
export class LandInfoComponent implements OnInit {

  @Input() player: Player;
  @Input() land: ILand;
  @Input() mine: boolean;
  @Input() nHouses: number;
  @Input() nHotels: number;

  constructor(public shareDataService: SharedDataService) { }

  ngOnInit() {
  }

  public CostOnLand(): number {
    return this.shareDataService.CostOnLand(this.player, this.land);
  }

  public addHouse(n: number) {
    this.nHouses = +this.nHouses + +n;
    if (this.nHouses > 4) {
      this.nHouses = 4
    }
    if (this.nHouses < 0) {
      this.nHouses = 0
    }
  }
  public addHotel(n: number) {
    if (n > 0 && this.nHotels == 0 && this.nHouses == 4) {
      this.nHotels = 1;
      this.nHouses = 4;
    } else if (n < 0) {
      this.nHotels = 0
    }
  }

}
