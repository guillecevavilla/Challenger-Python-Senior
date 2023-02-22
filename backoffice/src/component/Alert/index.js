import React from 'react';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const AlertMsg = (props) => {
    const classes = useStyles();
    const { severity, msg } = props;

    return (
        <div className={classes.root}>
            <Alert severity={severity}>{msg}</Alert>
        </div>
    );
};

export default AlertMsg;
