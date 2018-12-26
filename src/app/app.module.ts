import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular'; //20180912 ANHLD ADD [Platform]
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { File } from '@ionic-native/file';
import { MyApp } from './app.component';
import { InAppBrowser } from '@ionic-native/in-app-browser';

//共通
import { TabsPage } from '../pages/public/tabs/tabs';
import { HomePage } from '../pages/public/home/home';
import { SettingPage } from '../pages/public/setting/setting';

//個別ページ ---------------------------------------------------------
import { SearchPage } from '../pages/private/search/search';
import { IBeacon } from '@ionic-native/ibeacon';
import { BeaconServices } from '../inc/BeaconServices';
import { Utils } from '../inc/Utils';
import { AppVersion } from '@ionic-native/app-version';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    HomePage,
    SearchPage,
    SettingPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    HomePage,
    SearchPage,
    SettingPage
  ],
  providers: [
      BarcodeScanner,
      AndroidPermissions,
      BeaconServices,
      IBeacon,
      File,
      Utils,
      AppVersion,
      Diagnostic,
      LocationAccuracy,
      InAppBrowser,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
}
