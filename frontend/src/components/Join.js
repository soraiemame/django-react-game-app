import React from "react";
import { Button, TextField } from "@material-ui/core";
import axios from "../utils/axios";
import { Redirect, Link } from "react-router-dom";

export default class Join extends React.Component {
    constructor() {
        super();
        this.state = {
            code: null,
            has_joined: false,
            is_error: false,
            error: null,
        };
    }
    handle_code_change = (e) => {
        this.setState({ code: e.target.value });
    }
    handle_onclick = () => {
        axios.post("/api/word-wolf/join",{
            code: this.state.code
        })
        .then((data) => {
            console.log(data.data);
            this.setState({ has_joined: true });
        })
        .catch((error) => {
            console.log(error);
            this.setState({ is_error: true, error: "Room not found" });
        });
    }
    render() {
        if(this.state.has_joined) return <Redirect to={`/word-wolf/room/${this.state.code}`} />
        else return (
            <div>
                <Link to="/">Home</Link>
                <h1>Join</h1>
                <TextField
                onChange={this.handle_code_change}
                label="code"
                type="text"
                error={this.state.is_error} helperText={this.state.error}
                />
                <Button onClick={this.handle_onclick} variant="contained" color="primary">Join Room</Button>
            </div>
        );
    }
}