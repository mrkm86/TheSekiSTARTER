export class BeaconModel {

    uuid: string;
    major: number;
    minor: number;
    rssi: number;
    tx: number;
    accuracy: number;

    constructor() {
        this.uuid = "";
        this.major = 0;
        this.minor = 0;
        this.rssi = 0;
        this.tx = 0;
        this.accuracy = 0;
    }
}