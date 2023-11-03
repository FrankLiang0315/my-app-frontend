"use client"
import * as React from 'react';
import LayoutNavBar from './layout-nav-bar';
import { Box, Alert, Snackbar } from '@mui/material';

interface Props {
  children?: React.ReactNode
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
}

export default function LayoutView(props: Props) {
  const { children } = props;

  return (
    <>
      <LayoutNavBar />
      <div className='p-2 text-base'>
        {children}
      </div>
    </>
  );
}
