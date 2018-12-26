//プラグイン/モジュールなど ---------------------------------------------------------
import { Component, NgZone, resolveForwardRef } from '@angular/core';
import { NavController, AlertController, Platform, Events } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { File } from '@ionic-native/file';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { IsDispOperation } from '../../../inc/IsDispOperation';
import { BeaconModel } from '../../../inc/BeaconModel';
import { BeaconServices } from '../../../inc/BeaconServices';
import { Global } from '../../../inc/Global';
import { Utils } from '../../../inc/Utils';
import { BeaconData } from '../../../inc/BeaconData';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    private readonly ICON_START: string = "md-play";
    private readonly ICON_STOP: string = "md-pause";
    private readonly CLASS_BUTTON_START: string = "button-start";
    private readonly CLASS_BUTTON_STOP: string = "button-stop";

    beacons: BeaconModel[] = [];
    zone: any;
    icScan: string = "";
    clsButton: string = "";
    strTimeScan: string = "";
    strTitle: string = "TheSeki STARTER";
    isBrowserHidden: boolean = true;

    constructor(
        public alertCtrl: AlertController,
        public navCtrl: NavController,
        public platform: Platform,
        public beaconServ: BeaconServices,
        public events: Events,
        public http: Http,
        private file: File,
        private utils: Utils,
        private diagnostic: Diagnostic,
        private locationAccuracy: LocationAccuracy,
        private iab: InAppBrowser) {

        // required for UI update
        this.zone = new NgZone({ enableLongStackTrace: false });
    }

    ionViewDidEnter() {
        this.beacons = [];
        this.icScan = this.ICON_START;
        this.clsButton = this.CLASS_BUTTON_START;
        Global.isWait = false;

        this.platform.ready().then(() => {
            //Confirm Location
            this.fnc_CheckLocationState().then((isEnable) => {

                //exit application
                if (!isEnable) this.platform.exitApp();

                //Start Application
                if (Global.isInit) {
                    this.beaconServ.fnc_Init().then((isInitialised) => {
                        if (isInitialised) {

                            Global.isInit = false;
                            this.fnc_Init();
                        }
                    });
                }
                else {
                    //Stop scan
                    this.StartOrStopScan(true).then(() => {
                        this.fnc_Init();
                    });
                }
            });

        });
    }

    async fnc_Init() {

        //Clear data
        this.beacons = [];

        //Check bluetooth
        await this.fnc_CheckBluetoothState();

        //Auto Scan
        Global.gAutoScan = this.utils.fnc_GetSetting(Global.SETTING_AUTOSCAN, "true") == "true" ? true : false;;

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

        //Enable scan
        Global.isScanning = !Global.gAutoScan;

        if (Global.gSettingFlg) {
            Global.gSettingFlg = false;
            Global.isScanning = false; //Start scan
        }

        if (Global.gSekiUrl != "") {
            this.isBrowserHidden = false;
        }
        else {
            this.isBrowserHidden = true;
        }

        //Remove event
        this.events.unsubscribe('didRangeBeaconsInRegion');
        this.events.subscribe('didRangeBeaconsInRegion', async (data) => {

            this.beacons = [];
            this.strTimeScan = new DatePipe("en-US").transform(new Date, "yyyy/MM/dd HH:mm:ss");

            //Sort list
            var orderList = data.beacons.sort((a, b): number => {
                if (a.accuracy < b.accuracy) return -1;
                if (a.accuracy > b.accuracy) return 1;
                return
            });

            // update the UI with the beacon list
            this.zone.run(async () => {

                orderList.forEach((beacon) => {

                    var beaconObject = new BeaconModel();
                    beaconObject.uuid = beacon.uuid;
                    beaconObject.major = beacon.major;
                    beaconObject.minor = beacon.minor;
                    beaconObject.rssi = beacon.rssi;
                    beaconObject.tx = beacon.tx;
                    beaconObject.accuracy = beacon.accuracy;

                    this.beacons.push(beaconObject);
                });

                var objBeaconData = new BeaconData();
                objBeaconData.devicename = Global.gDeviceName;
                objBeaconData.beacons = this.beacons;
                objBeaconData.time = this.strTimeScan;

                //Pares object to string
                var jsonData = JSON.stringify(objBeaconData);

                if (Global.gEnableLog && objBeaconData.beacons.length > 0) { //20181221 ANHLD EDIT
                    //Write to json file
                    await this.fnc_WriteToFile(jsonData);

                    //ANHLD_TEMP
                    var temp = {
                        text: jsonData
                    }
                    jsonData = JSON.stringify(temp);
                    //ANHLD_TEMP

                    //Post beacon data to server
                    await this.fnc_SendBeaconData(jsonData).then(
                        (data) => {
                            console.log("fnc_SendBeaconData_ok:" + data);
                        },
                        error => {
                            console.error("fnc_SendBeaconData_error:" + error);
                        });
                }
            });

            //Delay time
            await this.utils.fnc_wait(Global.gDelayTime);
        });

        // Start/Stop scan ibeacon 
        this.btnScan_Clicked();
    }

    fnc_CheckBluetoothState(): Promise<any> {

        let promise = new Promise((resolve, reject) => {
            this.beaconServ.ibeacon.isBluetoothEnabled().then(
                (isEnable) => {
                    if (isEnable == false) {
                        IsDispOperation.IsMessageBox(this.alertCtrl, "BluetoothをONにしますか？", null, "YESNO", null).then(
                            (alertCtrl) => {
                                if (alertCtrl == "YES") {
                                    this.beaconServ.ibeacon.enableBluetooth();
                                }
                                resolve();
                            });
                    }
                    else {
                        resolve();
                    }
                }
            );
        });

        return promise;
    }

    fnc_CheckLocationState(): Promise<any> {
        let promise = new Promise((resolve, reject) => {
            this.diagnostic.isLocationEnabled().then((data) => {
                if (!data) {
                    IsDispOperation.IsMessageBox(this.alertCtrl, "アプリケーションを起動するには、端末の位置情報をＯＮにしてください。", null, "OKCANCEL", null).then((alertCtrl) => {
                        if (alertCtrl == "YES") {
                            //this.diagnostic.switchToLocationSettings();
                            this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_BALANCED_POWER_ACCURACY).then(
                                () => {
                                    console.log('Request successful');
                                    resolve(true);
                                },
                                error => {
                                    console.log('Error requesting location permissions', error);
                                    resolve(false);
                                });
                        }
                        else {
                            resolve(false);
                        }
                    });
                }
                else {
                    resolve(true);
                }
            }, error => {
                resolve(false);
            });
        });

        return promise;
    }

    //POST BeaconData to server
    async fnc_SendBeaconData(data: string): Promise<any> {

        var headersReq = null;
        var options = null;

        if (Global.gEndpoint == "") return;

        //Set header
        headersReq = new Headers({
            'Content-Type': 'application/json'
        });

        //Set option
        options = new RequestOptions({ headers: headersReq });

        return new Promise((resolve, reject) => {
            this.http.post(Global.gEndpoint, data, options)
                .subscribe((data) => {
                    if (data['status'] == 200) {
                        resolve(0);
                    }
                    else {
                        resolve(-1);
                    }
                }, (error) => {
                    resolve(-1);
                });
        });
    }

    //Write JSON data.
    async fnc_WriteToFile(strData: any) {
        var strPath = this.file.externalDataDirectory + "/" + "BeaconData.json";

        await this.file.writeFile(this.file.externalDataDirectory, "BeaconData.json", strData, { replace: true }).then(
            (data) => {
                console.log("createFile_ok" + data);
            },
            (error) => {
                console.error("createFile_error" + error);
            });
    }

    //Start or Stop Scan.
    StartOrStopScan(isStart: boolean): Promise<any> {
        const canLeave = new Promise((resolve, recject) => {
            //Start
            if (isStart == false) {
                this.beaconServ.StartService().then(
                    () => {
                        this.icScan = this.ICON_STOP;
                        this.clsButton = this.CLASS_BUTTON_STOP;
                        this.strTitle = "Scanning";
                        Global.isScanning = true;
                        resolve();
                    },
                    (error) => {
                        resolve();
                    });
            }
            //Stop
            else {
                this.beaconServ.StopService().then(
                    () => {
                        this.beacons = [];
                        this.icScan = this.ICON_START;
                        this.clsButton = this.CLASS_BUTTON_START;
                        this.strTitle = "TheSeki STARTER";
                        Global.isScanning = false;
                        resolve();
                    },
                    (error) => {
                        resolve();
                    });
            }
        });

        return canLeave;
    }

    btnScan_Clicked() {
        this.StartOrStopScan(Global.isScanning);
    }

    btnBrowser_Clicked() {
        if (Global.gSekiUrl != "") {
            var browser = this.iab.create(Global.gSekiUrl);
        }
    }
}
