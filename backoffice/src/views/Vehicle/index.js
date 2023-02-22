import React, { useState, useEffect } from 'react';
import {Card, CardContent, FormControl, Grid, IconButton, Typography, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import { Helmet } from 'react-helmet';
import ReplayIcon from '@material-ui/icons/Replay';

/*component */
import SnackbarAlert from '../../component/Snackbar';
import AlertMsg from '../../component/Alert';
import Search from '../../component/Search';
import FullTable from '../../component/Tables/FullTable';
import { gridSpacing } from '../../store/constant';
import Breadcrumb from '../../component/Breadcrumb';
import VehicleManageModal from '../../component/Modals/VehicleManage';
import Confirmation from '../../component/Modals/Confirmation';
/* api */
import { takeVehicle, deleteVehicle } from '../../services/car.service';
/* icon */
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles({
    media: {
        height: 140,
    },
    root: {
        width: '100%',
    },
    marginAlert: {
        marginTop: '20px',
    },
    hide: {
        display: 'none',
    },
});

const Vehicle = (props) => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [search, setsearch] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState({});
    const [info, setInfo] = useState([]);
    const [maxPage, setMaxPage] = useState(1);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [editInfo, setEditInfo] = useState([]);
    const [idInfo, setIdInfo] = useState('');
    const columns = [
        { id: 'placa', label: 'Placa', align: 'left' },
        { id: 'color', label: 'Color', align: 'left' },
        { id: 'branch', label: 'Marca', align: 'left' },
        { id: 'people_name', label: 'Persona', align: 'left' },
        { id: 'created_at', label: 'Fecha de creación', align: 'right' },
    ];
    const [openConfirmation, setOpenConfirmation] = useState(false);

    useEffect(() => {
        takeData(limit, page);
    }, [props]);

    const takeData = async (limit, page) => {
        const { status, data } = await takeVehicle('', {
            rol: 1,
            page_size: limit,
            page: page,
        });
        if (status === 200) {
            setInfo(data.results);
            setMaxPage(data.total_pages);
        } else {
            console.log(status, data);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setIdInfo('');
    };

    const handleCloseSnack = () => {
        setIsOpen(false);
    };

    const onRefresh = () => {
        takeData(limit, page);
    };

    const onOpenSnackBar = (msg) => {
        setMessage(msg);
        setIsOpen(true);
    };

    const handleChangePage = (event, value) => {
        takeData(limit, value);
        setPage(value);
    };


    const onSearch = async (value) => {
        const { status, data } = await takeVehicle(
            '',
            value === '' ? { rol: 1,page_size: 10, page: 1 } : { rol: 1,page_size: 10, page: 1, search: value }
        );
        if (status === 200) {
            setInfo(data.results);
            setMaxPage(1);
        } else {
            console.log(status, data);
        }
    };


    const onBtnTree = (value) => {
        setEditInfo(value);
        setIdInfo(value.id);
        setOpen(true);
    };

    const handleRefresh = () => {
        onSearch('');
        setsearch(!search);
    };

    const handleOpen = () => {
        setEditInfo({});
        setIdInfo('');
        setOpen(true);
    };

    const onConfirm = async () => {
        const { status, data } = await deleteVehicle(idInfo);
        if (status === 204) {
            setOpenConfirmation(false);
            setMessage({ severity: 'success', msg: 'Eliminado con éxito.' });
            setIsOpen(true);
            onRefresh();
        } else {
            setOpenConfirmation(false);
            setMessage({ severity: 'warning', msg: 'Por favor intentelo de nuevo.' });
            setIsOpen(true);
        }
        setIdInfo('');
    };

    const onDelete = (value) => {
        setIdInfo(value);
        setOpenConfirmation(true);
    };

    const handleCloseConfirmation = () => {
        setOpenConfirmation(false);
    };

    return (
        <>
            <Helmet>
                ‍<title>Vehicle - dashboard</title>‍
                <meta name="description" content={'Vehicle - dashboard'} />
                <meta property="og:title" content={'Vehicle - dashboard'} />
                <meta property="og:site_name" content="dashboard" />
                <meta property="og:locale" content="es" />
            </Helmet>
            <React.Fragment>
                <Breadcrumb title="Vehículo">
                    <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
                        Home
                    </Typography>

                    <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
                        Vehicle
                    </Typography>
                </Breadcrumb>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Grid container spacing={gridSpacing}>
                                    <Grid item xs={12} sm={6} md={6}>
                                        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpen}>
                                            Agregar
                                        </Button>
                                    </Grid>
                                    <Grid item xs={12} md={6} align="right">
                                        <Grid container spacing={gridSpacing}>
                                            <Grid item xs={2} sm={11} md={11}>
                                                <Search onSearch={onSearch} value={search} />
                                            </Grid>
                                            <Grid item xs={2} sm={1} md={1}>
                                                <FormControl component="fieldset">
                                                    <IconButton onClick={handleRefresh} aria-label="delete" size="small">
                                                        <ReplayIcon fontSize="inherit" />
                                                    </IconButton>
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid container spacing={gridSpacing}>
                                    {info?.length > 0 && (
                                        <FullTable
                                            columns={columns}
                                            rows={info}
                                            title="Listado de vehículos"
                                            onBtnTree={onBtnTree}
                                            onDelete={onDelete}
                                        />
                                    )}

                                    {info?.length === 0 && (
                                        <Grid item className={classes.marginAlert}>
                                            <AlertMsg severity="info" msg="No se encontrarón datos" />
                                        </Grid>
                                    )}

                                    <Grid container direction="row" justify="center" alignItems="center">
                                        <Pagination count={maxPage} page={page} onChange={handleChangePage} color="primary" />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    <VehicleManageModal
                        vehicle={editInfo}
                        open={open}
                        onClose={handleClose}
                        onRefresh={onRefresh}
                        onOpenSnackBar={onOpenSnackBar}
                        userid={idInfo}
                    />
                    <Confirmation
                        open={openConfirmation}
                        onClose={handleCloseConfirmation}
                        onConfirm={onConfirm}
                        msg="¿Desea eliminar este registro?"
                        txtBtn="SI"
                    />
                </Grid>
            </React.Fragment>
            <SnackbarAlert open={isOpen} msg={message.msg} severity={message.severity} duration={4000} onClose={handleCloseSnack} />
        </>
    );
};

export default Vehicle;
