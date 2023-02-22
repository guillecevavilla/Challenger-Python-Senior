import React, { useEffect, useContext, useState } from 'react';
import {
    makeStyles,
    Grid,
    Card,
    CardHeader,
    CardContent,
    Hidden,
    Typography,
    Divider,
    LinearProgress,
    withStyles,
    InputLabel,
} from '@material-ui/core';
import { format, parseISO } from 'date-fns';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

/* component */
import Breadcrumb from '../../../component/Breadcrumb';
import DonutComponent from '../../../component/Donut';
import ChartComponent from '../../../component/Chart';
import ReportCard from './ReportCard';
/* icons */
import { useTheme } from '@material-ui/core/styles';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import AccountCircle from '@material-ui/icons/AccountCircle';
/* api */
import { takeLastRegisterUser, takeCountUser } from '../../../services/statistic.service';
/* constant */
import { gridSpacing } from './../../../store/constant';

const useStyles = makeStyles((theme) => ({

}));


const Default = (props) => {
    const classes = useStyles();
    const theme = useTheme();
    const [chartData2, setChartData2] = useState([]);
    const [counUsers, setCounUsers] = useState([]);

    useEffect(() => {
        takeRegisterLastUser();
        takeUsersCount();
    }, [props]);

    const takeUsersCount = async () => {
        const { status, data } = await takeCountUser();
        if (status === 200) {
            setCounUsers(data);
        }
    };

    const takeRegisterLastUser = async () => {
        const { status, data } = await takeLastRegisterUser();
        if (status === 200) {
            let chart = [];
            let obj1 = {
                type: 'spline',
                name: '',
                showInLegend: true,
                dataPoints: [],
            };
            data.map((item) => {
                obj1.name = format(parseISO(item.created_at__date), 'd MMM yyyy') ;
                obj1.dataPoints.push({ label: format(parseISO(item.created_at__date), 'd MMM yyyy'), y: item.count });
            });
            chart.push(obj1);
            setChartData2(chart);
        }
    };



    return (
        <>
            <Helmet>
                ‍<title>Home - Dashboard seekermacht.com</title>‍
                <meta name="description" content={'Jazzaldia'} />
                <meta property="og:title" content={'Jazzaldia'} />
                <meta property="og:site_name" content="Jazzaldia" />
                <meta property="og:locale" content="es" />
            </Helmet>
            <React.Fragment>
                <Breadcrumb title="">
                    <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
                        Estadísticas
                    </Typography>
                </Breadcrumb>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12}>
                                <Card>
                                    <CardContent>
                                        <ChartComponent title="Usuarios registrados (30 días)" chartData={chartData2} label="€">
                                            {' '}
                                        </ChartComponent>
                                    </CardContent>
                                </Card>
                            </Grid>
      

                            <Grid item sm={4} xs={12}>
                                <ReportCard
                                    primary={counUsers.client ? counUsers.client : 0}
                                    secondary="Clientes"
                                    color={theme.palette.success.main}
                                    footerData={'Clientes registrados'}
                                    iconPrimary={AccountCircle}
                                    iconFooter={TrendingUpIcon}
                                />
                            </Grid> 

                            <Grid item sm={4} xs={12}>
                                <ReportCard
                                    primary={counUsers.creator ? counUsers.creator : 0}
                                    secondary="Creadores"
                                    color={theme.palette.primary.main}
                                    footerData="Clientes de pago"
                                    iconPrimary={AccountCircle}
                                    iconFooter={TrendingUpIcon}
                                />
                            </Grid>

                            <Grid item sm={4} xs={12}>
                                <ReportCard
                                    primary={counUsers.total ? counUsers.total : 0}
                                    secondary="Total"
                                    color={theme.palette.warning.main}
                                    footerData={'Total de clientes'}
                                    iconPrimary={AccountCircle}
                                    iconFooter={TrendingUpIcon}
                                />
                            </Grid>

                        </Grid>
                    </Grid>
                </Grid>
            </React.Fragment>
        </>
    );
};

export default Default;
