import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    DialogActions,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    Divider,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useFormik } from 'formik';
import * as yup from 'yup';
import CircularProgress from '@material-ui/core/CircularProgress';

/* component */
import AlertMsg from '../../Alert';
/* api */
import { addAccount, modifyAccount, uploadLogo } from '../../../services/account.service';
import { addReload, modifyReload, uploadPhoto } from '../../../services/reload.service';
import { getCurrentChange } from '../../../services/currentChange.service';

const useStyles = makeStyles((theme) => ({
    formControl: {
        width: '100%',
    },
    btnActions: {
        margin: '10px',
    },
    buttonProgress: {
        marginLeft: '10px',
    },
    imgBanner: {
        width: '150px',
        height: '130px',
        objectFit: 'contain',
        marginTop: '10px',
        marginBottom: '10px',
        backgroundColor: 'gray',
    },
}));

const validationSchema = yup.object({
    name: yup.string().required(),
    description: yup.string().required(),
    price: yup.string().required(),
    coins: yup.string().required(),
});

const ReloadModal = ({ open, onClose, onRefresh, onOpenSnackBar, information }) => {
    const classes = useStyles();
    const [isLoading, setIsLoading] = useState(false);
    const [isOpenAlert, setIsOpenAlert] = useState(false);
    const [messageAlert, setMessageAlert] = useState({});
    const [dataCurrentChange, setDataCurrentChange] = useState();

    useEffect(() => {
        getDataCurrentChange();
        resetForm();
        resetElements();
        if (information?.id !== undefined && information?.id !== '') {
            loadData();
        }
    }, [open]);

    const getDataCurrentChange = async () => {
        const { status, data } = await getCurrentChange();
        if (status == 200) {
            if (data) {
                setDataCurrentChange(data);
            } else {
                setMessageAlert({ severity: 'warning', msg: 'Primero debe crear un valor para el cambio.' });
            }
        }
    };

    const loadData = () => {
        formik.setFieldValue('name', information?.name);
        formik.setFieldValue('description', information?.description);
        formik.setFieldValue('id', information?.id);
        formik.setFieldValue('price', information?.price);
        formik.setFieldValue('coins', information?.coins);
        formik.setFieldValue('photo', information.photo !== '' ? information.photo : null);
        formik.setFieldValue('status', information?.status);
    };

    const resetElements = (e) => {
        setIsLoading(false);
        setIsOpenAlert(false);
        setMessageAlert({});
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const onSubmit = async (values) => {
        setIsOpenAlert(false);
        setIsLoading(true);
        let urlfile = '';
        let statusL;
        if (information?.id !== undefined && information?.id !== '') {
            delete values.photo;
            if (values.file !== '') {
                const formData = new FormData();
                formData.append('photo', values.file);
                formData.append('id', values.id);
                const { status, data } = await uploadPhoto(values.id, formData);
                if (status === 201) {
                    urlfile = values.file.name;
                } else {
                    urlfile = '';
                }
            }
            const { status, data } = await modifyReload(information?.id, values);
            statusL = status;
        } else {
            delete values.id;
            values.photo = null;
            if (dataCurrentChange.id) {
                values.current_change = dataCurrentChange.id;
            }
            const { status, data } = await addReload(values);
            statusL = status;
            if (values.file !== '') {
                const formData = new FormData();
                formData.append('photo', values.file);
                formData.append('id', data.id);
                await uploadPhoto(values.id, formData);
            }
        }
        if (statusL === 200) {
            onOpenSnackBar({ severity: 'success', msg: 'Actualizado correctamente.' });
            setIsLoading(false);
            onRefresh();
            handleClose();
            resetForm();
        } else if (statusL === 201) {
            onOpenSnackBar({ severity: 'success', msg: 'Agregado correctamente.' });
            setIsLoading(false);
            onRefresh();
            handleClose();
            resetForm();
        } else {
            setMessageAlert({ severity: 'warning', msg: 'Por favor intentelo de nuevo.' });
            setIsOpenAlert(true);
            setIsLoading(false);
        }
    };

    const resetForm = async () => {
        formik.handleReset();
    };

    const formik = useFormik({
        initialValues: {
            id: '',
            name: '',
            description: '',
            price: '',
            coins: '',
            photo: null,
            status: 0,
            file: '',
            current_change: null,
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            onSubmit(values);
        },
    });

    return (
        <>
            <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth="sm" aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Paquete de coin</DialogTitle>
                <form encType="multipart/form-data" onSubmit={formik.handleSubmit}>
                    <DialogContent>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="name"
                                    name="name"
                                    label="Paquete"
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                    helpertext={formik.touched.name && formik.errors.name}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="description"
                                    name="description"
                                    label="Descripción"
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    error={formik.touched.description && Boolean(formik.errors.description)}
                                    helpertext={formik.touched.description && formik.errors.description}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    id="price"
                                    name="price"
                                    label="Precio"
                                    value={formik.values.price}
                                    onChange={formik.handleChange}
                                    error={formik.touched.price && Boolean(formik.errors.price)}
                                    helpertext={formik.touched.price && formik.errors.price}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl className={classes.formControl}>
                                    <TextField
                                        fullWidth
                                        id="coins"
                                        name="coins"
                                        label="Cantidad de coins"
                                        value={formik.values.coins}
                                        onChange={formik.handleChange}
                                        error={formik.touched.coins && Boolean(formik.errors.coins)}
                                        helpertext={formik.touched.coins && formik.errors.coins}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography component="p">Imagen</Typography>
                                {formik.values.photo !== '' && formik.values.photo !== null ? (
                                    <img src={formik.values.photo} className={classes.imgBanner} alt={formik.values.photo} />
                                ) : (
                                    <></>
                                )}
                                <FormControl className={classes.formControl}>
                                    <input
                                        id="file"
                                        name="file"
                                        type="file"
                                        onChange={(event) => {
                                            formik.setFieldValue('photo', '');
                                            formik.setFieldValue('file', event.currentTarget.files[0]);
                                        }}
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <FormControl className={classes.formControl}>
                                    <InputLabel id="label-status">Estado</InputLabel>
                                    <Select
                                        labelId="label-status"
                                        id="status"
                                        name="status"
                                        value={formik.values.status}
                                        onChange={formik.handleChange}
                                        error={formik.touched.status && Boolean(formik.errors.status)}
                                        helpertext={formik.touched.status && formik.errors.status}
                                    >
                                        <MenuItem value={0}>Inactivo</MenuItem>
                                        <MenuItem value={1}>Activo</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions className={classes.btnActions}>
                        <Button type="button" onClick={handleClose} color="secondary">
                            Cerrar
                        </Button>
                        <Button type="submit" variant="contained" color="primary" disabled={!dataCurrentChange}>
                            Guardar
                            {isLoading && <CircularProgress color="secondary" size={24} className={classes.buttonProgress} />}
                        </Button>
                    </DialogActions>
                    {isOpenAlert && (
                        <Grid item xs={12}>
                            <AlertMsg severity={messageAlert.severity} msg={messageAlert.msg} />
                        </Grid>
                    )}
                    <Divider />
                </form>
            </Dialog>
        </>
    );
};

export default ReloadModal;
