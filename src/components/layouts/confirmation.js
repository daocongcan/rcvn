import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { Box } from '@material-ui/core';
const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function ConfirmationDialogs(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog onClose={props.handleClose} aria-labelledby="customized-dialog-title" open={props.confimOpen}>
        <DialogTitle id="customized-dialog-title" onClose={props.handleClose}>
          <Box display='flex' alignItems='center' >
            <ErrorOutlineIcon color='secondary' />
            Th??ng B??o
          </Box>

        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            {props.content} <b> {props.nameDelete} </b> kh??ng
          </Typography>
        </DialogContent>
        <DialogActions>
          
          <Button
							type="submit"
							variant="contained"
							color="secondary"
              onClick={props.handleClose}
						>
							H???y
						</Button>
          
          
          <Button
							type="submit"
							variant="contained"
							color="primary"
              onClick={props.handleOK}
						>
							OK
						</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}