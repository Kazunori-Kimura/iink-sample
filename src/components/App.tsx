import { CssBaseline, Divider } from '@mui/material';
import Controls from './Controls';
import Editor from './Editor';

function App() {
    return (
        <>
            <CssBaseline />
            <Controls sx={{ p: 1 }} />
            <Divider />
            <Editor
                sx={{
                    width: '100dvw',
                    height: '50dvh',
                }}
            />
        </>
    );
}

export default App;
