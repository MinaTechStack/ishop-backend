import React, { useState, useRef, useMemo } from 'react';
import JoditEditor from 'jodit-react';

const RichTextEditor = ({ placeholder, value, changeHandler }) => {
    const editor = useRef(null);

    const config = useMemo(() => ({
        readonly: false, // all options from https://xdsoft.net/jodit/docs/,
        placeholder: placeholder || 'Start typings...'
    }),
        [placeholder]
    );

    return (
        <JoditEditor
            ref={editor}
            value={value}
            config={config}
            tabIndex={1} // tabIndex of textarea
            onChange={
                (data) => {
                    changeHandler(data)
                }
            }
        />
    );
};
export default RichTextEditor;