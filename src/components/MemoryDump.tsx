import * as React from 'react';
import { toHexString, byteArrayToHexString } from '6502-suite/util';

export const BYTES_PER_ROW = 16;
export const PAGE_SIZE = 0x100;
const MAX_BYTES = 0xFFFF;

export interface IMemoryDumpProps {
    startAddr: number;
    memory: number[];
    onAddressChange: (addr: string) => any;
}

export interface IMemoryDumpState {
}

export default class MemoryDump extends React.Component<IMemoryDumpProps, IMemoryDumpState> {
    constructor(props: IMemoryDumpProps) {
        super(props);

        this.state = {
        };
    }

    public render() {
        const start = this.props.startAddr;
        const startHex = "$" + toHexString(this.props.startAddr, 2);
        const memMap = this.createMemMap();

        return (
            <div className="dump">
                <div>
                    <label>Start Address: <input type="text" onChange={e => this.startAddrChanged(e)} value={startHex}></input></label> ;
                    <label> Page: <button onClick={() => this.gotoPage(0)}>zero</button>
                    <button onClick={() => this.gotoPage(1)}>stack</button>
                    <button onClick={() => this.incrementPage(1)}>next</button>
                    <button onClick={() => this.incrementPage(-1)}>prev</button></label>
                </div>
                <code>
                    <span className="address">----:  +0 +1 +2 +3 +4 +5 +6 +7 +8 +9 +A +B +C +D +E +F ; 0123456789ABCDEF</span>
                    {memMap.map((x, i) => 
                    <div key={i} className="page-row">
                        <span className="address">{toHexString(start + i * BYTES_PER_ROW, 2)}:</span>
                        <span>{x[0]}</span> ;
                        <span>{x[1]}</span>
                    </div>)}
                </code>
            </div>
        );
    }

    incrementPage(amount: number): void {
        const newAddr = (this.props.startAddr + amount * PAGE_SIZE) & MAX_BYTES;
        this.gotoPage(newAddr >> 8)
    }

    gotoPage(page: number): void {
        const addr = "$" + toHexString(page * PAGE_SIZE, 2);
        this.props.onAddressChange(addr);
    }

    startAddrChanged(e: React.ChangeEvent<HTMLInputElement>): void {
        this.props.onAddressChange(e.target.value);
    }

    private createMemMap(): string[][] {
        const map = [];
        for (let a = 0; a < PAGE_SIZE; a += BYTES_PER_ROW) {
            const row = this.props.memory.slice(a, a + BYTES_PER_ROW);
            map.push([byteArrayToHexString(row), this.byteArrayToCharString(row)]);
        }
        return map;
    }

    private byteArrayToCharString(bytes: number[]): string {
        return bytes.map(b => b >= 32 && b < 127 ? String.fromCharCode(b) : ".").join("");
    }
}
