import React from 'react';
import './App.css';
import CodeEditor from './components/CodeEditor';
import ProcessorStatus from './components/ProcessorStatus';
import MemoryDump, { BYTES_PER_ROW } from './components/MemoryDump';
import { Emulator } from '6502-suite';
import { parseNumber } from '6502-suite/util';

const PAGE_SIZE = 0x100;

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
                <h1>6502 Emulator/Assembler/Disassembler</h1>
                <CodeEditor emulator={this.emulator} onLoad={(bytes, addr) => this.loadBytes(bytes, addr)}></CodeEditor>
                <ProcessorStatus ref="processorStatus" emulator={this.emulator} onStep={() => this.updateMemory()}></ProcessorStatus>
                <MemoryDump startAddr={this.state.dumpAddress} memory={this.state.memory} onAddressChange={a => this.addressChanged(a)}></MemoryDump>
            </div>
        );
    }

    /**
     * Updates the bytes that are shown in the memory dump
     */
    updateMemory() {
        this.setState({
            memory: this.emulator.ram.getBytes(this.state.dumpAddress, PAGE_SIZE)
        });
    }

    addressChanged(newAddr: string): any {
        // Normalize address to bytes per row boundary
        let addr = parseNumber(newAddr) || 0;
        addr = Math.floor(addr / BYTES_PER_ROW) * BYTES_PER_ROW;

        this.setState({
            dumpAddress: addr,
            memory: this.emulator.ram.getBytes(addr, PAGE_SIZE)
        });
    }

    loadBytes(bytes: number[], baseAddr: number) {
        this.emulator.load(bytes, baseAddr);
        this.emulator.registers.pc = baseAddr;
        this.addressChanged(baseAddr.toString(10));
        (this.refs.processorStatus as ProcessorStatus).updateState();
    }
}
