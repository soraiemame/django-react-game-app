import React from "react";
import { Button, TextField } from "@material-ui/core";

export default class Join extends React.Component {
    constructor() {
        super();
        this.state = {
            code: "",
        };
    }
    handle_code_change = (e) => {
        this.setState({ code: e.target.value });
    }
    handle_onclick = () => {
        console.log("Join Button Pressed!");
    }
    render() {
        return (
            <div>
                <p>join</p>
                <TextField onChange={this.handle_code_change} label="code" type="text"></TextField>
                <Button onClick={this.handle_onclick} variant="contained" color="primary">Join Room</Button>
            </div>
        );
    }
}