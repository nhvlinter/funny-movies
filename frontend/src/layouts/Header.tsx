import React, { CSSProperties } from 'react';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';
import {AppBar} from '@material-ui/core';
import { GlobalHeader } from '../components/GlobalHeader/GlobalHeader';
import { useStore } from '../stores';
import styles from './Header.module.scss';

export const HeaderView = observer(() => {
    return (
        <AppBar position="fixed" 
        className={classNames(styles.appBar)}>
            <GlobalHeader />
        </AppBar>
    );
});
