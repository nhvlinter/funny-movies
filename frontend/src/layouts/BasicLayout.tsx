import React, { FC, CSSProperties } from 'react';
import { observer } from 'mobx-react-lite';

import { HeaderView } from './Header';

import styles from './BasicLayout.module.scss';

export const BasicLayout: FC = observer(({ children }) => {
  return (
    <div className={styles.root}>
        <HeaderView />
        <main className={styles.content}>
            {children}
        </main>
    </div>)
});
