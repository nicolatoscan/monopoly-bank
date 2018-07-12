import { Component, OnInit, Input } from '@angular/core';
import { Player, ILand } from '../../models/_index';
import { SharedDataService } from '../../services/shared-data.service';
import { List } from 'linqts';

@Component({
  selector: 'app-player-info',
  templateUrl: './player-info.component.html',
  styleUrls: ['./player-info.component.less']
})
export class PlayerInfoComponent implements OnInit {

  lands: List<ILand>;

  players: List<Player>;
  _player: Player

  @Input()
  set player(player: Player) {
    if (player) {
      this.players = this.shareDataService.Players.Where(p => p.index != player.index);
    }
    this._player = player;
  }
  get player(): Player {
    return this._player;
  }

  constructor(public shareDataService: SharedDataService) {
  }

  ngOnInit() {
    this.lands = this.shareDataService.Lands;
  }

  public sendMoney(n: number, indexTo?: number) {
    this.shareDataService.TransferMoney(n, this.player.index, indexTo);

    this.lands.Where(l => this._player.lands.Any(playerLand => playerLand.landProps.index != l.index)).ToArray()
  }

  public NotPlayerLands(): ILand[] {
    return this.lands.Where(l => !this.player.lands.Any(ll => ll.landProps.index == l.index)).ToArray()
  }

}
