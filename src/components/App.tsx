import { CssBaseline } from '@mui/material';
import MyScript from './MyScript';

function App() {
    return (
        <>
            <CssBaseline />
            <MyScript
                sx={{
                    width: '100dvw',
                    height: '50dvh',
                }}
            />
        </>
    );
}

export default App;
