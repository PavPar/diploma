/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import { useState, useEffect, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import InfoTooltip from './InfoTooltip'

import FormField from './FormField'

import logo from '../images/logo.svg'
import { authMSG } from '../configs/messages';

export default function Login({ handleSubmit }) {
    const history = useHistory();

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const [isFormValid, setFormValidity] = React.useState(false);
    const [isEmailValid, setEmailValidity] = React.useState(false);
    const [isPasswordValid, setPasswordValidity] = React.useState(false);
    const [isReadyForSubmit, setReadyForSubmit] = React.useState(false)

    const inputValidity = [isEmailValid, isPasswordValid]
    const [showErrMsg, setShowErrMsg] = useState(false);

    const emailRef = useRef()
    const passwordRef = useRef()

    useEffect(() => {
        setFormValidity(!inputValidity.some((input) => !input));
    }, [inputValidity])

    useEffect(() => {
        setReadyForSubmit(false)

        if (inputValidity.some((input) => !input)) {
            return
        }

        handleSubmit({ email, password })
            .then((res) => {
                history.push('/movies')
            })
            .catch((err) => {
                console.log(err)
                setAuthStatus(false)
                setStatusPopupOpen(true)
            })
        setFormValidity(false)

    }, [isReadyForSubmit])

    //Hardcode, but it works ¯\_(ツ)_/¯ autocomplete fix
    useEffect(() => {
        const timer = setTimeout(() => {
            ReactTestUtils.Simulate.change(emailRef.current);
            ReactTestUtils.Simulate.change(passwordRef.current);
        }, 500)
        return () => clearTimeout(timer)
    }, [])

    const [StatusPopupOpen, setStatusPopupOpen] = React.useState(false);
    const [isAuthOk, setAuthStatus] = React.useState(false);

    function closeAllPopups() {
        setStatusPopupOpen(false);
    }

    return (
        <>
            <section className="auth">
                <Link to="/" className="auth__logo">
                    <img src={logo} alt="лого"></img>
                </Link>
                <h2 className="auth__title">Рады видеть!</h2>
                <form className="form">
                    <FormField
                        name="E-mail"
                        type="email"
                        required
                        onValidityChange={
                            (state) => {
                                setEmailValidity(state.valid);
                                setEmail(state.value);
                            }
                        }
                        onClick={() => {
                            setShowErrMsg(true)
                        }}
                        inputRef={emailRef}
                        displayErrMsg={showErrMsg}
                    ></FormField>
                    <FormField
                        name="Пароль"
                        type="password"
                        required
                        onValidityChange={
                            (state) => {
                                setPasswordValidity(state.valid);
                                setPassword(state.value);
                            }
                        }
                        onClick={() => {
                            setShowErrMsg(true)
                        }}
                        inputRef={passwordRef}
                        minLength="1"
                        displayErrMsg={showErrMsg}
                    >

                    </FormField>
                </form>
                <div className="auth__controlls">
                    <button
                        className="auth__btn auth__btn_action-submit"
                        disabled={!isFormValid}
                        style={isFormValid ? { "opacity": "1" } : { "opacity": "0.5" }}
                        onClick={(event) => {
                            event.preventDefault();
                            ReactTestUtils.Simulate.change(emailRef.current);
                            ReactTestUtils.Simulate.change(passwordRef.current);
                            setReadyForSubmit(true);
                        }}>Войти</button>
                    <p className="auth__text">Ещё не зарегистрированы?</p>
                    <Link to="/signup" className="auth__btn auth__btn_action-redirect">Регистрация</Link>
                </div>
            </section>
            <InfoTooltip
                onClose={closeAllPopups}
                isOpen={StatusPopupOpen}
                isOk={isAuthOk}
                msgText={isAuthOk ? authMSG.ok : authMSG.unknownErr}
            ></InfoTooltip>
        </>
    )
}

