import React from 'react';

import styles from './Logo.module.css';

export const Logo = () => {
  return (
    <div className={styles.logo}>
      <svg
        width='90'
        height='37'
        viewBox='0 0 90 37'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M0 36.8745C0.191898 36.6234 0.383795 36.341 0.607676 36.1213C8.76333 28.0874 16.919 20.0848 25.0746 12.0509C26.3859 10.7642 27.6652 9.47752 28.9765 8.19084C29.6482 7.53181 29.968 7.53181 30.6397 8.19084C32.6226 10.1366 34.6055 12.0823 36.5565 14.028C37.6439 15.095 37.6439 15.0636 38.7313 13.9966C43.2409 9.57167 47.7186 5.17812 52.2281 0.753181C53.2516 -0.25106 53.3795 -0.25106 54.403 0.753181C66.1087 12.2706 77.8145 23.7566 89.5203 35.274C89.5842 35.3367 89.7122 35.3995 89.7441 35.4936C89.8401 35.7447 89.936 35.9958 90 36.2468C89.7122 36.2154 89.3923 36.2468 89.1684 36.0899C83.0277 32.3868 76.887 28.6522 70.7463 24.9177C65.2132 21.5598 59.6482 18.1705 54.1151 14.7812C53.4755 14.4046 53.0917 14.5301 52.58 15.0008C48.3902 18.8923 44.2004 22.7837 40.0107 26.6751C39.435 27.2086 39.0192 27.1773 38.4435 26.6438C35.8529 24.2273 33.1983 21.8422 30.6077 19.3944C30 18.8295 29.5522 18.7981 28.8486 19.2375C19.5416 25.0433 10.2345 30.849 0.927506 36.6548C0.703625 36.8117 0.415778 36.9059 0.159915 37C0.127932 37 0.0639659 36.9372 0 36.8745Z'
          fill='currentColor'
        />
      </svg>
      <div className={styles.text}>Кавказ.рф</div>
    </div>
  );
};
