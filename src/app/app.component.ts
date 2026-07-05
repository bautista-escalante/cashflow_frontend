import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { interval } from 'rxjs';

import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit{
  constructor(private api: ApiService) {}

  ngOnInit(): void {
    // despertamos la api
    interval(14 * 60 * 1000).subscribe(() => {
      this.api.get("/").subscribe()
      })
  }
}
