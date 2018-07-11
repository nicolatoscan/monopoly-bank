import { Injectable } from '@angular/core';
import { ILand, IHistory, Player, IPlayer } from '../models/_index';
import { List } from 'linqts'
import { SharedStringsService } from './shared-strings.service';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  private players: List<Player> = new List<Player>([]);
  private lands: List<ILand> = new List<ILand>([]);
  private history: List<IHistory> = new List<IHistory>([]);

  constructor(private sharedStringService: SharedStringsService) { }

  // ----- LOCALSTORAGE
  public ClearLocal() {
    localStorage.removeItem('players');
    localStorage.removeItem('lands');
    localStorage.removeItem('history');
  }

  public LoadFromLocal() {
    this.players = new List<Player>(JSON.parse(localStorage.getItem('players')))
    this.lands = new List<ILand>(JSON.parse(localStorage.getItem('lands')))
    this.history = new List<IHistory>(JSON.parse(localStorage.getItem('history')))
  }

  public SaveToLocal() {
    localStorage.setItem('players', JSON.stringify(this.players.ToArray()))
    localStorage.setItem('lands', JSON.stringify(this.lands.ToArray()))
    localStorage.setItem('history', JSON.stringify(this.history.ToArray()))
  }

  public LoadAllForNew(players: IPlayer[], lands: ILand[]) {
    this.players = new List(players).Select(p => new Player(p))
    this.lands = new List(lands);
  }

  // ----- PLAYERS
  public get Players(): List<Player> {
    return this.players;
  }
  public SetPlayersByArray(p: Player[]) {
    this.players = new List(p);
  }
  public AddPlayer(p: Player) {
    this.players.Add(p);
  }
  public RemovePlayer(playerName: string) {
    this.players = this.players.Where(p => p.name != playerName);
  }
  public PlayerWithLand(land: ILand): Player {
    return this.players.FirstOrDefault(p => p.HasLand(land.index))
  }
  public CostOnLand(player: Player, land: ILand): number {
    let owner = this.PlayerWithLand(land);
    if (!owner || owner === player) {
      return 0;
    }

    let landProp = owner.lands.Single(l => l.landProps == land)
    let nLandColor = owner.HowManyLandsOf(land.color);

    //SERVICE
    if (land.color == this.sharedStringService.COLOR_SERVICE) {
      return land.costs[nLandColor - 1]
    }

    //INDUSTRY
    if (land.color == this.sharedStringService.COLOR_INDUSTRY) {
      let nDice = prompt("Risultato dadi");
      return Number(nDice) * 10000 * (nLandColor == 1 ? 4 : 10)
    }

    //HOUSES
    if (landProp.houses != 0) {
      return land.costs[landProp.houses]
    }
    //HOTEL
    if (landProp.hotels != 0) {
      return land.costs[5];
    }

    //ONLY PROPERTY
    if (land.color == this.sharedStringService.COLOR_BLUE || land.color == this.sharedStringService.COLOR_BROWN) {
      if (nLandColor == 2) {
        return land.costs[0] * 2
      }
    } else if (nLandColor == 3) {
      return land.costs[0] * 2
    }

    return land.costs[0];

  }
  public PlayerBuysLand(player: Player, land: ILand) {
    let owner = this.PlayerWithLand(land);

    if (owner == player) {
      return;
    }

    if (owner) {
      owner.lands = owner.lands.Where(l => l.landProps.index != land.index)
      let c = Number(prompt("Quanto l'ha pagata"));
      owner.balance += c;
      player.balance -= c;
    } else {
      player.balance -= land.value;
    }

    player.lands.Add({
      hotels: 0,
      houses: 0,
      landProps: land
    })

  }
  public TransferMoney(value: number, fromPlayerIndex: number, toPlayerIndex?: number) {
    let fromPlayer = this.players.FirstOrDefault(p => p.index == fromPlayerIndex)
    let toPlayer = null;
    if (toPlayerIndex !== null && toPlayerIndex !== undefined) {
      toPlayer = this.players.FirstOrDefault(p => p.index == toPlayerIndex)
    }

    if (fromPlayer) {
      fromPlayer.balance -= +value;
    }
    if (toPlayer) {
      toPlayer.balance += +value;
    }
  }

  // ----- LANDS
  public get Lands() {
    return this.lands;
  }
  public SetLandsByArray(l: ILand[]) {
    this.lands = new List(l);
  }
  public AddLand(l: ILand) {
    this.lands.Add(l);
  }
  public RemoveLand(landName: string) {
    this.lands = this.lands.Where(l => l.name != landName);
  }

  // ----- HISTORY
  public get History() {
    return this.lands;
  }
  public AddHistory(h: IHistory) {
    this.history.Add(h);
  }
}
