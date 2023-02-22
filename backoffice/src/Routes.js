import React, { lazy, Suspense } from 'react';
import { Switch, Route, Redirect, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { GuardProvider, GuardedRoute } from 'react-router-guards';
import Loader from './component/Loader/Loader';
import NavMotion from './layout/NavMotion';
import MainLayout from './layout/MainLayout';
import MinimalLayout from './layout/MinimalLayout';

const Error = lazy(() => import('./views/Error'));
const People = lazy(() => import('./views/People'));
const Oficial = lazy(() => import('./views/Oficial'));
const Vehicle = lazy(() => import('./views/Vehicle'));


const requireLogin = (to, from, next) => {
    next();
};

const Routes = () => {
    const location = useLocation();

    return (
        <AnimatePresence>
            <GuardProvider guards={[requireLogin]} loading={Loader} error={Error}>
                <Suspense fallback={<Loader />}>
                    <Switch>
                        <Redirect exact from="/" to="/people" />
                        <Route path={[]}>
                            <MinimalLayout>
                                <Switch location={location} key={location.pathname}>
                                    <NavMotion></NavMotion>
                                </Switch>
                            </MinimalLayout>
                        </Route>

                        <Route
                            path={[
                                '/people',
                                '/oficial',
                                '/Vehicle',
                            ]}
                        >
                            <MainLayout>
                                <Switch location={location} key={location.pathname}>
                                    <NavMotion>
                                        <GuardedRoute path="/people" component={People} meta={{ auth: true }} />
                                        <GuardedRoute path="/oficial" component={Oficial} meta={{ auth: true }} />
                                        <GuardedRoute path="/Vehicle" component={Vehicle} meta={{ auth: true }} />
                                    </NavMotion>
                                </Switch>
                            </MainLayout>
                        </Route>
                    </Switch>
                </Suspense>
            </GuardProvider>
        </AnimatePresence>
    );
};

export default Routes;
