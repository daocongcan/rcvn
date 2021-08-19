import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    hrBorderBottom: {
        borderTop: 'solid',
        borderWidth: 5,
        borderBottom: 0,
        borderLeft: 0,
        borderRight: 0,
        borderColor: '#0000ff99',
    }
}));

export default function Title(props) {
    const classes = useStyles();

    return (
        <Grid item xs={12}>
            <h2 style={{ margin: 0 }} >{props.name}</h2>
            <hr className={classes.hrBorderBottom} />
        </Grid>
    )
}