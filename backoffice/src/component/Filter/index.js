import React, { useState, useEffect } from 'react';
import {
    Radio,
    FormControl,
    FormLabel,
    FormControlLabel,
    TextField,
    IconButton,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Checkbox,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { es } from 'date-fns/locale';
import { takeZones } from '../../services/configurations.service';
import ReplayIcon from '@material-ui/icons/Replay';
import Search from '../Search';

const useStyles = makeStyles({
    titleFilter: {
        marginRight: 20,
    },
    formControl: {
        marginTop: -8,
    },
    green: {
        color: 'green',
    },
    red: {
        color: 'red',
    },
    blue: {
        color: 'blue',
    },
    yellow: {
        color: 'yellow',
    },
});

export default function FilterComponent({ props, onDate, onStatus, onZone, onReset, onSearch }) {
    const classes = useStyles();
    const [zones, setZones] = useState([]);
    const [selectedValue, setSelectedValue] = useState('');
    const [selectedOne, setSelectedOne] = useState('');
    const [selectedZone, setSelectedZone] = useState('');
    const [date1, SetDate1] = useState(null);
    const [optionOne, setOptionOne] = useState(false);
    const [optionTwo, setOptionTwo] = useState(false);
    const [optionThree, setOptionThree] = useState(false);
    const [optionFour, setOptionFour] = useState(false);
    const [optionFive, setOptionFive] = useState(false);
    const [optionSix, setOptionSix] = useState(false);
    const [postalCode, setPostalCode] = useState('');
    const [pending, setPending] = useState(false);

    useEffect(() => {
        takeZone();
    }, [props]);

    const takeZone = async () => {
        const { status, data } = await takeZones('');
        if (status === 200) {
            setZones(data.results);
        } else {
            console.log(status, data);
        }
    };

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
        changeStatusRadio(event.target.value);
    };

    const handleChangeOne = (event) => {
        setSelectedOne(event.target.value);
        onStatus(event.target.value);
    };

    const handleChangeZone = (event) => {
        setSelectedZone(event.target.value);
        onZone(event.target.value, postalCode);
    };

    const changeStatusRadio = (radio) => {
        setOptionOne(false);
        setOptionTwo(false);
        setOptionThree(false);
        setOptionFour(false);
        setOptionFive(false);
        setOptionSix(false);
        switch (radio) {
            case '1':
                setOptionOne(true);
                break;
            case '2':
                setOptionTwo(true);
                break;
            case '3':
                setOptionThree(true);
                break;
            case '4':
                setOptionFour(true);
                break;
            case '5':
                setOptionFive(true);
                break;
            case '6':
                setOptionSix(true);
                onStatus(0);
                break;
        }
    };

    const handleDate1 = (e) => {
        SetDate1(e);
        onDate(e);
    };

    const handlePostalCode = (event) => {
        setPostalCode(event.target.value);
        onZone(selectedZone, event.target.value);
    };

    const handleReset = () => {
        changeStatusRadio('');
        setSelectedOne('');
        setSelectedZone('');
        SetDate1(null);
        onReset();
    };

    const handlePending = (event) => {
        setPending(!pending);

        var isTrueSet = event.target.value === 'true';
        if (!pending === false) {
            console.log(!pending);
            setSelectedValue('');
            onStatus('');
        } else if (!pending === true) {
            console.log(!pending);
            setSelectedValue(5);
            onStatus(0);
        }
    };

    return (
        <>
            <div>
                <strong className={classes.titleFilter}>Filtra por:</strong>
                <br />
                <Grid container>
                    <Grid item xs={12} sm={10} md={10}>
                        <FormControl className={classes.formControl} component="fieldset" style={{ minWidth: 70, marginRight: 10 }}>
                            <>
                                <InputLabel id="demo-simple-select-label">Estado</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={selectedOne}
                                    label="Estado"
                                    autoWidth
                                    onChange={handleChangeOne}
                                >
                                    <MenuItem value="">
                                        <em>
                                            <b>Seleccione el estado</b>
                                        </em>
                                    </MenuItem>
                                    <MenuItem value={0}>Pendiente</MenuItem>
                                    <MenuItem value={1}>Activo</MenuItem>
                                    <MenuItem value={3}>Rechazado</MenuItem>
                                </Select>
                            </>
                        </FormControl>
                        <FormControl className={classes.formControl} component="fieldset" style={{ minWidth: 70, marginRight: 10 }}>
                            <MuiPickersUtilsProvider locale={es} utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                    autoOk
                                    fullWidth
                                    clearable
                                    id="date_1"
                                    name="date_1"
                                    ampm={false}
                                    value={date1}
                                    onChange={handleDate1}
                                    format="yyyy-MM-dd"
                                    label="Fecha Alta"
                                />
                            </MuiPickersUtilsProvider>
                        </FormControl>
                        <FormControl className={classes.formControl} component="fieldset" style={{ minWidth: 70, marginRight: 10 }}>
                            <>
                                <InputLabel id="demo-simple-select-label">Zonas</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={selectedZone}
                                    label="Zonas"
                                    autoWidth
                                    onChange={handleChangeZone}
                                >
                                    <MenuItem value="">
                                        <em>
                                            <b>Seleccione la zona</b>
                                        </em>
                                    </MenuItem>
                                    {zones.map((item) => (
                                        <MenuItem value={item.id}>{item.name}</MenuItem>
                                    ))}
                                </Select>
                                <TextField
                                    fullWidth
                                    id="postal_code"
                                    name="postal_code"
                                    label="Código postal"
                                    value={postalCode}
                                    onChange={handlePostalCode}
                                />
                            </>
                        </FormControl>

                        <FormControl component="fieldset">
                            <IconButton onClick={handleReset} aria-label="delete" size="small">
                                <ReplayIcon fontSize="inherit" />
                            </IconButton>
                        </FormControl>
                        <br />
                        <FormControl component="fieldset">
                            <Search onSearch={onSearch} />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={2} md={2}>
                        <FormControl className={classes.formControl} component="fieldset">
                            <FormControlLabel
                                value="end"
                                control={
                                    // <Radio checked={selectedValue === '6'} onChange={handleChange} value="6" name="radio-button-demo" />
                                    <Checkbox onChange={handlePending} checked={pending} value={pending} />
                                }
                                label="Solicitudes pendientes"
                            />
                        </FormControl>
                    </Grid>
                </Grid>
            </div>
        </>
    );
}
