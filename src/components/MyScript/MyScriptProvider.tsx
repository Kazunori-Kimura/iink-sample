import { createContext, useCallback, useState } from 'react';
import MyScript, { EditorType } from './MyScript';

interface IMyScriptContext {
    type: EditorType;
    value: string;
    onChangeType: (type: EditorType) => void;
    onChangeValue: (value: string) => void;
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const MyScriptContext = createContext<IMyScriptContext>(undefined!);

interface Props {
    children: React.ReactNode;
}

const MyScriptProvider: React.FC<Props> = ({ children }) => {
    const [type, setType] = useState<EditorType>('MATH');
    const [value, setValue] = useState('');

    const onChangeType = useCallback((type: EditorType) => {
        setType(type);
        MyScript.instance.setType(type);
    }, []);

    const onChangeValue = useCallback((value: string) => {
        setValue(value);
    }, []);

    return (
        <MyScriptContext.Provider value={{ type, value, onChangeType, onChangeValue }}>
            {children}
        </MyScriptContext.Provider>
    );
};

export default MyScriptProvider;
