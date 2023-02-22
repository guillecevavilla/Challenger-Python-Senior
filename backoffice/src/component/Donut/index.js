import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CanvasJSChart } from 'canvasjs-react-charts';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    }
}));

const DonutComponent = (props) => {
    const classes = useStyles();
    const { title, chartData, subtitle, label } = props;
    const options = {
        animationEnabled: true,
        title: {
            text: title,
            fontSize: 22,
            marginTop: '10px'
        },
        subtitles: [{
            text: subtitle,
            verticalAlign: "center",
            fontSize: 20,
            dockInsidePlotArea: true
        }],
        data: [{
            type: "doughnut",
            showInLegend: true,
            indexLabel: "{name}: {y}",
            yValueFormatString: "#,###'" + label + "'",
            dataPoints: chartData
        }]
    }

    return (
        <div className={classes.root}>
            <CanvasJSChart options={options} />
        </div>
    );
};

export default DonutComponent;
