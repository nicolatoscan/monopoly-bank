import { Injectable } from '@angular/core';
import { ILand, IHistory, Player, IPlayer, IPlayerExported, IPlayerLand } from '../models/_index';
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
  public IsLoadeble(): boolean {
    return localStorage.getItem('saved') ? true : false;
  }

  public ClearLocal() {
    localStorage.removeItem('saved');
    localStorage.removeItem('players');
    localStorage.removeItem('lands');
    localStorage.removeItem('history');
  }

  public LoadFromLocal() {
    if (!this.IsLoadeble())  {
      return;
    }

    this.lands = new List<ILand>(JSON.parse(localStorage.getItem('lands')))
    this.history = new List<IHistory>(JSON.parse(localStorage.getItem('history')))
    this.players = new List<IPlayerExported>(JSON.parse(localStorage.getItem('players'))).Select(p => {

      return new Player({
        index: p.index,
        name: p.name,
        balance: p.balance,

        lands: new List(p.lands).Select(lExp => {
          let playerLand: IPlayerLand = {
            hotels: lExp.hotels,
            houses: lExp.houses,
            mortgaged: lExp.mortgaged,
            landProps: this.lands.First(l => l.index == lExp.landPropsIndex)
          }
          return playerLand;
        })

      })

    })
  }

  public SaveToLocal() {
    localStorage.setItem('saved', "true")
    localStorage.setItem('players', JSON.stringify(this.players.Select(p => p.ToExportVersion()).ToArray()))
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
  public CostOnLand(player: Player, land: ILand, askIfNecessary = false): { cost: number, owner: Player } {
    let owner = this.PlayerWithLand(land);
    let r = { cost: 0, owner: owner }
    if (!owner) {
      return r;
    }


    let landProp = owner.lands.Single(l => l.landProps == land)
    let nLandColor = 0;
    if (landProp.mortgaged) {
      r.owner = null;
    } else {
      nLandColor = owner.HowManyLandsOf(land.color);
    }

    //SERVICE
    if (land.color == this.sharedStringService.COLOR_SERVICE) {
      r.cost = land.costs[nLandColor - 1]
      return r;
    }

    //INDUSTRY
    if (land.color == this.sharedStringService.COLOR_INDUSTRY) {
      let nDice = 1;
      if (askIfNecessary) {
        let nDice = prompt("Risultato dadi");
      }
      r.cost = Number(nDice) * 10 * (nLandColor == 1 ? 4 : 10)
      return r;
    }

    //HOUSES
    if (landProp.houses != 0) {
      r.cost = +land.costs[landProp.houses] + +((landProp.hotels != 0) ? land.costs[5] : 0)
      return r;
    }
    //HOTEL
    if (landProp.hotels != 0) {
      r.cost = land.costs[5];
      return r;
    }

    //ONLY PROPERTY
    if (land.color == this.sharedStringService.COLOR_BLUE || land.color == this.sharedStringService.COLOR_BROWN) {
      if (nLandColor == 2) {
        r.cost = land.costs[0] * 2
        return r;
      }
    } else if (nLandColor == 3) {
      r.cost = land.costs[0] * 2
      return r;
    }

    r.cost = land.costs[0];
    return r;

  }
  public PlayerBuysLand(player: Player, land: ILand) {
    let owner = this.PlayerWithLand(land);

    if (owner == player) {
      return;
    }

    if (owner) {
      owner.lands = owner.lands.Where(l => l.landProps.index != land.index)
      let c = Number(prompt("Quanto l'ha pagata"));
      owner.balance += +c;
      player.balance -= +c;
    } else {
      player.balance -= +land.value;
    }

    player.lands.Add({
      hotels: 0,
      houses: 0,
      landProps: land,
      mortgaged: false
    })

  }
  public PlayerSellsLand(player: Player, land: ILand) {
    let owner = this.PlayerWithLand(land);
    if (owner != player) {
      return;
    }

    owner.lands = owner.lands.Where(l => l.landProps.index != land.index)
    let c = Number(prompt("A quanto l'ha venduta"));
    owner.balance += +c;
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
  public AddHistory() {
    let h: IHistory = {
      index: this.history.Count() != 0 ? this.history.Last().index + 1 : 0,
      playerStatus: this.players.Select(p => {
        return {
          name: p.name,
          balance: p.balance
        }
      }).ToArray()
    }
    this.history.Add(h);

    this.SaveToLocal();
  }
}
