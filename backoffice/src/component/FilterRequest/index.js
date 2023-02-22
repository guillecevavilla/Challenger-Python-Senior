import React, { useState, useEffect } from 'react';
import {
    Radio,
    FormControl,
    FormLabel,
    FormControlLabel,
    TextField,
    IconButton,
    Select,
    MenuItem,
    InputLabel,
    Container,
    Grid,
    Checkbox,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { es } from 'date-fns/locale';
import { takeZones, takeSector } from '../../services/configurations.service';
import ReplayIcon from '@material-ui/icons/Replay';
import Search from '../../component/Search';

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

export default function FilterRequestComponent({
    props,
    onDate,
    onStatus,
    onZone,
    onSector,
    onReset,
    onSearchClient,
    onSearchProvider,
    onRequestPending,
}) {
    const classes = useStyles();
    const [zones, setZones] = useState([]);
    const [sector, setSector] = useState([]);
    const [selectedValue, setSelectedValue] = useState(null);
    const [selectedOne, setSelectedOne] = useState(null);
    const [selectedZone, setSelectedZone] = useState(null);
    const [selectedSector, setSelectedSector] = useState(null);
    const [date1, SetDate1] = useState(null);
    const [optionOne, setOptionOne] = useState(null);
    const [optionTwo, setOptionTwo] = useState(null);
    const [optionThree, setOptionThree] = useState(null);
    const [optionFour, setOptionFour] = useState(null);
    const [optionFive, setOptionFive] = useState(null);
    const [optionSix, setOptionSix] = useState(null);
    const [optionSeven, setOptionSeven] = useState(null);
    const [optionEight, setOptionEight] = useState(null);
    const [postalCode, setPostalCode] = useState('');
    const [pending, setPending] = useState(false);
    const [urgent, setUrgent] = useState(false);

    useEffect(() => {
        takeZone();
        takeSectors();
    }, [props]);

    const takeZone = async () => {
        const { status, data } = await takeZones('');
        if (status === 200) {
            setZones(data.results);
        } else {
            console.log(status, data);
        }
    };

    const takeSectors = async () => {
        const { status, data } = await takeSector('?sub=true');
        if (status === 200) {
            setSector(data.results);
        } else {
            console.log(status, data);
        }
    };

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
        changeStatusRadio(event.target.value);

        if (event.target.value === 5) {
            onRequestPending(event.target.value);
        }
    };

    const handlePending = (event) => {
        setPending(!pending);
        setUrgent(false);

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
    const handleUrgent = (event) => {
        setUrgent(!urgent);
        setPending(false);

        var isTrueSet = event.target.value === 'true';
        if (!urgent === false) {
            console.log(!urgent);
            setSelectedValue('');
            onStatus('');
        } else if (!urgent === true) {
            console.log(!urgent);
            setSelectedValue(5);
            onStatus(0);
        }
    };

    const handleChangeOne = (event) => {
        console.log(event.target.value);
        setSelectedOne(event.target.value);
        onStatus(event.target.value);
        if (event.target.value !== '') {
            setPending(null);
        }
    };

    const handleChangeZone = (event) => {
        setSelectedZone(event.target.value);
        onZone(event.target.value, postalCode);
        if (event.target.value !== '') {
            setPending(null);
        }
    };

    const handleChangeSector = (event) => {
        setSelectedSector(event.target.value);
        onSector(event.target.value);
        if (event.target.value !== '') {
            setPending(null);
        }
    };

    const changeStatusRadio = (radio) => {
        setOptionOne(false);
        setOptionTwo(false);
        setOptionThree(false);
        setOptionFour(false);
        setOptionFive(false);
        setOptionSix(false);
        setOptionSeven(false);
        setOptionEight(false);
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
                onStatus(0);
                break;
            case '6':
                setOptionSix(true);
                break;
            case '7':
                setOptionSeven(true);
                break;
            case '8':
                setOptionEight(true);
                break;
        }
    };

    const handleDate1 = (e) => {
        SetDate1(e);
        onDate(e);
        console.log(e);
        if (e !== null) {
            setPending(null);
        }
    };

    const handlePostalCode = (event) => {
        setPostalCode(event.target.value);
        onZone(selectedZone, event.target.value);
        if (event.target.value !== '') {
            setPending(null);
        }
    };

    const handleReset = () => {
        changeStatusRadio('');
        setSelectedOne('');
        setSelectedZone('');
        setSelectedValue('');
        SetDate1(null);
        onReset();
    };

    const handleSearchClient = async (value) => {
        onSearchClient(value);
    };

    const handleSearchProvider = async (value) => {
        onSearchProvider(value);
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
                                    onChange={handleChangeOne}
                                >
                                    <MenuItem value="">
                                        <em>
                                            <b>Seleccionar estado</b>
                                        </em>
                                    </MenuItem>
                                    <MenuItem value={0}>Pendiente</MenuItem>
                                    <MenuItem value={1}>Revisado</MenuItem>
                                    <MenuItem value={2}>Aprovado</MenuItem>
                                    <MenuItem value={3}>Rechazado</MenuItem>
                                    <MenuItem value={4}>Caducado</MenuItem>
                                </Select>
                            </>
                        </FormControl>

                        <FormControl className={classes.formControl} component="fieldset" style={{ minWidth: 70, marginRight: 10 }}>
                            <>
                                <InputLabel id="demo-simple-select-label">Zonas</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={selectedZone}
                                    label="Zonas"
                                    onChange={handleChangeZone}
                                >
                                    <MenuItem value="">
                                        <em>
                                            <b>Seleccionar zona</b>
                                        </em>
                                    </MenuItem>
                                    {zones.map((item) => (
                                        <MenuItem value={item.id}>{item.name}</MenuItem>
                                    ))}
                                </Select>

                                <Container style={{ marginTop: 10 }}>
                                    <FormControl
                                        className={classes.formControl}
                                        component="fieldset"
                                        style={{ minWidth: 70, marginRight: 10 }}
                                    >
                                        <TextField
                                            fullWidth
                                            id="postal_code"
                                            name="postal_code"
                                            label="Código postal"
                                            value={postalCode}
                                            onChange={handlePostalCode}
                                        />
                                    </FormControl>
                                </Container>
                            </>
                        </FormControl>
                        <FormControl className={classes.formControl} component="fieldset" style={{ minWidth: 70, marginRight: 10 }}>
                            <>
                                <InputLabel id="demo-simple-select-label">Sector</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={selectedSector}
                                    label="Sector"
                                    onChange={handleChangeSector}
                                >
                                    <MenuItem value="">
                                        <em>
                                            <b>Seleccionar sector</b>
                                        </em>
                                    </MenuItem>
                                    {sector.map((item) => (
                                        <MenuItem value={item.id}>{item.name}</MenuItem>
                                    ))}
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
                        <br />
                        <FormControl component="fieldset">
                            <strong className={classes.titleFilter}>Seleccionar Cliente:</strong>

                            <Search onSearch={handleSearchClient}></Search>
                        </FormControl>
                        {/* <br />
                        <FormControl component="fieldset">
                            <strong className={classes.titleFilter}>Seleccionar Proveedor:</strong>

                            <Search onSearch={handleSearchProvider}></Search>
                        </FormControl> */}
                    </Grid>
                    <Grid item xs={12} sm={2} md={2}>
                        <FormControl className={classes.formControl} component="fieldset">
                            <FormControlLabel
                                value="end"
                                control={
                                    // <Radio checked={selectedValue === '4'} onChange={handleChange} value="4" name="radio-button-demo" />
                                    <Checkbox onChange={handleUrgent} checked={urgent} value={urgent} />
                                }
                                label="Urgencia"
                            />
                        </FormControl>

                        <FormControl className={classes.formControl} component="fieldset">
                            <FormControlLabel
                                value="end"
                                control={
                                    // <Radio checked={selectedValue === '5'} onChange={handleChange} value="5" name="radio-button-demo" />
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
