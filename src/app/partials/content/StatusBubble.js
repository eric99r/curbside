import React, { useRef, useEffect, useCallback } from "react";

export default function StatusBubble(props) {

    const { status, error, type, children } = props;

    useEffect(() => {

    }, [status, error, type]);

    function determineClassName() {
        if (error) {
            return "alert alert-danger";
        } else if (type === "success") {
            return "alert alert-success";
        } else if (type === "danger") {
            return "alert alert-danger";
        } else if (type === "info") {
            return "alert alert-info";
        } else if (type === "primary") {
            return "alert alert-primary";
        } else if (type === "secondary") {
            return "alert alert-secondary";
        } else if (type === "warning") {
            return "alert alert-warning";
        } else if (type === "light") {
            return "alert alert-light";
        } else if (type === "dark") {
            return "alert alert-dark";
        } else {
            return "alert alert-success";
        }
    }

    return (
        children || status ? (
            <div role="alert" className={determineClassName()}>
                <div className="alert-text">{children ? children : status}</div>
            </div>
        ) : null
    );

}