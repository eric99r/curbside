import React, { useState, useEffect } from 'react';
import {
    Paper,
    TextField, Button,
    FormControl, FormHelperText
} from "@material-ui/core";
import MaterialTable, { MTableEditRow } from "material-table";
import { useField } from "formik";
import ValidatedTableEditRow from "./ValidatedTableEditRow";

export default function EditableList(props) {
    const [state, setState] = useState({ data: [], inputValue: "" });
    const [field, meta, helpers] = useField(props.name);
    const { setValue, setError } = helpers;

    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        setState({ data: props.items || [] });
    }, []);

    useEffect(() => {
        // Compare our data to new props. If the props are different from our data, update our data.
        if (state.data.length !== props.items.length) {
            setState({ data: props.items });
        }
        else {
            // Check each element in the list to see if their names match.
            for (let i = 0; i < state.data.length; i++) {
                if (state.data[i].name !== props.items[i].name) {
                    setState({ data: props.items });
                    break;
                }
            }
        }
    }, [props.items]);

    function handleChange(e) {
        setState({ ...state, inputValue: e.target.value });
    }

    function handleAdd() {
        const itemToAdd = { name: state.inputValue };
        if (itemToAdd.name) {
            if (!state.data.some(i => i.name === itemToAdd.name)) {
                const data = state.data.concat([itemToAdd]);
                setState({ ...state, data, inputValue: "" });
                setValue(data);
                props.onChange(null, itemToAdd, "add");
            } else {
                // Cannot have duplicates!
                setState({ ...state, inputValue: "" });
                setError("Cannot have duplicates.");
            }
        } else {
            // Must input value.
            setState({ ...state, inputValue: "" });
            setError("Field must not be empty.");
        }
    }

    function onKeyDown(keyEvent) {
        if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
            keyEvent.preventDefault();
            handleAdd();
        }
    }

    return (
        <>
            <FormControl className={props.className && props.className.formControl} error={Boolean(meta.error)}>
                <MaterialTable
                    components={{
                        Container: props => <Paper {...props} elevation={0} />
                    }}
                    columns={[
                        { field: 'name' },
                    ]}
                    data={state.data}
                    options={{
                        showEmptyDataSourceMessage: false,
                        header: false,
                        toolbar: false,
                        showTitle: false,
                        paging: false,
                        emptyRowsWhenPaging: false,
                        actionsColumnIndex: -1,
                        padding: "dense",
                        //cellStyle: { borderBottom: "none" }
                    }}
                    components={{
                        EditRow: ValidatedTableEditRow(props.validator, state.data)
                    }}
                    editable={{
                        onRowUpdate: (newData, oldData) =>
                            new Promise((resolve, reject) => {
                                const data = state.data;
                                const index = data.indexOf(oldData);
                                data[index] = newData;
                                if (state.data.some((item, itemIndex) => item.name === newData.name && itemIndex !== index)) {
                                    //setError();
                                    reject("Cannot have duplicates.");
                                }
                                else if (newData.name === "") {
                                    reject("Field must not be empty.");
                                }
                                else {
                                    setState({ ...state, data });
                                    setValue(data);
                                    props.onChange && props.onChange(oldData, newData, "update");
                                    resolve();
                                }
                            }).catch(reason => {
                                setError(reason);
                            }),
                        onRowDelete: oldData =>
                            new Promise((resolve, reject) => {
                                let data = state.data;
                                const index = data.indexOf(oldData);
                                data.splice(index, 1);
                                setState({ ...state, data });
                                setValue(data);
                                props.onChange && props.onChange(oldData, null, "delete");
                                resolve();
                            }),
                    }}
                />
                <div className="form-group mb-0">
                    <TextField
                        name={props.inputFieldName || ""}
                        label={props.inputFieldLabel || ""}
                        placeholder={props.inputFieldPlaceholder || ""}
                        onChange={handleChange}
                        value={state.inputValue}
                        onKeyDown={onKeyDown}
                    />
                    <Button type="button" style={{ marginTop: "16px" }}
                        onClick={handleAdd}
                    >
                        Add
                        </Button>
                </div>
                <FormHelperText>{meta.error}</FormHelperText>
            </FormControl>
        </>
    );
}