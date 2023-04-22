import { Button, Stack, SxProps, Theme, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import MyScript from './Editor/MyScript';

interface Props {
    sx?: SxProps<Theme>;
}

export default function Controls({ sx = {} }: Props) {
    const [text, setText] = useState('');

    const handleClickExport = useCallback(() => {
        const data = MyScript.instance.export();
        setText(data);
    }, []);

    const handleClickClear = useCallback(() => {
        MyScript.instance.clear();
        setText('');
    }, []);

    return (
        <Stack sx={sx} direction="row" spacing={2} alignItems="center">
            <Button onClick={handleClickClear}>clear</Button>
            <Button onClick={handleClickExport}>export</Button>
            <Typography variant="body1">{text}</Typography>
        </Stack>
    );
}
