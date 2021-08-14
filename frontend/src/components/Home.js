import React from "react";
import { Link } from "react-router-dom";
import { Grid, List, ListItem } from "@material-ui/core";



export default class Home extends React.Component {
    render() {
        return (
            <Grid container spacing={1} justifyContent="center">
                <Grid item xs={12}>
                    <h1>Home Page</h1>
                </Grid>
                <Grid item xs={12} justifyContent="center">
                    <List style={{ display: "flex" }}>
                        <ListItem button style={{ display: "flex",justifyContent: "center" }}>
                            <Link to="/word-wolf/create" style={{ textDecoration: "none" }}>Create Room</Link>
                        </ListItem>
                        <ListItem button style={{ display: "flex",justifyContent: "center" }}>
                            <Link to="/word-wolf/join" style={{ textDecoration: "none" }}>Join Room</Link>
                        </ListItem>
                    </List>
                </Grid>
            </Grid>
        );
    }
}