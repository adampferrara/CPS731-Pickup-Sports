import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { signIn, signUp } from '../../redux/actions/auth';
import { FiAlertTriangle } from "react-icons/fi";

import './styles.css';

export const Auth = ({ setisSignedIn }) => {

    const dispatch = useDispatch();

    const [isSignIn, setIsSignIn] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [userData, setUserData] = useState({
        firtName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone_no: ''
    });

    useEffect(() => {
        setErrorMessage('');
        setUserData({
            firtName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            phone_no: ''
        });
    }, [isSignIn]);

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isSignIn) {
            dispatch(signIn(userData))
                .then(data => {
                    if (data) {
                        setErrorMessage(data);
                        setisSignedIn(false);
                    }
                    else {
                        setisSignedIn(true);
                    }
                });
        }
        else {
            dispatch(signUp(userData))
                .then(data => {
                    if (data) {
                        setErrorMessage(data);
                        setisSignedIn(false);
                    }
                    else {
                        setisSignedIn(true);
                    }
                });
        }
    };

    return (
        <div className="row">
            <div className="form-container col-md-6 col-sm-12">
                <h1>Pickup Sports</h1>
                <h5>{isSignIn ? 'Sign In' : 'Create Account'}</h5>

                {/* {
                    !isSignIn ?
                        (
                            <>
                                <div className="google-signin mt-5 bg-primary">
                                    <span className="google-logo"><FaGoogle /></span>
                                    <div className="fs-5 fw-light">
                                        Create Account with Google
                                </div>
                                </div>
                                <p className="fs-5 mt-4 fw-lighter">or use email for registration:</p>
                            </>
                        ) : null
                } */}

                {
                    errorMessage ?
                        (
                            <div className="alert alert-danger d-flex align-items-center" role="alert">
                                <FiAlertTriangle style={{ marginRight: 5 }} />
                                {errorMessage}
                            </div>
                        ) : null
                }


                <form autoComplete="on" noValidate className="w-75 mt-4 d-flex flex-column align-items-center" onSubmit={handleSubmit}>
                    {
                        !isSignIn ? <input type="text" className="form-control fw-light fs-5" placeholder="FirstName" name="firstName" value={userData.firstName} onChange={handleChange} /> : null
                    }

                    {
                        !isSignIn ? <input type="text" className="form-control fw-light fs-5 mt-4" placeholder="LastName" name="lastName" value={userData.lastName} onChange={handleChange} /> : null
                    }

                    <input type="text" className="form-control fw-light fs-5 mt-4" placeholder="Email" name="email" value={userData.email} onChange={handleChange} />
                    <input type="password" className="form-control fw-light fs-5 mt-4" placeholder="Password" name="password" value={userData.password} onChange={handleChange} />

                    {
                        !isSignIn ? <input type="password" className="form-control fw-light fs-5 mt-4" placeholder="Confirm Password" name="confirmPassword" value={userData.confirmPassword} onChange={handleChange} /> : null
                    }

                    {
                        !isSignIn ? <input type="number" className="form-control fw-light fs-5 mt-4" placeholder="Phone Numer" name="phone_no" value={userData.phone_no} onChange={handleChange} /> : null
                    }

                    <button type="submit" className="btn w-100 mt-4 btn-success">
                        {
                            isSignIn ? 'Sign In' : 'Sign Up'
                        }
                    </button>
                    <p className="fs-6 mt-4 fw-lighter have-account" onClick={() => setIsSignIn(prevIsSignIn => !prevIsSignIn)}>
                        {
                            isSignIn ? `Don't have an account?` : 'Already have an account?'
                        }
                    </p>



                </form>
            </div>
            <div className="auth-backdrop col">
            </div>
        </div >

    );
};
