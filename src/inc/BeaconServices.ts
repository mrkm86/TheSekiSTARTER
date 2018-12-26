import { Events, Platform } from 'ionic-angular';
import { IBeacon } from '@ionic-native/ibeacon';
import { Injectable } from '@angular/core';
import { Global } from './Global';

declare let window: any;

@Injectable()
export class BeaconServices {

    delegate: any;
    region: any;

    constructor(
        public platform: Platform,
        public ibeacon: IBeacon,
        public events: Events) {
    }

    fnc_Init(): any {

        let promise = new Promise((resolve, reject) => {
            // Request permission to use location on iOS
            this.ibeacon.requestAlwaysAuthorization();

            // create a new delegate and register it with the native layer
            let delegate = this.ibeacon.Delegate();

            // Subscribe to some of the delegate's event handlers
            delegate.didRangeBeaconsInRegion()
                .subscribe(
                    data => {
                        if (Global.isWait == false) {
                            this.events.publish('didRangeBeaconsInRegion', data);
                        }
                    },
                    error => {
                        console.error();
                        resolve(false);
                    }
                );

            var uuidWilcard = window.cordova.plugins.locationManager.BeaconRegion.WILDCARD_UUID;
            this.region = this.ibeacon.BeaconRegion('ibeacon', uuidWilcard);
            resolve(true);
        });

        return promise;
    }

    StartService(): any {
        let promise = new Promise((resolve, reject) => {
            // start ranging
            this.ibeacon.startRangingBeaconsInRegion(this.region).then(
                () => { resolve() }
            );
        });
        return promise;
    }

    StopService(): any {
        let promise = new Promise((resolve, reject) => {
            // stop ranging
            this.ibeacon.stopRangingBeaconsInRegion(this.region).then(
                () => {resolve(); }
            );
        });
        return promise;
    }
}