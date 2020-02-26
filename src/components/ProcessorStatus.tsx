import * as React from 'react';
import {Emulator} from "6502-suite";
import { ExecutionResult } from '6502-suite/emulator/6502cpu';
import { toHexString, dasmToString } from '6502-suite/util';

export interface IProcessorStatusProps {
    emulator: Emulator;
    onStep:  () => any;
}

export interface IProcessorStatusState {
    accumulator: string;
    registerX: string;
    registerY: string;
    flags: string;
    stackPointer: string;
    programCounter: string;
    nextInstruction: string;
    isRunning: boolean;
    cyclesPerSecond: number;
}

export default class ProcessorStatus extends React.Component<IProcessorStatusProps, IProcessorStatusState> {
    get emulator(): Emulator { return this.props.emulator; }

    constructor(props: IProcessorStatusProps) {
        super(props);

        //this.emulator.onStep(result => this.onStepCompleted(result));
        this.emulator.onBatch(cycles => this.onBatchCompleted());
        this.emulator.onStop(reason => this.onStop());

        this.state = {
            accumulator: "00",
            flags: "00000000",
            registerX: "00",
            registerY: "00",
            stackPointer: "00",
            programCounter: "0000",
            nextInstruction: "",
            isRunning: false,
            cyclesPerSecond: this.emulator.cyclesPerSecond
        };
    }

    componentDidMount() {
        this.onReset();
    }

    public render() {
        const isRunning = this.state.isRunning;
        return (
            <div className="status">
                <div className="controls">
                    {!isRunning && <button onClick={() => this.onReset()}>Reset</button>}
                    {!isRunning && <button onClick={() => this.onRun()}>Run</button>}
                    {isRunning && <button onClick={() => this.onStop()}>Stop</button>}
                    {!isRunning && <button onClick={() => this.onStep()}>Step</button>}
                    {this.state.nextInstruction}
                    <div className="info">
                        total cycles: <span>{this.emulator.totalCycles}</span>
                        <br></br>
                        <label>cycles/sec: <input className="code" type="number" min="1" max="9999999" value={this.state.cyclesPerSecond} onChange={e => this.onCpsChange(e)}></input></label>
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th title="Program Counter">PC</th>
                            <th title="Accumulator">A</th>
                            <th title="X Index">X</th>
                            <th title="Y Index">Y</th>
                            <th title="Stack Pointer">SP</th>
                            <th title="Flags">NV-BDIZC</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td title="Click to change PC"><input type="text" value={this.state.programCounter} onChange={e => this.onPcChanged(e)}></input></td>
                            <td title="Accumulator">{this.state.accumulator}</td>
                            <td title="X Index">{this.state.registerX}</td>
                            <td title="Y Index">{this.state.registerY}</td>
                            <td title="Stack Pointer">{this.state.stackPointer}</td>
                            <td title="Flags">{this.state.flags}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }

    onPcChanged(e: React.ChangeEvent<HTMLInputElement>): void {
        const value = parseInt(e.target.value, 16);
        this.emulator.registers.pc = value;
        this.updateState();
    }
    
    onCpsChange(e: React.ChangeEvent<HTMLInputElement>): void {
        this.emulator.cyclesPerSecond = parseInt(e.target.value);
        this.setState({
            cyclesPerSecond: this.emulator.cyclesPerSecond
        });
    }

    onStop(): void {
        this.emulator.halt();
        this.setState({
            isRunning: false
        });
    }

    onRun(): void {
        this.emulator.run();
        this.setState({
            isRunning: true
        });
    }

    onReset(): void {
        this.emulator.reset();
        this.updateState();
    }

    onStep(): void {
        this.emulator.step();
        this.updateState();
    }

    private onStepCompleted(result?: ExecutionResult): any {
        if (!this.state.isRunning) {
            this.updateState();
        }
    }

    private onBatchCompleted(): any {
        this.updateState();
    }

    updateState(): any {
        const regs = this.emulator.registers;
        this.setState({
            accumulator: toHexString(regs.a),
            registerX: toHexString(regs.x),
            registerY: toHexString(regs.y),
            flags: this.toBinaryString(regs.flags),
            stackPointer: toHexString(regs.sp),
            programCounter: toHexString(regs.pc, 2),
            nextInstruction: dasmToString(this.props.emulator.getNextInstruction())
        });
        this.props.onStep();
    }

    private toBinaryString(n: number): string {
        let s = n.toString(2);
        return "0".repeat(8 - s.length) +  s;
    }
}
