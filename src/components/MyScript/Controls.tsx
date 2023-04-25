import {
    Button,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    Stack,
    SxProps,
    Theme,
} from '@mui/material';
import { ChangeEvent, useCallback, useContext } from 'react';
import MyScript, { EditorType } from './MyScript';
import { MyScriptContext } from './MyScriptProvider';

interface Props {
    sx?: SxProps<Theme>;
    onClear?: VoidFunction;
}

export default function Controls({ sx = {}, onClear }: Props) {
    const { type, onChangeType } = useContext(MyScriptContext);

    const handleClickConvert = useCallback(() => {
        MyScript.instance.onConvert();
    }, []);

    const handleClickExport = useCallback(() => {
        const data = MyScript.instance.export();
        console.log(data);
    }, []);

    const handleClickClear = useCallback(() => {
        MyScript.instance.clear();
        onClear?.();
    }, [onClear]);

    const handleChangeType = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            const { value } = event.target;
            onChangeType(value as EditorType);
        },
        [onChangeType]
    );

    const handleClickSVG = useCallback(() => {
        const svg = MyScript.instance.toSVG();
        console.log(svg);
    }, []);

    return (
        <Stack sx={sx} direction="row" spacing={2} alignItems="center">
            <FormControl>
                <RadioGroup row name="editorMode" value={type} onChange={handleChangeType}>
                    <FormControlLabel value="TEXT" control={<Radio />} label="TEXT" />
                    <FormControlLabel value="MATH" control={<Radio />} label="MATH" />
                </RadioGroup>
            </FormControl>
            <Button onClick={handleClickClear}>clear</Button>
            <Button onClick={handleClickExport}>export</Button>
            <Button onClick={handleClickConvert}>convert</Button>
            <Button disabled={type !== 'MATH'} onClick={handleClickSVG}>
                toSVG
            </Button>
        </Stack>
    );
}
