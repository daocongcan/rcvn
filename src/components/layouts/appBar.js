import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import logo from '../../images/logo.JPG';
import Box from '@material-ui/core/Box';
import AccountCircle from '@material-ui/icons/AccountCircle';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch
} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    logo: {
        width: '100%'
    },
    formControl: {
        // margin: theme.spacing(1),
        minWidth: 120,
    },
    nav: {
        padding:9,
        color:'red',
        fontWeight:'bold',
        backgroundColor: '#ddd',
        textDecoration: 'none',
        width:100,
        textAlign:'center',
        marginRight:1,
    },
    navActive: {
        color:'red',
        backgroundColor: '#fff',
    },
}));

export default function Header() {
    const classes = useStyles();

    return (
        <AppBar position="static">
            <Toolbar>
                <Grid container spacing={2} >
                    <Grid item xs={12} sm={2}>
                        <img className={classes.logo} src={logo} />
                    </Grid>
                    <Grid item xs={12} sm={9} display="flex"  >
                        <Box display="flex" flexDirection="row" >
                            <LinkCustom
                                activeOnlyWhenExact={true}
                                to="/customer"
                                label="Khách hàng"
                            />
                            <LinkCustom to="/products" label="Sản phẩm" />
                            <LinkCustom to="/users" label="Users" />
                        </Box>
                    </Grid>
                    <Grid item xs={6} sm={1}>
                        <Box display='flex' >
                            <AccountCircle />
                            <label className={classes.paper}> Admin</label>
                        </Box>
                    </Grid>

                </Grid>
            </Toolbar>
        </AppBar>
    )
}

function LinkCustom({ label, to, activeOnlyWhenExact }) {
    let match = useRouteMatch({
        path: to,
        exact: activeOnlyWhenExact
    });
    let classes = useStyles();
    return (
            <Link className={`${classes.nav}  ${match ? classes.navActive : ''} `} to={to}>{label}</Link>
    );
}
