import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import { useState, useEffect, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';

import FormField from './FormField'

import logo from '../images/logo.svg'
import InfoTooltip from './InfoTooltip'

import { authMSG } from '../configs/messages';

export default function Register({ handleSubmit, handleAuth }) {
    const history = useHistory();
    const [showErrMsg, setShowErrMsg] = useState(false);

    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const nameRef = useRef()
    const emailRef = useRef()
    const passwordRef = useRef()

    const [isFormValid, setFormValidity] = React.useState(false);
    const [isReadyForSubmit, setReadyForSubmit] = React.useState(false)


    const [isNameValid, setNameValidity] = React.useState(false);
    const [isEmailValid, setEmailValidity] = React.useState(false);
    const [isPasswordValid, setPasswordValidity] = React.useState(false);

    const inputValidity = [isEmailValid, isPasswordValid, isNameValid]


    useEffect(() => {
        setFormValidity(!inputValidity.some((input) => !input));
    }, [inputValidity])


    useEffect(() => {
        const timer = setTimeout(() => {
            ReactTestUtils.Simulate.focus(nameRef.current);
            ReactTestUtils.Simulate.focus(emailRef.current);
            ReactTestUtils.Simulate.focus(passwordRef.current);
        }, 500)
        return () => clearTimeout(timer)
    }, [])


    useEffect(() => {
        setReadyForSubmit(false)
        if (!isFormValid) {
            return
        }
        handleSubmit({ name, email, password })
            .then((res) => {
                setAuthStatus(true)
                setStatusPopupOpen(true)
                handleAuth({ email, password })
                    .then((res) => {
                        history.push('/movies')
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            })
            .catch((err) => {
                console.log(err)
                setAuthStatus(false)
                setStatusPopupOpen(true)
            })
        setFormValidity(false)

    }, [isReadyForSubmit])

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
                <h2 className="auth__title">Добро пожаловать!</h2>
                <form className="form">
                    <FormField
                        name="Имя"
                        required
                        onValidityChange={
                            (state) => {
                                setNameValidity(state.valid);
                                setName(state.value);
                            }
                        }
                        inputRef={nameRef}
                        onClick={() => {
                            setShowErrMsg(true)
                        }}
                        displayErrMsg={showErrMsg}

                    />
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
                        inputRef={emailRef}
                        displayErrMsg={showErrMsg}
                        onClick={() => {
                            setShowErrMsg(true)
                        }}
                    />
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
                        inputRef={passwordRef}
                        onClick={() => {
                            setShowErrMsg(true)
                        }}
                        displayErrMsg={showErrMsg}

                    />
                </form>
                <div className="auth__controlls">
                    <button
                        className="auth__btn auth__btn_action-submit"
                        style={isFormValid ? { "opacity": "1" } : { "opacity": "0.5" }}
                        onClick={(event) => {
                            event.preventDefault();
                            ReactTestUtils.Simulate.change(emailRef.current);
                            ReactTestUtils.Simulate.change(passwordRef.current);
                            ReactTestUtils.Simulate.change(nameRef.current);
                            setReadyForSubmit(true);
                        }}
                    >Зарегестрироваться</button>
                    <p className="auth__text">Уже зарегистрированы?</p>
                    <Link to="/signin" className="auth__btn auth__btn_action-redirect">Войти</Link>
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

