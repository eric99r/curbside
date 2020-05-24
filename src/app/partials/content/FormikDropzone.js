import React from 'react';
import { useField } from "formik";
import { DropzoneArea } from 'material-ui-dropzone';


export default function FormikDropzone(props) {
    const [field, meta, helpers] = useField(props.name);
    const { setValue } = helpers;

    return (
        <>
            <DropzoneArea
                {...field}
                {...props}
                onChange={files => { setValue(files); props.onChange && props.onChange(files); }}
            />
        </>
    );
}