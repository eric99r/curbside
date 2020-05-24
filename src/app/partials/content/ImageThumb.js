import React from "react";

const thumb = {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    width: 100,
    height: 100,
    padding: 4,
    boxSizing: 'border-box'
};

const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
};

const img = {
    display: 'block',
    width: 'auto',
    height: '100%'
};

export default function ImageThumb(props) {

    const { alt, src, thumbStyle, thumbInnerStyle, imageStyle } = props;

    return (
        <div style={thumbStyle || thumb}>
            <div style={thumbInnerStyle || thumbInner}>
                <img
                    alt={alt || ""}
                    src={src || ""}
                    style={imageStyle || img}
                />
            </div>
        </div>
    );
}