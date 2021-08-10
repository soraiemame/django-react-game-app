import React from "react";
import { Link } from "react-router-dom";

export default class Home extends React.Component {
    render() {
        return (
            <div>
                <h1>Home Page</h1>
                <ul>
                    <li><Link to="/word-wolf/create">Create Room</Link></li>
                    <li><Link to="/word-wolf/join">Join Room</Link></li>
                </ul>
            </div>
        );
    }
}