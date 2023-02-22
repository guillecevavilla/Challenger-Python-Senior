import React, { useContext } from 'react';
import { Typography } from '@material-ui/core';

import NavGroup from './NavGroup';

import menuItemAdmin from './../../../../menu-items-admin';

const MenuList = (props) => {

    let navItems = [];
    // if (user.type == 1)
    navItems = menuItemAdmin.items.map((item) => {
        switch (item.type) {
            case 'group':
                return <NavGroup key={item.id} item={item} />;
            default:
                return (
                    <Typography key={item.id} variant="h6" color="error" align="center">
                        Menu Items Error
                    </Typography>
                );
        }
    });

    return navItems;
};

export default MenuList;
