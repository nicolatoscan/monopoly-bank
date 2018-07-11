import { Component, OnInit } from '@angular/core';
import { SharedDataService } from '../../services/shared-data.service';
import { Player } from '../../models/_index';
import { List } from 'linqts';

@Component({
  selector: 'app-playing',
  templateUrl: './playing.component.html',
  styleUrls: ['./playing.component.less']
})
export class PlayingComponent implements OnInit {

  players: List<Player>
  currentPlayer: Player = null;

  constructor(public shareDataService: SharedDataService) {}

  ngOnInit() {
    this.players = this.shareDataService.Players;
    this.currentPlayer = this.players.First();
  }

}
