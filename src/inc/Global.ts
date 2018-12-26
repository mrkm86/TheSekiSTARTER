export class Global {
    static SETDB: string = "SET.db";
    static T_SETINI: string = "T_SETINI";
    static g_Tanto: string = "";
    static g_mode: string = "";
    static CurrentControl = null;

    static GDATA = 
        {
            "Data": [],
            "Cnt": 10,
            "PagePos": 20,
            "CsPos": 30,
            "input_flg_Write": 90
        };

    static isInit: boolean;
    static isScanning: boolean;
    static isWait: boolean;

    static gDelayTime: number = 0;
    static gScanTime:number = 1000;
    static gEnableLog: boolean  = false;
    static gAutoScan:boolean  = false;
    static gEnableStartup:boolean  = false;
    static gSettingFlg:boolean  = false;
    static gEndpoint:string  = "";
    static gDeviceName:string  = "";
    static gVersion:string  = "";
    static gAppName:string  = "";
    static gSekiUrl:string  = "";

    static readonly  SETTING_DELAY: string  = "SETTING_DELAY";
    static readonly  SETTING_FREQUENCY: string  = "SETTING_FREQUENCY";
    static readonly  SETTING_AUTOSCAN: string = "SETTING_AUTOSCAN";
    static readonly  SETTING_ENABLESTARTUP: string = "SETTING_ENABLESTARTUP";
    static readonly  SETTING_ENABLELOGGING: string  = "SETTING_ENABLELOGGING";
    static readonly  SETTING_ENDPOINT: string = "SETTING_ENDPOINT";
    static readonly  SETTING_DEVICENAME: string = "SETTING_DEVICENAME";
    static readonly  SETTING_ABOUT: string = "SETTING_ABOUT";
    static readonly  SETTING_SEKI_URL: string = "SETTING_SEKI_URL";
    static readonly  SETTING_KEY: string = "SAKI_STARTER";
}
export class GDATA {
    public Data: string[][];
    public Cnt: number;
    public MaxPage: number;
    public PagePos: number;
    public CsPos: number;

    constructor() {
        this.Data = [];
        this.Cnt = 0;
        this.MaxPage = 0;
        this.PagePos = 0;
        this.CsPos = 0;
    }
}
