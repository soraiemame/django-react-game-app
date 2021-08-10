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
            wolf_theme: null,
            others_theme: null,
        };
    }
    update = async () => {
        try{
            const room = await axios.get("/api/word-wolf/get-room");
            const theme = await axios.get("/api/word-wolf/get-theme");
            const users_room = await axios.get("/api/word-wolf/user-in-room");
            const room_data = room.data;
            const theme_data = theme.data;
            this.setState({
                wolf_num: room_data.wolf_num,
                player_num: room_data.player_num,
                cur_num: room_data.cur_num,
                game_ended: room_data.game_ended,
                my_theme: theme_data.theme,
                is_users_room: users_room.data.code === this.code,
            });
            if(room_data.wolf_theme !== undefined) {
                this.setState({ wolf_theme: room_data.wolf_theme, others_theme: room_data.others_theme });
            }
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
    render_before_start = () => {
        return (
            <div>
                <h1>Room: {this.code}</h1>
                <p>Waiting for people...  {this.state.cur_num} / {this.state.player_num}</p>
                <Button onClick={this.handle_leave} variant="contained" color="primary">Leave</Button>
            </div>
        );
    }
    render_during_game = () => {
        return (
            <div>
                <h1>Room: {this.code}</h1>
                <h2>Find the wolf!!</h2>
                <p>Your theme: {this.state.my_theme}</p>
                <Button onClick={this.handle_end} variant="contained" color="secondary">End</Button>
            </div>
        );
    }
    render_after_game = () => {
        return (
            <div>
                <h1>Room: {this.code}</h1>
                <h2>Game Ended!!</h2>
                <p>Your theme: {this.state.my_theme}</p>
                <p>Wolf's theme: {this.state.wolf_theme}</p>
                <p>Others' theme: {this.state.others_theme}</p>
                <Button onClick={this.handle_leave} variant="contained" color="primary">Leave</Button>
            </div>
        );
    }
    render() {
        if(this.state.is_users_room === true) {
            if(this.state.game_ended) return this.render_after_game();
            else if(this.state.player_num === this.state.cur_num) return this.render_during_game();
            else return this.render_before_start();
        }
        else if(this.state.is_users_room === false) {
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
