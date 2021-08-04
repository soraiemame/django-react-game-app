import React from "react";
import {
    BrowserRouter as Router,
    Route,
    Switch,
} from "react-router-dom";

import Home from "./Home";
import Join from "./Join";
import Create from "./Create";

export default class App extends React.Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/join" componenet={Join} />
                    <Route path="/create" componenet={Create} />
                </Switch>
            </Router>
        );
    }
}
