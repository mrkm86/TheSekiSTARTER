import { Global } from "./Global";
import { AppVersion } from '@ionic-native/app-version';
import { Injectable } from '@angular/core';

@Injectable()
export class Utils {

    constructor(private appVersion: AppVersion) {
    }

    fnc_SetSetting(key: string, value: string) {
        localStorage.setItem(key, value);
    }

    fnc_GetSetting(key: string, defaultValue: string): string {
        var ret = localStorage.getItem(key);
        if (ret == null || ret == undefined) ret = defaultValue;
        return ret
    }

    //Get version number.
    fnc_GetAppVersionNumber(): any {
        return new Promise((resolve, reject) => {
            this.appVersion.getVersionNumber().then(data => {
                resolve(data);
            });
        });
    }

    fnc_wait(time: number): Promise<any> {
        return new Promise(
            resolve => {
                Global.isWait = true;
                setTimeout(function () {
                    Global.isWait = false;
                    resolve();
                }, time)
            });
    }
}