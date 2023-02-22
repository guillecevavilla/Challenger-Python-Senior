import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, Button, DialogActions, Grid, Typography, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    btnActions: {
        margin: '10px',
    },
    buttonProgress: {
        marginLeft: '10px'
    },
}));


const Confirmation = ({ open, onClose, onConfirm, msg, txtBtn }) => {
    const classes = useStyles();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(false);
    }, [open]);

    const handleClose = () => {
        onClose();
    };

    const handleConfirm = async () => {
        setIsLoading(true);
        onConfirm();
    }

    return (
        <>
            <Dialog open={open} onClose={handleClose} fullWidth={true} scroll={'paper'} maxWidth="sm" aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Confirmación</DialogTitle>
                <DialogContent dividers={true}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="h4" component="h4"> {msg} </Typography>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions className={classes.btnActions}>
                    <Button type="button" onClick={handleClose} color="secondary">
                        Cerrar
                    </Button>
                    <Button onClick={handleConfirm} variant="contained" color="primary">
                        {txtBtn}
                        {isLoading && <CircularProgress color="secondary" size={24} className={classes.buttonProgress} />}
                    </Button>
                </DialogActions>
                <Divider />
            </Dialog>

        </>
    )
};

export default Confirmation;
