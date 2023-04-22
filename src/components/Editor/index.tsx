import { CSSProperties, useEffect, useRef } from 'react';
import MyScript from './MyScript';

interface Props {
    sx?: CSSProperties;
}

const Editor: React.FC<Props> = ({ sx }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            MyScript.instance.init(containerRef.current);
        }

        return () => {
            MyScript.instance.dispose();
        };
    }, []);

    return (
        <div
            id={MyScript.ElementID}
            ref={containerRef}
            style={{ ...sx, touchAction: 'none' }}
            touch-action="none"
        />
    );
};

export default Editor;
