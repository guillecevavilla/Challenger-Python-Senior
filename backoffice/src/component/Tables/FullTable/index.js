import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, Button, TableRow, Paper, TableHead } from '@material-ui/core';

import { useTheme } from '@material-ui/core/styles';

/* icon */
import CreateIcon from '@material-ui/icons/Create';
import SyncIcon from '@material-ui/icons/Sync';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import AddIcon from '@material-ui/icons/Add';
import ListIcon from '@material-ui/icons/List';

const useStyles2 = makeStyles({
    table: {
        minWidth: 500,
        marginTop: '20px',
    },
});

export default function FullTable({ title, columns, rows, onDelete, onBtnOne, onBtnTwo, onBtnTree, color }) {
    const classes = useStyles2();
    const theme = useTheme();

    const handleOnClick = (id) => {
        onDelete(id);
    };

    const handleOnBtnOne = (id) => {
        onBtnOne(id);
    };

    const handleOnBtnTwo = (value) => {
        onBtnTwo(value);
    };

    const handleOnBtnTree = (value) => {
        onBtnTree(value);
    };

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label={title}>
                {columns && (
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell key={'TableCell' + column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                )}
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={'TableRow' + row.id}>
                            {columns.map((column, index) => {
                                return (
                                    <React.Fragment key={index}>
                                        <TableCell
                                            key={'TableCell2' + row.id + column.id}
                                            align={column.align}
                                            style={
                                                ({
                                                    minWidth: column.minWidth,
                                                },
                                                color
                                                    ? { color: row[column.id] === 'Pendiente' ? theme.palette.warning.main : '#000' }
                                                    : null)
                                            }
                                        >
                                            {column?.validation === true
                                                ? typeof row[column.id] === 'boolean'
                                                    ? row[column.id]
                                                        ? 'true'
                                                        : 'false'
                                                    : typeof row[column.id] === 'object'
                                                    ? row[column.id]
                                                        ? row[column.id].length
                                                        : ''
                                                    : row[column.id]
                                                : typeof row[column.id] === 'object'
                                                ? Array.isArray(row[column.id])
                                                    ? row[column.id].map((item, index) =>
                                                          row[column.id].length > 1 && index !== row[column.id].length - 1
                                                              ? item.name + ', '
                                                              : item.name
                                                      )
                                                    : JSON.stringify(row[column.id])
                                                : row[column.id]}
                                        </TableCell>
                                    </React.Fragment>
                                );
                            })}
                            <TableCell>
                                {onBtnTree && (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        type="button"
                                        size="small"
                                        className={classes.button}
                                        onClick={() => handleOnBtnTree(row)}
                                    >
                                        <CreateIcon />
                                    </Button>
                                )}
                                {onBtnOne && (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        type="button"
                                        size="small"
                                        className={classes.button}
                                        onClick={() => handleOnBtnOne(row.id)}
                                    >
                                        <AddIcon />
                                    </Button>
                                )}
                                {onBtnTwo && (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        type="button"
                                        size="small"
                                        className={classes.button}
                                        onClick={() => handleOnBtnTwo(row)}
                                    >
                                        <SyncIcon />
                                    </Button>
                                )}
                                {onDelete && (
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        type="button"
                                        size="small"
                                        className={classes.button}
                                        onClick={() => handleOnClick(row.id)}
                                    >
                                        <DeleteOutlineIcon />
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
