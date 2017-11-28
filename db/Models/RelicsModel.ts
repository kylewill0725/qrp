import {IMain, IDatabase} from 'pg-promise';
import {ItemDrop, Relic} from "../../relic";
import {Query} from "pg-promise/typescript/pg-subset";

export class RelicsModel {

    private db: IDatabase<any>;
    private pgp: IMain;
    private queueLock: boolean = false;
    private changeQueue: Array<Function>;

    constructor(db: any, pgp: IMain) {
        this.db = db;
        this.pgp = pgp;
    }

    private addToQueue(fnCall: Function, ctx: any, params: Array<any>) {

    }

    private executeNextQueue() {
        this.queueLock = true;
        (new Promise((resolve, reject) => {
            let fn = this.changeQueue[0];
            this.changeQueue.shift();
            try {
                resolve(fn());
            } catch (e) {
                reject(e);
            }
        })).then((result) => {
            this.queueLock = false;
            if (this.changeQueue.length > 0) {
                this.executeNextQueue();
            }
        }).catch((err) => {
            console.log(err);
            throw err;
        });
    }

    addRelic(relic: Relic) : void {
        this.changeQueue.push(functionCall((relic: Relic) => {

        }, this, [relic]));
    }

    addRelicDrop(relicEra: string, relicType: string, itemDrops: ItemDrop[]) : boolean {
        return false;
    }

    changeRelic(relicEra: string, relicType: string, newRelic) : boolean {
        return false;
    }

    changeRelicDrop(relicEra: string, relicType: string, oldItemDropName: string, newItemDrop: ItemDrop) : boolean {
        return false;
    }

    removeRelic(relicEra: string, relicType: string) : boolean {
        return false;
    }

    removeRelicDrop(relicEra: string, relicType: string, itemDropName: string) : boolean {
        return false;
    }
}