import React from 'react';
import { BackTop } from 'antd';
import classNames from 'classnames';
import styles from './index.less';

const GlobalFooter = ({ className, copyright }) => {
  const clsString = classNames(styles.globalFooter, className);
  return (
    <div className={clsString}>
      {copyright && <div className={styles.copyright}>{copyright}</div>}

      <BackTop />
    </div>
  );
};

export default GlobalFooter;
