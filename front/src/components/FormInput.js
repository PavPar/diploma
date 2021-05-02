import React, { useEffect } from 'react'
import ReactTestUtils from 'react-dom/test-utils';

export default function FormInput({ onValidityChange, inputRef, ...props }) {

    const [state, setState] = React.useState('');

    const validation = (event) => {
        setState({
            valid: event.target.validity.valid,
            msg: event.targetvalidationMessage,
            value: event.target.value
        });
        onValidityChange(state);
    }



    return (
        <input
            className={props.className}
            defaultValue={props.defaultValue}
            onClick={validation}
            onChange={validation}
            onBlur={validation}
            onFocus={validation}
            ref={inputRef}
            type={props.type}
            minLength={props.minLength || ""}
            maxLength={props.maxLength || ""}
            required={props.required}
        ></input>
    )
}