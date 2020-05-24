import React, { useState, useEffect } from 'react';
import { Checkbox, Link, Tooltip } from '@material-ui/core';

const thumbsContainer = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16
};

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

export default function ImagePreviews(props) {

    const { images, onRemove } = props;

    const [state, setState] = useState({
        images: [],
        selected: []
    });

    useEffect(() => {
        setState({
            ...state, images: images.map(image => Object.assign(image, {
                //file: image,
                url: URL.createObjectURL(image)
            }))
        })
        return () => {
            // Make sure to revoke the data uris to avoid memory leaks
            state.images.forEach(image => URL.revokeObjectURL(image.url));
        };
    }, [props.images]);

    function handleBlur(event) {

    }

    function handleChange(event, image) {
        if (event.target.checked === true) {
            // Add to selected.
            setState({ ...state, selected: state.selected.concat([image]) });
        }
        else {
            // Remove from selected.
            setState({ ...state, selected: state.selected.filter(i => i.url !== image.url) });
        }
    }

    const thumbs = state.images.map(image => (
        <div key={image.url}>
            <Checkbox
                name={image.name + "-checkbox"}
                color="primary"
                onBlur={handleBlur}
                onChange={(event) => handleChange(event, image)}
            />
            <Tooltip title={image.name}>
                <div style={thumb} key={image.name}>
                    <div style={thumbInner}>
                        <img
                            alt={image.name}
                            src={image.url}
                            style={img}
                        />
                    </div>
                </div>
            </Tooltip>
        </div>
    ));

    function removeSelected() {
        onRemove && onRemove(state.selected);
        const remainingImages = state.images.filter(image => !state.selected.some(i => i.url === image.url));
        state.selected.forEach(image => URL.revokeObjectURL(image.url));
        setState({ ...state, images: remainingImages, selected: [] });
    }

    function removeAll() {
        onRemove && onRemove(state.images);
        state.images.forEach(image => URL.revokeObjectURL(image.url));
        setState({ ...state, images: [] });
    }

    return (
        <section className="container">
            <span>You've uploaded {state.images.length} logos. </span>
            <Link
                className="kt-link"
                onClick={removeSelected}
            >
                Remove Selected
            </Link>
            <span> | </span>
            <Link
                className="kt-link"
                onClick={removeAll}
            >
                Remove All
            </Link>
            <aside style={thumbsContainer}>
                {thumbs}
            </aside>
        </section>
    );
}