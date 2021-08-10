import React from "react";
import { Redirect } from "react-router-dom";
import axios from "../utils/axios";
import { Button } from "@material-ui/core";

export default class Room extends React.Component {
    constructor() {
        super();
        this.code = location.href.split("/").slice(-1)[0];
        this.state = {
            wolf_num: 0,
            player_num: 0,
            cur_num: 0,
            game_ended: false,
            my_theme: null,
            is_users_room: null,
        };
    }
    update = async () => {
        try{
            const room = await axios.get("/api/word-wolf/get-room");
            const theme = await axios.get("/api/word-wolf/get-theme");
            const users_room = await axios.get("/api/word-wolf/user-in-room");
            const room_data = room.data;
            const theme_data = theme.data;
            // console.log(room_data);
            // console.log(theme_data);
            this.setState({
                wolf_num: room_data.wolf_num,
                player_num: room_data.player_num,
                cur_num: room_data.cur_num,
                game_ended: room_data.game_ended,
                my_theme: theme_data.theme,
                is_users_room: users_room.data.code === this.code,
            });
        }
        catch (error) {
            this.setState({ is_users_room: false });
        }
    }
    componentDidMount() {
        this.interval = setInterval(this.update,1000);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    handle_leave = async () => {
        const res = await axios.get("/api/word-wolf/leave");
        
    }
    handle_end = async () => {
        const res = await axios.get("/api/word-wolf/end");
    }
    render() {
        if(this.state.is_users_room === true) {
            return (
                <div>
                    <h1>Room: {this.code}</h1>
                    <p>My theme: {this.state.my_theme}</p>
                    <p>player_num: {this.state.player_num}</p>
                    <p>wolf_num: {this.state.wolf_num}</p>
                    <p>cur_num: {this.state.cur_num}</p>
                    <p>game_ended: {this.state.game_ended ? "true" : "false"}</p>
                    {
                        this.state.player_num !== this.state.cur_num || this.state.game_ended ?
                        <Button onClick={this.handle_leave} variant="contained" color="primary">Leave</Button> :
                        <Button onClick={this.handle_end} variant="contained" color="secondary">End</Button>
                    }
                </div>
            );
        }
        else if(this.state.is_users_room === false) {
            alert(`You can not Join room ${this.code}.`);
            return (
                <Redirect to="/" />
            );
        }
        else {
            return (
                <h1>Waiting for joining...</h1>
            );
        }
    }
}
