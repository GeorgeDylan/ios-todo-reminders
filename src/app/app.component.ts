import { Component } from '@angular/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Storage } from '@ionic/storage-angular';
import * as cordovaSQLiteDriver from 'localforage-cordovasqlitedriver';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    standalone: true,
    imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
    constructor(private storage: Storage) {
        this.initStorage();
    }

    async initStorage() {
        await this.storage.defineDriver(cordovaSQLiteDriver);
        await this.storage.create();
        SplashScreen.hide();
    }
}
