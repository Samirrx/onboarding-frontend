import React, { ReactNode, CSSProperties } from 'react';
import { Drawer as Drawers } from '@mui/material';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  width?: number;
  sx?: any;
}

const Drawer: React.FC<DrawerProps> = ({
  open,
  onClose,
  children,
  width = 900,
  sx
}) => {
  return (
    <Drawers
      sx={{
        ml: open ? 3 : 0,
        flexShrink: 0,
        zIndex: 1200,
        overflowX: 'hidden',
        width: { xs: width, md: width },
        transition: 'width 0.6s ease',
        '& .MuiDrawer-paper': {
          height: sx?.height || 'calc(100vh - 50px)',
          width: { xs: width, md: width },
          position: 'fixed',
          border: 'none',
          borderRadius: '0px',
          top: sx?.top || '6%',
          transition: 'transform 0.6s ease'
        },
        ...sx
      }}
      variant="temporary"
      anchor="right"
      open={open}
      ModalProps={{ keepMounted: true }}
      onClose={onClose}
    >
      {children}
    </Drawers>
  );
};

export default Drawer;
