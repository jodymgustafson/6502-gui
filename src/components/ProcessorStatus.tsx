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
                <div>
                    <div className="controls">
                        {!isRunning && <button onClick={() => this.onReset()}>Reset</button>}
                        {!isRunning && <button onClick={() => this.onRun()}>Run</button>}
                        {isRunning && <button onClick={() => this.onStop()}>Stop</button>}
                        {!isRunning && <button onClick={() => this.onStep()}>Step</button>}
                        {this.state.nextInstruction}
                        <br></br>
                        total cycles: <span>{this.emulator.totalCycles}</span>
                        <br></br>
                        <label>cycles/sec <input type="number" min="1" max="9999999" value={this.state.cyclesPerSecond} onChange={e => this.onCpsChange(e)}></input></label>
                    </div>
                    <div className="names">
                        <span title="Accumulator">A</span>
                        <span title="X Index">X</span>
                        <span title="Y Index">Y</span>
                        <span title="Stack Pointer">SP</span>
                        <span title="Program Counter">PC</span>
                        <span title="Flags">NV-BDIZC</span>
                    </div>
                    <div className="values">
                        <span>{this.state.accumulator}</span>
                        <span>{this.state.registerX}</span>
                        <span>{this.state.registerY}</span>
                        <span>{this.state.stackPointer}</span>
                        <span>{this.state.programCounter}</span>
                        <span>{this.state.flags}</span>
                    </div>
                </div>
            </div>
        );
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

    private updateState(): any {
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
