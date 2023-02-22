import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
}));

const SnackbarAlert = ({ severity, msg, open, duration , onClose }) => {
    const classes = useStyles();
    const handleClose = (event, reason) => {
        onClose();
    };

    return (
        <div className={classes.root}>
            <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={open} autoHideDuration={duration} onClose={handleClose}>
                <Alert onClose={handleClose} severity={severity}>
                    {msg}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default SnackbarAlert;
