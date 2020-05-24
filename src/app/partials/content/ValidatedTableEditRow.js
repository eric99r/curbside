import React, { useState } from "react";
import { MTableEditRow } from "material-table";
import { FormHelperText } from "@material-ui/core";

const addLineBreaks = string => {
    const lines = string.split('\n')
    return lines.map((text, index) => (
        <React.Fragment key={`edit-row-error-${index}`}>
            {text}
            {index < lines.length - 1 && <br />}
        </React.Fragment>
    ))
};

export default function ValidatedTableEditRow(validator, tableData, showAllErrors = false) {
    return function CustomEditRow(rowProps) {
        const onEditingApproved = rowProps.onEditingApproved;
        const [error, setError] = useState("");
        const beforeOnEditingApproved = (mode, newData, oldData) => {
            const validationErrors = validator(newData, oldData, tableData, mode);
            const keys = Object.keys(validationErrors);
            if (keys.length > 0) {
                if (showAllErrors) {
                    let allErrors = "";
                    for (let i = 0; i < keys.length; i++) {
                        allErrors += validationErrors[keys[i]] + "\n";
                    }
                    setError(allErrors);
                }
                else {
                    setError(validationErrors[keys[0]]);
                }
            }
            else {
                onEditingApproved(mode, newData, oldData);
            }
        }

        const newProps = { ...rowProps, onEditingApproved: beforeOnEditingApproved };
        return (
            <>
                <MTableEditRow {...newProps} />
                {
                    error &&
                    <FormHelperText
                        error={Boolean(error)}
                        style={{ padding: "1em", paddingLeft: "2em" }}
                    >
                        {addLineBreaks(error)}
                    </FormHelperText>
                }
            </>
        );
    }
}