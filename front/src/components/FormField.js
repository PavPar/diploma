import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';

export default function FormField({displayErrMsg=true, type = "", name = "", errorMsg = "", inputRef, onValidityChange, ...props }) {
    const [state, setState] = React.useState('');

    const validation = (event) => {
        setState({
            valid: event.target.validity.valid,
            msg: event.target.validationMessage,
            value: event.target.value
        });
        onValidityChange(state);
    }

    // const timer = setTimeout(()=>{
    //     ReactTestUtils.Simulate.change(event.target);
    // },1)
    // return () => clearTimeout(timer)
    return (
        <div className="form__field">
            <p className="form__fieldname">{name}</p>
            <input
                className="form__input"
                type={type}
                required={props.required}
                ref={inputRef}
                onClick={
                    props.onClick
                }
                onChange={
                    validation
                }
                onBlur={
                    validation
                }
                onFocus={
                    validation
                }
                minLength={props.minLength || ""}
                maxLength={props.maxLength || ""}
            ></input>
            <p className="form__errorfield">{displayErrMsg && (state.msg || "")}</p>
        </div>
    )
}
