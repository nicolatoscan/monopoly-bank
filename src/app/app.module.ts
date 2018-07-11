import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


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
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
