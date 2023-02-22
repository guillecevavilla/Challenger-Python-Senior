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
import PeopleOficialModal from '../../component/Modals/PeopleOficial';
import Confirmation from '../../component/Modals/Confirmation';
/* api */
import { takePeople, deletePeople } from '../../services/user.service';
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

const People = (props) => {
    const classes = useStyles();
    const [openAccount, setOpenAccount] = useState(false);
    const [search, setsearch] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState({});
    const [accounts, setAccounts] = useState([]);
    const [maxPage, setMaxPage] = useState(1);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [editAccount, setEditAccount] = useState([]);
    const [idAccount, setIdAccount] = useState('');
    const columns = [
        { id: 'name', label: 'Nombres', align: 'left' },
        { id: 'email', label: 'Correo', align: 'left' },
        { id: 'created_at', label: 'Fecha de creación', align: 'right' },
    ];
    const [openConfirmation, setOpenConfirmation] = useState(false);

    useEffect(() => {
        takeAccounts(limit, page);
    }, [props]);

    const takeAccounts = async (limit, page) => {
        const { status, data } = await takePeople('', {
            page_size: limit,
            page: page,
        });
        if (status === 200) {
            setAccounts(data.results);
            setMaxPage(data.total_pages);
        } else {
            console.log(status, data);
        }
    };

    const handleClose = () => {
        setOpenAccount(false);
        setIdAccount('');
    };

    const handleCloseSnack = () => {
        setIsOpen(false);
    };

    const onRefresh = () => {
        takeAccounts(limit, page);
    };

    const onOpenSnackBar = (msg) => {
        setMessage(msg);
        setIsOpen(true);
    };

    const handleChangePage = (event, value) => {
        takeAccounts(limit, value);
        setPage(value);
    };


    const onSearch = async (value) => {
        const { status, data } = await takePeople(
            '',
            value === '' ? { page_size: 10, page: 1 } : { page_size: 10, page: 1, search: value }
        );
        if (status === 200) {
            setAccounts(data.results);
            setMaxPage(1);
        } else {
            console.log(status, data);
        }
    };


    const onBtnTree = (value) => {
        setEditAccount(value);
        setIdAccount(value.id);
        setOpenAccount(true);
    };

    const handleRefresh = () => {
        onSearch('');
        setsearch(!search);
    };

    const handleOpen = () => {
        setEditAccount({});
        setIdAccount('');
        setOpenAccount(true);
    };

    const onConfirm = async () => {
        const { status, data } = await deletePeople(idAccount);
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
        setIdAccount('');
    };

    const onDelete = (value) => {
        setIdAccount(value);
        setOpenConfirmation(true);
    };

    const handleCloseConfirmation = () => {
        setOpenConfirmation(false);
    };

    return (
        <>
            <Helmet>
                ‍<title>People - dashboard</title>‍
                <meta name="description" content={'People - dashboard'} />
                <meta property="og:title" content={'People - dashboard'} />
                <meta property="og:site_name" content="dashboard" />
                <meta property="og:locale" content="es" />
            </Helmet>
            <React.Fragment>
                <Breadcrumb title="Personas">
                    <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
                        Home
                    </Typography>

                    <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
                        People
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
                                    {accounts?.length > 0 && (
                                        <FullTable
                                            columns={columns}
                                            rows={accounts}
                                            title="Listado de personas"
                                            onBtnTree={onBtnTree}
                                            onDelete={onDelete}
                                        />
                                    )}

                                    {accounts?.length === 0 && (
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
                    <PeopleOficialModal
                        account={editAccount}
                        open={openAccount}
                        onClose={handleClose}
                        onRefresh={onRefresh}
                        onOpenSnackBar={onOpenSnackBar}
                        userid={idAccount}
                        title={"Personas"}
                        typeModal={1}
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

export default People;
