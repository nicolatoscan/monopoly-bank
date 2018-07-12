import { ILand } from './land';
import { List } from 'linqts';

export interface IPlayerLand {
    landProps: ILand,
    houses: number,
    hotels: number,
    mortgaged: boolean,
}

export interface IPlayer {
    index: number
    name: string,
    balance: number,
    lands: List<IPlayerLand>
}

export interface IPlayerExported {
    index: number
    name: string,
    balance: number,
    lands: {
        hotels: number,
        houses: number,
        mortgaged: boolean,
        landPropsIndex: number
    }[]
}

export class Player implements IPlayer {
    public index: number;
    public name: string;
    public balance: number;
    public lands: List<IPlayerLand>;

    constructor(p: IPlayer) {
        this.index = p.index;
        this.name = p.name;
        this.balance = p.balance;
        this.lands = p.lands;
    }

    public HasLand(indexLand: number): boolean {
        return this.lands.Any(l => l.landProps.index == indexLand)
    }

    public BuysLand(land: ILand) {
        if (!this.lands.Any(l => l.landProps.index == land.index)) {
            this.lands.Add({
                houses: 0,
                hotels: 0,
                landProps: land,
                mortgaged: false
            })
        }
    }

    public BuysHouse(land: ILand): boolean {
        let l = this.lands.FirstOrDefault(l => l.landProps == land);
        if (!l || l.houses >= 4 || l.hotels > 0) {
            return false;
        }
        l.houses++;
        return true;
    }
    public BuysHotel(land: ILand): boolean {
        let l = this.lands.FirstOrDefault(l => l.landProps == land);
        if (!l || l.houses != 4 || l.hotels > 0) {
            return false
        }
        l.houses = 0;
        l.hotels = 1;
        return true;
    }

    public HowManyLandsOf(color: string): number {
        return this.lands.Count(l => l.landProps.color == color);
    }

    public ToExportVersion(): IPlayerExported {
        return {
            index: this.index,
            name: this.name,
            balance: this.balance,
            lands: this.lands.Select(l => {
                l.landProps
                return {
                    hotels: l.hotels,
                    houses: l.houses,
                    mortgaged: l.mortgaged,
                    landPropsIndex: l.landProps.index
                }
            }).ToArray()
        }
    }
}