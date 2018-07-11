import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { List } from 'linqts'
import { IPlayer, ILand } from '../models/_index';


@Injectable({
  providedIn: 'root'
})
export class DataSourceService {


  constructor(private http: HttpClient) {
  }

  private getError(error: HttpResponse<any>): Observable<any> {
    console.log(error);
    return Observable.throw(error || 'Server Error');
  }

  public GetPlayersAndLands(): Observable<{ players: IPlayer[], lands: ILand[] }> {
    return forkJoin(this.GetPlayers(), this.GetLands()).pipe(
      map(r => { return { players: r[0], lands: r[1] } })
    )
  }

  public GetPlayers(): Observable<IPlayer[]> {
    return this.http.get('/assets/data/players.json').pipe(
      catchError(this.getError),
      map(players => {
        players.forEach(p => {
          p.index = Number(p.index)
          p.balance = Number(p.balance)
          p.lands = new List<ILand>([])
        })
        return players;
      })
    )
  };

  public GetLands(): Observable<ILand[]> {
    return this.http.get('/assets/data/lands.json').pipe(
      catchError(this.getError),
      map(lands => {
        lands.forEach(l => {
          l.index = Number(l.index)
          l.value = Number(l.value)
          l.costs = new List(l.costs).Select(c => Number(c)).ToArray()
        });
        return lands;
      })
    )
  };
}
