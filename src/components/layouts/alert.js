import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import { positions } from '@material-ui/system';
import { Grid } from '@material-ui/core';
import Container from '@material-ui/core/Container';
const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
}));

export default function SimpleAlerts(props) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);

    return (
        
        <Grid item md={12} positions='absolute' >
            <Grid container style={{ marginTop: 10 }} ></Grid>
            <Collapse in={props.alertOpen}>
                <Alert
                    variant="filled" severity="success"
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={props.handleClose}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                >
                    Thành công
                </Alert>
            </Collapse>
            <Grid container style={{ marginTop: 10 }} ></Grid>
        </Grid>
        
    );
}