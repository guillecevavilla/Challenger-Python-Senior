import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, Button, DialogActions, Grid, Typography, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

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


const TokenModal = ({ open, onClose, token }) => {
    const classes = useStyles();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(false);
    }, [open]);

    const handleClose = () => {
        onClose();
    };


    return (
        <>
            <Dialog open={open} onClose={handleClose} fullWidth={true} scroll={'paper'} maxWidth="sm" aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">TOKEN</DialogTitle>
                <DialogContent dividers={true}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            {token}
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions className={classes.btnActions}>
                    <Button type="button" onClick={handleClose} color="secondary">
                        Cerrar
                    </Button>
                </DialogActions>
                <Divider />
            </Dialog>

        </>
    )
};

export default TokenModal;
