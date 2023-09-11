import React, { useEffect, useState } from 'react';
import './UserProfileContainer.css';
import { useSelector } from "react-redux";
import { TokenValidation } from '../../../util/TokenValidation';
import { useDispatch } from "react-redux";
import { FiAlertTriangle } from "react-icons/fi";
import { updateProfile } from '../../../redux/actions/auth';


const UserProfileContainer = ({ menuStatus }) => {
    const [userProfile, setUserProfile] = useState(JSON.parse(localStorage.getItem('profile')));
    const [errorMessage, seterrorMessage] = useState('');
    const [successMessage, setsuccessMessage] = useState(false);
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        oldEmail: '',
        email: '',
        phone_no: '',
        password: '',
        confirmPassword: ''
    });

    const dispatch = useDispatch();
    const themeReducer = useSelector(({ theme }) => theme);


    useEffect(() => {
        const isTokenValid = TokenValidation(JSON.parse(localStorage.getItem('profile')));

        if (isTokenValid) {
            setUserProfile(JSON.parse(localStorage.getItem('profile')));
        }
        else {
            dispatch({ type: "LOGOUT" });
        }
    }, [dispatch]);

    useEffect(() => {
        if (userProfile) {
            setUserData({
                ...userProfile.result,
                email: userProfile.result.email || '',
                oldEmail: userProfile.result.email || '',
                password: ""
            });
        }
    }, [userProfile]);

    const handleChange = (e) => {
        console.log("change: " + e.target.name);
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateProfile(userData)).then(data => {
            console.log("Me");
            if (data) {
                seterrorMessage(data);
            }
            else {
                seterrorMessage("");
                setsuccessMessage(true);

                setUserData({
                    ...userData,
                    password: "",
                    confirmPassword: ""
                });
            }
        });
    };

    return (
        <div className={`userProfile ${themeReducer.theme ? 'darkTheme' : 'lightTheme'}`} >

            <form onSubmit={handleSubmit}>
                <div className="row justify-content-center">
                    <div className="col-md-5 border-right">
                        <div className="p-3 py-5">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="text-right">Edit User Profile</h4>
                            </div>
                            {
                                errorMessage ?
                                    (
                                        <div className="alert alert-danger d-flex align-items-center" role="alert">
                                            <FiAlertTriangle style={{ marginRight: 5 }} />
                                            {errorMessage}
                                        </div>
                                    ) : null
                            }
                            {
                                successMessage ?
                                    (
                                        <div className="alert alert-success d-flex align-items-center" role="alert">
                                            Updated
                                        </div>
                                    ) : null
                            }
                            <div className="row mt-2">
                                <div className="col-md-6"><label className="labels">First Name</label>
                                    <input type="text" className="form-control" placeholder="First name" name="firstName" value={userData.firstName} onChange={handleChange} />
                                </div>
                                <div className="col-md-6"><label className="labels">Last Name</label>
                                    <input type="text" className="form-control" placeholder="Last Name" name="lastName" value={userData.lastName} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-12"><label className="labels">Phone Number</label>
                                    <input type="text" className="form-control" placeholder="Enter phone number" name="phone_no" value={userData.phone_no} onChange={handleChange} />
                                </div>
                                <div className="col-md-12"><label className="labels">Email</label>
                                    <input type="text" className="form-control" placeholder="Enter email" name="email" value={userData.email} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-6"><label className="labels">Password</label>
                                    <input type="password" className="form-control" name="password" value={userData.password} placeholder="Password" onChange={handleChange} />
                                </div>
                                <div className="col-md-6"><label className="labels">Confirm Password</label>
                                    <input type="password" className="form-control" name="confirmPassword" value={userData.confirmPassword} placeholder="Confirm Password" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="mt-5 text-center"><button className="btn btn-success profile-button" type="submit">Save Profile</button></div>
                        </div>
                    </div>
                </div>
            </form>
        </div>

    );
};

export default UserProfileContainer;