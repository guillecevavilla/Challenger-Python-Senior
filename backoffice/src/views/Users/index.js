import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, FormControl, Grid, IconButton, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import Breadcrumb from '../../component/Breadcrumb';
import ClientProviderModal from '../../component/Modals/PeopleOficial';
import { makeStyles } from '@material-ui/core/styles';
import { gridSpacing } from '../../store/constant';
import Pagination from '@material-ui/lab/Pagination';
import SnackbarAlert from '../../component/Snackbar';
import AlertMsg from '../../component/Alert';
import Search from '../../component/Search';
import Confirmation from '../../component/Modals/Confirmation';
import { Helmet } from 'react-helmet';
import FullTable from '../../component/Tables/FullTable';
import ReplayIcon from '@material-ui/icons/Replay';

/* api */
import { takeAccount, deleteAccount } from '../../services/account.service';

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

const Users = (props) => {
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
    const [openConfirmation, setOpenConfirmation] = useState(false);
    const columns = [
        { id: 'name', label: 'Nombres', align: 'left' },
        { id: 'last_name', label: 'Apellidos', align: 'left' },
        { id: 'email', label: 'Correo', align: 'left' },
        { id: 'status_name', label: 'Estado', align: 'left' },
        { id: 'created_at', label: 'Fecha de creación', align: 'right' },
    ];

    useEffect(() => {
        takeAccounts(limit, page);
    }, [props]);

    const takeAccounts = async (limit, page) => {
        const { status, data } = await takeAccount('', {
            rol: 1,
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

    const handleOpenAccount = () => {
        setEditAccount({});
        setIdAccount('');
        setOpenAccount(true);
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
        const { status, data } = await takeAccount(
            '',

            value === '' ? { rol: 1, page_size: 10, page: 1 } : { rol: 1, page_size: 10, page: 1, search: value }
        );
        if (status === 200) {
            setAccounts(data.results);
            setMaxPage(1);
        } else {
            console.log(status, data);
        }
    };

    const onDelete = (value) => {
        setIdAccount(value);
        setOpenConfirmation(true);
    };

    const onConfirm = async () => {
        const { status, data } = await deleteAccount(idAccount);
        if (status === 200) {
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

    const handleCloseConfirmation = () => {
        setOpenConfirmation(false);
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

    return (
        <>
            <Helmet>
                ‍<title>Cuentas de Usuario - seekermacht.com</title>‍
                <meta name="description" content={'Cuentas de Usuario - seekermacht.com'} />
                <meta property="og:title" content={'Cuentas de Usuario - seekermacht.com'} />
                <meta property="og:site_name" content="seekermacht.com" />
                <meta property="og:locale" content="es" />
            </Helmet>
            <React.Fragment>
                <Breadcrumb title="Usuarios">
                    <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
                        Inicio
                    </Typography>

                    <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
                        Usuarios
                    </Typography>
                </Breadcrumb>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Grid container spacing={gridSpacing}>
                                    <Grid item xs={12} sm={6} md={6}>
                                        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpenAccount}>
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
                                            title="Listado de cuentas de usuarios"
                                            onDelete={onDelete}
                                            onBtnTree={onBtnTree}
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
                    <ClientProviderModal
                        account={editAccount}
                        open={openAccount}
                        onClose={handleClose}
                        onRefresh={onRefresh}
                        onOpenSnackBar={onOpenSnackBar}
                        userid={idAccount}
                    />
                    <Confirmation
                        open={openConfirmation}
                        onClose={handleCloseConfirmation}
                        onConfirm={onConfirm}
                        msg="¿Desea eliminar este usuario?"
                        txtBtn="SI"
                    />
                </Grid>
            </React.Fragment>
            <SnackbarAlert open={isOpen} msg={message.msg} severity={message.severity} duration={4000} onClose={handleCloseSnack} />
        </>
    );
};

export default Users;
