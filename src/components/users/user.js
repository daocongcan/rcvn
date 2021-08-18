import React from 'react';
// import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
// import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
// import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
// import Box from '@material-ui/core/Box';
// import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
// import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import AccountCircle from '@material-ui/icons/AccountCircle';
import InputAdornment from '@material-ui/core/InputAdornment';
import LockIcon from '@material-ui/icons/Lock';
import logo from '../../images/logo.JPG';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import axios from "axios";

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    logo: {
        width: '100%'
    },
    error: {
        color: 'red'
    }

}));

export default function User() {
    const classes = useStyles();
    const [state, setState] = React.useState({
        email: "",
        password: "",
        remember: false,
    });
    const [ip, setIp] = React.useState('');
    const [error, setError] = React.useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        
        const API_URL = 'http://localhost:8000/api';
        const headers = {
            "Content-Type": "application/json",
        };

        const urlGetIp = 'https://api.ipify.org'
        axios.get(urlGetIp).then(response => setIp(response.data));

        const parram = { email: state.email, password: state.password, remember: state.remember, ip: ip };

        axios.post(`${API_URL}/login`, parram, { headers })
            .then(response =>  {
                
                    setError(response.data.data.error);
                    if( response.data.data.token ){
                        let token = response.data.data.token;
                        sessionStorage.setItem('token',JSON.stringify(response.data.data));
                        console.log(atob(token.split(".")[1]));
                    }

            });

    }



    function handleChange(event) {
        const value = event.target.value;
        setError('');
        setState({
            ...state,
            [event.target.name]: value
        });
    }

    function handleChecked(event) {
        const value = event.target.checked;
        setState({
            ...state,
            [event.target.name]: value
        });
    }



    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <img className={classes.logo} src={logo} alt="logo" />

                <p>User</p>
            </div>

        </Container>
    );
}