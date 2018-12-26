import { Component } from '@angular/core';
import { HomePage } from '../home/home';
//20181221 ANHLD ADD START
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AlertController } from 'ionic-angular';

import { Global } from '../../../inc/Global';
import { IsDispOperation } from '../../../inc/IsDispOperation';
import { Utils } from '../../../inc/Utils';
//20181221 ANHLD ADD END

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = HomePage;
  //tab2Root: any = SearchPage; //20181221 ANHLD DELETE

  constructor(
    public alertCtrl: AlertController,
    private iab: InAppBrowser,
    private utils: Utils) {
  }

  //20181221 ANHLD ADD START
  btnBrowser_Clicked() {

    //Seki Url
    Global.gSekiUrl = this.utils.fnc_GetSetting(Global.SETTING_SEKI_URL, "");

    if (Global.gSekiUrl == "") {
      IsDispOperation.IsMessageBox(this.alertCtrl, "URLが設定されていません", "エラー", "OK", null);
      return;
    }

    var browser = this.iab.create(Global.gSekiUrl);
  }
  //20181221 ANHLD ADD END
}
