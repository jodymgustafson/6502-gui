import * as React from 'react';

export interface IHelpProps {
    isVisible: boolean;
}

export default class Help extends React.Component<IHelpProps> {
    public render() {
        return (
            <div className="help" hidden={!this.props.isVisible}>
                <h3>Help</h3>
                <p>To assemble and run a program</p>
                <ol>
                    <li>Enter 6502 assembly language in the left side text area</li>
                    <li>Enter address where code will be placed in the *= text box</li>
                    <li>Click the Assemble button to generate machine code</li>
                    <li>Click the Load button to load machine code into memory</li>
                    <li>Click the Run or Step button to run the program</li>
                </ol>
                <p>To disassemble machine code</p>
                <ul>
                    <li>Put hex bytes separated by spaces into right text box</li>
                    <li>Enter address where code was placed in memory in the *= text box</li>
                    <li>Click Disassemble button</li>
                </ul>
                <p>Tips</p>
                <ul>
                    <li>Click the Reset button to reset the emulator</li>
                    <li>To change the program counter click the value below PC and enter hex address</li>
                    <li>To change the emulator speed modify the cycles per second (original 6502 = 1000000)</li>
                </ul>
            </div>
        );
    }
}
