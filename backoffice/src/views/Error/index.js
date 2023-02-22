import React from 'react';
import { Grid, Card, CardContent } from '@material-ui/core';



const Error = () => {

    return (
        <React.Fragment>
            <Grid container>
                <Grid item xs={12}>

                        <Card>
                            <CardContent>
                                ERROR
                            </CardContent>
                        </Card>

                </Grid>

            </Grid>
        </React.Fragment>
    );
};

export default Error;
