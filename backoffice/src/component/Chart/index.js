import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CanvasJSChart } from 'canvasjs-react-charts'

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    }
}));

const ChartComponent = (props) => {
    const classes = useStyles();
    const { title, chartData, subtitle, label } = props;
    const options = {
        animationEnabled: true,

        title: {
            text: title,
            fontSize: 22,
        },
        axisY: {
            title: subtitle
        },
        toolTip: {
            shared: true
        },
        data: chartData
    }

    return (
        <div className={classes.root}>
            <CanvasJSChart options={options} />
        </div>
    );
};

export default ChartComponent;
