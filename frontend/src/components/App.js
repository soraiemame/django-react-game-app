import React from "react";
import {
    BrowserRouter as Router,
    // HashRouter as Router,
    Route,
    Switch,
    Redirect,
} from "react-router-dom";

import Home from "./Home";
import Join from "./Join";
import Create from "./Create";
import Room from "./Room";

import axios from "../utils/axios";

export default class App extends React.Component {
    constructor() {
        console.log("constructor------------------");
        super();
        this.state = {
            code: null,
            game: null
        };
    }
    async componentDidMount() {
        const data = await axios.get("/api/word-wolf/user-in-room");
        console.log(data);
        this.setState({ game: "word-wolf", code: data.data.code });
    }
    render() {
        console.log(this.state);
        return (
            <Router>
                <Switch>
                    <Route exact path="/" render={
                        () => this.state.code === null ? <Home /> : <Redirect to={`/${this.state.game}/room/${this.state.code}`} />
                    } />
                    <Route exact path="/word-wolf/join" component={Join} />
                    <Route exact path="/word-wolf/create" component={Create} />
                    <Route path="/word-wolf/room/:code" component={Room} />
                </Switch>
            </Router>
        );
    }
}
