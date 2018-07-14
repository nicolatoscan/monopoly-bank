import { Component, OnInit, Input } from '@angular/core';
import { Player, ILand, IPlayerLand } from '../../models/_index';
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
  @Input() mortgaged: boolean;

  constructor(public shareDataService: SharedDataService) { }

  ngOnInit() {
  }

  public CostOnLand(): { cost: number, owner: Player } {
    return this.shareDataService.CostOnLand(this.player, this.land);
  }

  public addHouse(n: number) {
    let propLand = this.player.lands.FirstOrDefault(l => this.land.index == l.landProps.index);
    if (!propLand) {
      return;
    }

    this.nHouses = +this.nHouses + +n;
    if (this.nHouses > 4) {
      this.nHouses = 4
    }
    if (this.nHouses < 0) {
      this.nHouses = 0
    }

    let cost = (+this.nHouses - +propLand.houses) * +propLand.landProps.housePrice;
    this.shareDataService.TransferMoney(+cost, this.player.index)
    propLand.houses = this.nHouses;
  }
  public addHotel(n: number) {
    let propLand = this.player.lands.FirstOrDefault(l => this.land.index == l.landProps.index);
    if (!propLand) {
      return;
    }

    let cost = 0;
    if (n == 1 && this.nHotels == 0 && this.nHouses == 4) {
      this.nHotels = 1;
      this.nHouses = 0;
      cost = +propLand.landProps.housePrice;
    } else if (n < 0) {
      this.nHotels = 0
      cost = +prompt("A quanto l'hai venduto?");
    }
    this.shareDataService.TransferMoney(-cost, this.player.index)
    propLand.hotels = this.nHotels;
    propLand.houses = this.nHouses;

  }

  public Buy() {
    this.shareDataService.PlayerBuysLand(this.player, this.land)
  }
  public Sell() {
    this.shareDataService.PlayerSellsLand(this.player, this.land)
  }
  public Pay() {
    let c = this.shareDataService.CostOnLand(this.player, this.land, true);
    this.shareDataService.TransferMoney(+c.cost, this.player.index, (c.owner ? c.owner.index : null))
  }

  public Mortgage() {
    let propLand = this.player.lands.FirstOrDefault(l => this.land.index == l.landProps.index);

    propLand.mortgaged = !propLand.mortgaged;
    this.shareDataService.TransferMoney((propLand.mortgaged ? -1 : +1) * propLand.landProps.mortgage, this.player.index)

  }

}
