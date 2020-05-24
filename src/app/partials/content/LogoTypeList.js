import React, { useState, useEffect } from "react";
import LogoTypeListItem from "./LogoTypeListItem";

export default function LogoTypeList(props) {

    const { logos, onChange } = props;

    function handleChange(logo) {
        console.log(logo);
        const updatedImages = logos.map(i => i.imageUrl === logo.imageUrl ? logo : i);
        onChange && onChange(updatedImages);
    }

    return (
        <>
            {
                logos.map(logo => (
                    <LogoTypeListItem
                        key={logo.imageUrl}
                        logo={logo}
                        onChange={handleChange}
                    />
                ))
            }
        </>
    );
}