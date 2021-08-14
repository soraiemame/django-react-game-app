import React from "react";
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button
} from "@material-ui/core";
import axios from "../utils/axios";
import { Redirect, Link } from "react-router-dom";


export default class Create extends React.Component {
    constructor() {
        super();
        this.state = {
            player: 3,
            wolf: 1,
            code: null,
        };
    }

    handle_player_change = (e) => {
        this.setState({ player: e.target.value });
        this.setState({ wolf: 1 });
    }
    handle_wolf_change = (e) => {
        this.setState({ wolf: e.target.value });
    }
    handle_create = () => {
        axios.post("/api/word-wolf/create", {
            player_num: this.state.player,
            wolf_num: this.state.wolf
        })
        .then((data) => {
            console.log(data);
            this.setState({ code: data.data.code });
        })
        .catch((error) => {
            console.log(error);
        })
    }
    render() {
        const mx_wolf = [0,0,0,1,1,2,2,3,3,4,4];
        let wv = [];
        for(let i = 1;i <= mx_wolf[this.state.player];i++){
            wv.push(<MenuItem key={i - 1} value={i}>{i}</MenuItem>);
        }
        if(this.state.code) return <Redirect to={`/word-wolf/room/${this.state.code}`} />
        else return (
            <div>
                <Link to="/">Home</Link>
                <h1>Create</h1>
                <p>Select the number of players and wolfs.</p>
                <FormControl style={{ minWidth: 100,paddingRight: 20 }}>
                    <InputLabel id="player">Player</InputLabel>
                    <Select onChange={this.handle_player_change} value={this.state.player}>
                        <MenuItem value={3}>3</MenuItem>
                        <MenuItem value={4}>4</MenuItem>
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={6}>6</MenuItem>
                        <MenuItem value={7}>7</MenuItem>
                        <MenuItem value={8}>8</MenuItem>
                        <MenuItem value={9}>9</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                    </Select>

                </FormControl>

                <FormControl style={{ minWidth: 100,paddingRight: 10 }}>
                    <InputLabel id="wolf">Wolf</InputLabel>
                    <Select onChange={this.handle_wolf_change} value={this.state.wolf}>
                        { wv }
                    </Select>
                </FormControl>
                
                <Button variant="contained" color="primary" onClick={this.handle_create}>Create</Button>
                {this.state.code && <p>{this.state.code}</p>}
            </div>
        );
    }
}