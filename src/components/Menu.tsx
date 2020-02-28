import * as React from 'react';
import Help from './Help';

export type MenuProps = {
}

export type MenuState = {
    isHelpVisible: boolean;
}

export default class Menu extends React.Component<MenuProps, MenuState> {
    constructor(props: MenuProps) {
        super(props);

        this.state = {
            isHelpVisible: false
        };
    }

    public render() {
        return (
            <div className="main-menu">
                <button title="Show/hide Help" onClick={() => this.helpClicked()}>?</button>
                <Help isVisible={this.state.isHelpVisible}></Help>
            </div>
        );
    }

    helpClicked(): void {
        this.setState({
            isHelpVisible: !this.state.isHelpVisible
        })
    }
}
