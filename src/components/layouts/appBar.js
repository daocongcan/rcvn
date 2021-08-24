import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import logo from '../../images/logo.JPG';
import Box from '@material-ui/core/Box';
import AccountCircle from '@material-ui/icons/AccountCircle';
import IconButton from '@material-ui/core/IconButton';
import {
    // BrowserRouter as Router,
    // Switch,
    // Route,
    Link,
    useRouteMatch
} from "react-router-dom";

import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

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
        padding: 9,
        color: 'red',
        fontWeight: 'bold',
        backgroundColor: '#ddd',
        textDecoration: 'none',
        width: 100,
        textAlign: 'center',
        marginRight: 1,
    },
    navActive: {
        color: 'red',
        backgroundColor: '#fff',
    },
}));

export default function Header() {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    

    const isMenuOpen = Boolean(anchorEl);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    

    const handleMenuClose = () => {
        setAnchorEl(null);
        
    };

    const handleLogout = () => {
        handleMenuClose();
        sessionStorage.removeItem("token");
        window.location.href='/login'
    }

    const storageToken = JSON.parse(sessionStorage.getItem('token'))

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
    );


    return (
        <AppBar position="static">
            <Toolbar>
                <Grid container spacing={2} alignItems='center' >
                    <Grid item xs={12} sm={2} style={{display:'flex'}}  >
                        <img alt='logo' className={classes.logo} src={logo} />
                    </Grid>
                    <Grid item xs={12} sm={9} style={{display:'flex'}}   >
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
                    <Grid item xs={6} sm={1}  >
                        {/* <Box display='flex'  >
                            <AccountCircle />
                            <label className={classes.paper}> Admin</label>

                        </Box> */}
                        <IconButton
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            <AccountCircle /> 
                            
                            <label style={{textTransform:'capitalize',fontSize:22}} >{storageToken ? storageToken.name : null}</label>

                        </IconButton>
                        {renderMenu}
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
