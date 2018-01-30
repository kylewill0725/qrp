export class OrderCollection {
    orderGroups: OrderGroup[];

    constructor(public groupSize: number = 5) {
        this.orderGroups = [new OrderGroup(this.groupSize)]
    }

    get totalPlat(): number {
        return this.orderGroups.map(g => g == null ? 0 : g.totalPlat)
            .reduce((prevPlat, plat) => prevPlat + plat);
    }

    get totalDucats(): number {
        return this.orderGroups.map(g => g == null ? 0 : g.totalDucats)
            .reduce((prevDucats, ducats) => prevDucats + ducats);
    }

    add(order: Order) {
        for (let i = 0; i < order.quantity; i++) {
            let orderItem: OrderItem = order.item;
            do {
                for (let i = 0; i < this.orderGroups.length; i++) {
                    if (this.orderGroups[i].canAdd(orderItem)) {
                        orderItem = this.orderGroups[i].add(orderItem);
                        break;
                    }
                    if (i == this.orderGroups.length - 1) {
                        this.orderGroups.push(new OrderGroup(this.groupSize));
                    }
                }
            } while (orderItem != null);
        }
    }

    public listItems(): {quantity: number, price: number, ducats: number}[] {

        return [];
    }
}

export class OrderGroup {
    items: OrderItem[]; //Sorted from most ducats to least

    get lastItem() {
        return this.items[this.items.length - 1];
    }

    constructor(size: number) {
        this.items = new Array(size);
    }

    canAdd(item: OrderItem): boolean {
        return this.lastItem == null ||
            item.ducats > this.lastItem.ducats;
    }

    add(item: OrderItem): OrderItem {
        if (this.lastItem == null) {
            this.insert(item);
        } else if (item.ducats > this.lastItem.ducats) {
            let extraItem = this.lastItem;
            this.insert(item);
            return extraItem;
        }
        return null;
    }

    get totalDucats(): number {
        return this.items.map(i => i == null ? 0 : i.ducats).reduce((prevDucats, ducats) => {
            return prevDucats + ducats;
        })
    }

    get totalPlat(): number {
        return this.items.map(i =>
            i == null ? 0 : i.plat
        ).reduce((prevPlat, plat, index, array) => {
            return prevPlat + plat;
        })
    }

    public insert(item: OrderItem) {
        let targetIndex = this.items.findIndex(i => {
            return i == null || i.ducats < item.ducats;
        });
        for (let i = this.items.length-2; i >= targetIndex; i--) {
            this.items[i+1] = this.items[i];
        }
        this.items[targetIndex] = item;
    }

    public listItems(): {name: string, quantity: number, price: number, ducats: number}[] {
        let items = new Map<string, {quantity: number, ducats: number, plat: number}>();
        for (let item of this.items) {
            if (item == null) continue;
            if (items.get(item.name) == null) {
                items.set(item.name, {
                    quantity: 1,
                    ducats: item.ducats,
                    plat: item.plat
                });
            } else {
                items.get(item.name).quantity += 1;
            }
        }
        return Array.from(items.keys()).map(i => { return {
            name: i,
            quantity: items.get(i).quantity,
            price: items.get(i).plat,
            ducats: items.get(i).ducats
        }; });
    }

    public toString(): string {
        return this.listItems().map((i, a,b) => `${i.quantity}x ${i.name}: ${i.price * i.quantity}:platinum:`).join(', ');
    }
}

export class Order {
    constructor(public user:string, public item:OrderItem, public quantity:number) {
    }

    get plat() {
        return this.item.plat * this.quantity;
    }

    get ducats() {
        return this.item.ducats * this.quantity;
    }

    get itemName() {
        return this.item.name;
    }
}

export class OrderItem {
    constructor(public name: string, public plat: number, public ducats: number) {
    }
}