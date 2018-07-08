import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { PlayingComponent } from './components/playing/playing.component';
import { PlayerInfoComponent } from './components/player-info/player-info.component';
import { InfoPanelComponent } from './components/info-panel/info-panel.component';

@NgModule({
  declarations: [
    AppComponent,
    PlayingComponent,
    PlayerInfoComponent,
    InfoPanelComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
