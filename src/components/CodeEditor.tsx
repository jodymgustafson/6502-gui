import * as React from 'react';
import { assemble, disassemble, Emulator } from '6502-suite';
import { byteArrayToHexString, hexStringToByteArray, dasmToString, parseNumber } from '6502-suite/util';
import { HELLO_WORLD } from '../asm-code/hello-world';

const DEFAULT_CODE = HELLO_WORLD;

export interface ICodeEditorProps {
    emulator: Emulator;
    onLoad: (bytes: number[], baseAddr: number) => any;
}

export interface ICodeEditorState {
    code: string;
    bytes: string;
    baseAddr: string;
}

export default class CodeEditor extends React.Component<ICodeEditorProps, ICodeEditorState> {
    constructor(props: ICodeEditorProps) {
        super(props);

        this.state = {
            code: DEFAULT_CODE,
            bytes: "",
            baseAddr: "$0000"
        }
    }

    private get baseAddress(): number { return parseNumber(this.state.baseAddr); }

    public render() {
        return (
            <div className="code-editor">
                <textarea rows={10} cols={40} value={this.state.code} onChange={e => this.onCodeChanged(e)}></textarea>
                <div>
                    <span>*=<input type="text" value={this.state.baseAddr} onChange={e => this.changeBaseAddress(e)}></input></span>
                    <button onClick={e => this.onAssemble(e)}>Assemble >></button>
                    <button onClick={e => this.onDisassemble(e)}>&lt;&lt; Disassemble</button>
                    <button onClick={e => this.onLoad(e)}>Load</button>
                </div>
                <textarea rows={10} cols={22} value={this.state.bytes} onChange={e => this.onBytesChanged(e)}></textarea>
            </div>
        );
    }

    changeBaseAddress(e: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({
            baseAddr: e.target.value
        });
    }

    onLoad(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        this.props.onLoad(hexStringToByteArray(this.state.bytes), this.baseAddress);
    }

    onBytesChanged(e: React.ChangeEvent<HTMLTextAreaElement>): void {
        this.setState({
            bytes: e.target.value
        });
    }

    onCodeChanged(e: React.ChangeEvent<HTMLTextAreaElement>): void {
        this.setState({
            code: e.target.value
        });
    }

    onAssemble(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        try {
            const bytes = assemble(this.state.code, this.baseAddress);
            this.setState({
                bytes: byteArrayToHexString(bytes)
            });
        }
        catch (err) {
            alert(err);
        }
    }

    onDisassemble(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        try {
            const bytes = hexStringToByteArray(this.state.bytes);
            const dasm = disassemble(bytes, this.baseAddress);
            const code = dasmToString(...dasm);
            console.log(code);
            this.setState({
                code: code
            });
        }
        catch (err) {
            alert(err);
        }
    }
}
