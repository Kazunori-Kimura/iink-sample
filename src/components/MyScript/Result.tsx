import { Box, SxProps, Theme } from '@mui/material';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { forwardRef, useContext, useImperativeHandle, useRef } from 'react';
import MyScript, { IinkEvent, cleanLatex } from './MyScript';
import { MyScriptContext } from './MyScriptProvider';

interface Props {
    sx?: SxProps<Theme>;
}

export interface ResultHandler {
    handleExport: (event: IinkEvent) => void;
    clear: VoidFunction;
}

function renderLatex(tex: string, el: HTMLDivElement) {
    katex.render(tex, el, {
        throwOnError: false,
    });
}

const Result = forwardRef<ResultHandler, Props>(({ sx = {} }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { type } = useContext(MyScriptContext);

    useImperativeHandle(
        ref,
        () => ({
            handleExport: (event: IinkEvent) => {
                const { detail } = event;
                if (containerRef.current && detail && detail.exports) {
                    console.log(detail);
                    const type = MyScript.instance.type;
                    if (type === 'MATH') {
                        const content = detail.exports['application/x-latex'];
                        if (typeof content === 'string') {
                            const data = cleanLatex(content);
                            renderLatex(data, containerRef.current);
                        }
                    } else if (type === 'TEXT') {
                        const content = detail.exports['text/plain'];
                        if (typeof content === 'string') {
                            containerRef.current.innerText = content;
                        }
                    }
                }
            },
            clear: () => {
                if (containerRef.current) {
                    containerRef.current.innerHTML = '';
                }
            },
        }),
        []
    );

    return <Box sx={{ height: type === 'TEXT' ? 0 : '100px', ...sx }} ref={containerRef}></Box>;
});

export default Result;
