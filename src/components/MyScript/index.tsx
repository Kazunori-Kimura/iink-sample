import { Divider, Stack, SxProps, Theme } from '@mui/material';
import { useCallback, useEffect, useRef } from 'react';
import Controls from './Controls';
import Editor from './Editor';
import MyScript from './MyScript';
import MyScriptProvider from './MyScriptProvider';
import Result, { ResultHandler } from './Result';

interface Props {
    sx?: SxProps<Theme>;
}

const MyScriptEditor: React.FC<Props> = ({ sx = {} }) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const resultRef = useRef<ResultHandler>(null);

    const handleClear = useCallback(() => {
        resultRef.current?.clear();
    }, []);

    useEffect(() => {
        if (editorRef.current && resultRef.current) {
            MyScript.instance.init({
                el: editorRef.current,
                events: {
                    onClear: resultRef.current.clear,
                    onExport: resultRef.current.handleExport,
                },
            });
        }

        return () => {
            MyScript.instance.dispose();
        };
    }, []);

    return (
        <MyScriptProvider>
            <Stack sx={sx} direction="column">
                <Controls sx={{ p: 2 }} onClear={handleClear} />
                <Divider />
                <Result sx={{ p: 2 }} ref={resultRef} />
                <Editor ref={editorRef} />
            </Stack>
        </MyScriptProvider>
    );
};

export default MyScriptEditor;
