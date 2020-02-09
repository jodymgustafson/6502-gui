import * as React from 'react';
import { toHexString, byteArrayToHexString } from '6502-suite/util';

const BYTES_PER_ROW = 16;

export interface IMemoryDumpProps {
    startAddr: number;
    memory: number[];
    onAddressChange: (addr: string) => any;
}

export interface IMemoryDumpState {
    startAddr: string;
}

export default class MemoryDump extends React.Component<IMemoryDumpProps, IMemoryDumpState> {
    constructor(props: IMemoryDumpProps) {
        super(props);

        this.state = {
            startAddr: "$" + toHexString(this.props.startAddr, 2)
        };
    }

    public render() {
        const start = this.props.startAddr;
        const memMap = this.createMemMap();

        return (
            <div className="dump">
                <div>
                    <label>Start Address: <input type="text" onChange={e => this.startAddrChanged(e)} value={this.state.startAddr}></input></label> ;
                    <label> Page: <button onClick={() => this.gotoPage(0)}>zero</button>
                    <button onClick={() => this.gotoPage(1)}>stack</button>
                    <button onClick={() => this.incrementPage(1)}>next</button>
                    <button onClick={() => this.incrementPage(-1)}>prev</button></label>
                </div>
                <code>
                    <span className="address">----:  +0 +1 +2 +3 +4 +5 +6 +7 +8 +9 +A +B +C +D +E +F ; 0123456789ABCDEF</span>
                    {memMap.map((x, i) => 
                    <div key={i}>
                        <span className="address">{toHexString(start + i * BYTES_PER_ROW, 2)}:</span>
                        <span>{x[0]}</span> ;
                        <span>{x[1]}</span>
                    </div>)}
                </code>
            </div>
        );
    }

    incrementPage(amount: number): void {
        const newAddr = (this.props.startAddr + amount * 0x100) & 0xFFFF;
        this.gotoPage(newAddr >> 8)
    }

    gotoPage(page: number): void {
        const addr = "$" + toHexString(page * 0x100, 2);
        this.setState({
            startAddr: addr
        });
        this.props.onAddressChange(addr);
    }

    startAddrChanged(e: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({
            startAddr: e.target.value
        });

        this.props.onAddressChange(e.target.value);
    }

    private createMemMap(): string[][] {
        const map = [];
        for (let a = 0; a <= 0xFF; a += BYTES_PER_ROW) {
            const row = this.props.memory.slice(a, a + BYTES_PER_ROW);
            map.push([byteArrayToHexString(row), this.byteArrayToCharString(row)]);
        }
        return map;
    }

    private byteArrayToCharString(bytes: number[]): string {
        return bytes.map(b => b >= 32 && b < 127 ? String.fromCharCode(b) : ".").join("");
    }
}
