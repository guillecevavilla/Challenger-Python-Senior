import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, Button, Icon, TableRow, Paper, IconButton, TableHead } from '@material-ui/core';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

const useStyles1 = makeStyles((theme) => ({
    root: {
        flexShrink: 0,
        marginLeft: theme.spacing(2.5),
    },
    table: {
        marginTop: '20px',
    },
}));

const useStyles2 = makeStyles({
    table: {
        minWidth: 500,
        marginTop: '20px',
    },
});

export default function PaginationTable({ title, columns, rows, onDelete }) {
    const classes = useStyles2();

    const handleOnClick = (id) => {
        onDelete(id);
    };

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label={title}>
                {columns && (
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                )}
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.id}>
                            {columns.map((column) => (
                                <TableCell key={row.id + column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                                    {typeof row[column.id] === 'object' ? (row[column.id] ? row[column.id].length : '') : row[column.id]}
                                </TableCell>
                            ))}
                            <TableCell>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    type="button"
                                    className={classes.button}
                                    onClick={() => handleOnClick(row.id)}
                                >
                                    <DeleteOutlineIcon />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
