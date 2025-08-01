'use client'
import { useRef, useMemo } from "react";
import dynamic from "next/dynamic";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const RichTextEditor = ({ placeholder, value, changeHandler }) => {
    const editor = useRef(null);

    const config = useMemo(() => ({
        readonly: false,
        placeholder: placeholder || 'Start typing...',
    }), [placeholder]);

    return (
        <JoditEditor
            ref={editor}
            value={value}
            config={config}
            tabIndex={1}
            onChange={(data) => changeHandler(data)}
        />
    );
};

export default RichTextEditor;
