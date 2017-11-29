import {IMain, IDatabase} from 'pg-promise';
import {ItemDrop, Relic} from "../../relic";
import {Query} from "pg-promise/typescript/pg-subset";

export class RelicsModel {

    private db: IDatabase<any>;
    private pgp: IMain;
    private static queueLock: boolean = false;
    private static changeQueue: Array<Function>;

    constructor(db: any, pgp: IMain) {
        this.db = db;
        this.pgp = pgp;
    }

    private addToQueue(fnCall: Function) {
        RelicsModel.changeQueue.push(fnCall);
        if (!RelicsModel.queueLock) {
            this.executeNextQueue();
        }
    }

    private executeNextQueue() {
        RelicsModel.queueLock = true;
        (new Promise((resolve, reject) => {
            let fn = RelicsModel.changeQueue[0];
            RelicsModel.changeQueue.shift();
            try {
                resolve(fn());
            } catch (e) {
                reject(e);
            }
        })).then((result) => {
            RelicsModel.queueLock = false;
            if (RelicsModel.changeQueue.length > 0) {
                this.executeNextQueue();
            }
        }).catch((err) => {
            console.log(err);
            throw err;
        });
    }

    addRelic(relic: Relic) : void {
        this.addToQueue(functionCall((relic: Relic) => {

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