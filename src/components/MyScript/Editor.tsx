import { Box, SxProps, Theme } from '@mui/material';
import { forwardRef } from 'react';

interface Props {
    sx?: SxProps<Theme>;
}

const Editor = forwardRef<HTMLDivElement, Props>(({ sx = {} }, ref) => {
    return (
        <Box ref={ref} sx={{ height: '300px', ...sx, touchAction: 'none' }} touch-action="none" />
    );
});

export default Editor;
