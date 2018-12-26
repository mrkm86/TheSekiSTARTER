import { Component, ViewChild, Input } from '@angular/core';
import { NavController, TextInput, Toggle, Select } from 'ionic-angular';
import { Global } from '../../../inc/Global';
import { Utils } from '../../../inc/Utils';

@Component({
    selector: 'page-setting',
    templateUrl: 'setting.html'
})
export class SettingPage {
  
    selDelay:any;

    @ViewChild('tgAutoScan') tgAutoScanCtrl: Toggle;
    @ViewChild('tgEnableLog') tgEnableLogCtrl: Toggle;
    @ViewChild('txtLoggingEndpoint') txtLoggingEndpointCtrl: TextInput;
    @ViewChild('txtDeviceName') txtDeviceNameCtrl: TextInput;
    @ViewChild('txtSekiUrl') txtSekiUrlCtrl: TextInput;

    lstDelay = [];
    objDelay = {};

    constructor(
        public navCtrl: NavController,
        private utils: Utils) {
    }

    ionViewWillEnter() {
        //Get data for delay
        this.fnc_GetDataDelay();

        //Set init data.
        this.fnc_InitData();
    }

    ionViewWillLeave() {
        //Auto Scan
        Global.gAutoScan = this.tgAutoScanCtrl._checked;

        //Enable logging
        Global.gEnableLog = this.tgEnableLogCtrl._checked;

        //Delay time
        Global.gDelayTime = parseInt(this.selDelay);

        //Endpoint URI
        Global.gEndpoint = this.txtLoggingEndpointCtrl.value;

        //Device Name
        Global.gDeviceName = this.txtDeviceNameCtrl.value;

        //Seki Url
        Global.gSekiUrl = this.txtSekiUrlCtrl.value;

        this.utils.fnc_SetSetting(Global.SETTING_AUTOSCAN, String(Global.gAutoScan));
        this.utils.fnc_SetSetting(Global.SETTING_ENABLELOGGING, String(Global.gEnableLog));
        this.utils.fnc_SetSetting(Global.SETTING_DELAY, String(Global.gDelayTime));
        this.utils.fnc_SetSetting(Global.SETTING_ENDPOINT, String(Global.gEndpoint));
        this.utils.fnc_SetSetting(Global.SETTING_DEVICENAME, String(Global.gDeviceName));
        this.utils.fnc_SetSetting(Global.SETTING_SEKI_URL, String(Global.gSekiUrl));
    }

    // Init data.
    fnc_InitData(){
        //Auto Scan
        Global.gAutoScan = this.utils.fnc_GetSetting(Global.SETTING_AUTOSCAN, "true") == "true" ? true : false;

        //Enable logging
        Global.gEnableLog = this.utils.fnc_GetSetting(Global.SETTING_ENABLELOGGING, "false") == "true" ? true : false;

        //Delay time
        Global.gDelayTime = parseInt(this.utils.fnc_GetSetting(Global.SETTING_DELAY, "10000"));

        //Endpoint URI
        Global.gEndpoint = this.utils.fnc_GetSetting(Global.SETTING_ENDPOINT, "");

        //Device Name
        Global.gDeviceName = this.utils.fnc_GetSetting(Global.SETTING_DEVICENAME, "");

        //Seki Url
        Global.gSekiUrl = this.utils.fnc_GetSetting(Global.SETTING_SEKI_URL, "");

        //Get version number
        Global.gVersion = this.utils.fnc_GetAppVersionNumber();

        this.tgAutoScanCtrl._checked = Global.gAutoScan;
        this.selDelay = Global.gDelayTime;
        this.tgEnableLogCtrl._checked = Global.gEnableLog;
        this.txtLoggingEndpointCtrl.value = Global.gEndpoint;
        this.txtDeviceNameCtrl.value = Global.gDeviceName;
        this.txtSekiUrlCtrl.value = Global.gSekiUrl;
        Global.gSettingFlg = true;
    }

    //Create data for Delay list.
    fnc_GetDataDelay(){
        this.lstDelay.push({key: 0, value: "連続"});
        this.lstDelay.push({key: 2000, value: "2秒ごと"});
        this.lstDelay.push({key: 5000, value: "5秒ごと"});
        this.lstDelay.push({key: 10000, value: "10秒ごと"});
        this.lstDelay.push({key: 30000, value: "30秒ごと"});
        this.lstDelay.push({key: 600000, value: "1分ごと"});
    }

    cboDelay_onChange(selectedValue:string){
        this.selDelay = selectedValue;
    }
}
