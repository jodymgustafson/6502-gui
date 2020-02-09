import React from 'react';
import './App.css';
import CodeEditor from './components/CodeEditor';
import ProcessorStatus from './components/ProcessorStatus';
import MemoryDump from './components/MemoryDump';
import { Emulator } from '6502-suite';
import { parseNumber } from '6502-suite/util';

export interface IAppProps {
}

export interface IAppState {
    memory: number[];
    dumpAddress: number;
}

export default class App extends React.Component<IAppProps, IAppState> {
    private emulator = new Emulator(100);
    
    constructor(props: IAppProps) {
        super(props);

        this.state = {
            memory: this.emulator.ram.getBytes(0, 0xFF),
            dumpAddress: 0
        };
    }

    public render() {
        return (
            <div className="App">
                <h1>6502 Emulator</h1>
                <CodeEditor emulator={this.emulator} onLoad={(bytes, addr) => this.loadBytes(bytes, addr)}></CodeEditor>
                <ProcessorStatus emulator={this.emulator} onStep={() => this.updateMemory()}></ProcessorStatus>
                <MemoryDump startAddr={this.state.dumpAddress} memory={this.state.memory} onAddressChange={a => this.dumpAddressChanged(a)}></MemoryDump>
            </div>
        );
    }

    updateMemory() {
        this.setState({
            memory: this.emulator.ram.getBytes(this.state.dumpAddress, 0x100)
        });
    }

    dumpAddressChanged(a: string): any {
        let n = parseNumber(a) || 0;
        n = Math.floor(n / 8) * 8;

        this.setState({
            dumpAddress: n,
            memory: this.emulator.ram.getBytes(n, 0x100)
        });
    }

    loadBytes(bytes: number[], baseAddr: number) {
        this.emulator.load(bytes, baseAddr);
        this.updateMemory();
    }
}
