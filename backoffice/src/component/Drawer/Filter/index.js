import React, { useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import {
    ListItem, MenuItem, Select, FormControl, ListItemIcon, ListItemText, List, Divider, Drawer, InputLabel,
    IconButton, Button
} from '@material-ui/core';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    formControl: {
        width: '100%'
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-start',
    }
}));

const estructure = { selectFirst: { name: '', items: [] }, selectSecond: { name: '', items: [] }, }

const DrawerFilter = ({ open, onClose, forms = estructure, onSelectFirst, onSelectSecond, onReset }) => {
    const classes = useStyles();
    const theme = useStyles();
    const [selectFirst, setSelectFirst] = useState('');
    const [selectSecond, setSelectSecond] = useState('');

    const handleClose = () => {
        onClose();
    };

    const handleSelectFirst = (e) => {
        setSelectFirst(e.target.value)
        onSelectFirst(e.target.value)
    };

    const handleSelectSecond = (e) => {
        setSelectSecond(e.target.value)
        onSelectSecond(e.target.value)
    };

    const handleReset = () => {
        setSelectFirst('')
        setSelectSecond('')
        onReset()
    };

    return (
        <div className={classes.root}>
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="right"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}>
                    <IconButton onClick={handleClose}>
                        {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </div>
                <Divider />
                <List>
                    <ListItem>
                        {forms.selectFirst?.name !== '' ? (
                            <FormControl className={classes.formControl} >
                                <InputLabel id="select-first">{forms.selectFirst?.name}</InputLabel>
                                <Select
                                    labelId="select-first"
                                    id="select-first"
                                    value={selectFirst}
                                    onChange={handleSelectFirst}
                                >
                                    {forms.selectFirst?.items.map((first, index) => {
                                        return (
                                            <MenuItem key={index} value={first._id}>
                                                {first.name}
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            </FormControl>
                        ) : <></>}
                    </ListItem>

                    {forms?.selectSecond?.name !== undefined ? (
                        <ListItem>

                            <FormControl className={classes.formControl} >
                                <InputLabel id="select-second">{forms.selectSecond?.name}</InputLabel>
                                <Select
                                    labelId="select-second"
                                    id="select-second"
                                    value={selectSecond}
                                    onChange={handleSelectSecond}
                                >
                                    {forms.selectSecond?.items.map((second, index) => {
                                        return (
                                            <MenuItem key={index} value={second._id}>
                                                {second.name}
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            </FormControl>

                        </ListItem>
                    ) : <></>}

                    <ListItem>
                        <FormControl className={classes.formControl} >
                            <Button
                                variant="contained"
                                color="secondary"
                                className={classes.button}
                                onClick={handleReset}
                                size="small"
                                endIcon={<RotateLeftIcon />}
                            >
                                resetear filtros
                            </Button>
                        </FormControl>
                    </ListItem>
                </List>

            </Drawer>
        </div>
    );
};

export default DrawerFilter;
