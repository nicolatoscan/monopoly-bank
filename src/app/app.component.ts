import { Component } from '@angular/core';
import { DataSourceService } from './services/data-source.service';
import { SharedDataService } from './services/shared-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'app';
  loaded = false;

  constructor(
    private dataSourceService: DataSourceService,
    private sharedDataService: SharedDataService
  ) {

    this.dataSourceService.GetPlayersAndLands().subscribe(r => {
      console.log("Dati caricati", r)
      this.sharedDataService.LoadAllForNew(r.players, r.lands);
      this.loaded = true;
    })

  }
  

}
