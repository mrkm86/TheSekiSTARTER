import { DatePipe } from "@angular/common";
import { BeaconModel } from "./BeaconModel";

export class BeaconData {
    time: string;
    devicename: string;
    beacons: BeaconModel[];

    constructor() {
        this.time = new DatePipe("en-US").transform(new Date,"yyyy/MM/dd HH:mm:ss");
        this.devicename = "";
        this.beacons = [];
    }
}