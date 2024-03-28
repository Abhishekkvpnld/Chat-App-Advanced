import React, { useState } from 'react';
import { Avatar, Button, Container, IconButton, Paper, Stack, TextField, Typography } from "@mui/material";
import { CameraAlt } from "@mui/icons-material";
import { VisuallyHiddenInput } from '../components/styles/StyledComponents';
import { useFileHandler, useInputValidation, useStrongPassword } from "6pp";
import { usernameValidators } from '../utils/Validators';
import axios from 'axios';
import { server } from '../constants/config';
import { useDispatch } from 'react-redux';
import { userExists } from '../../redux/reducers/auth';
import toast from 'react-hot-toast';

const Login = () => {

    const [isLogin, setIsLogin] = useState(true)

    const toggleLogin = () => setIsLogin((prev) => !prev);

    const name = useInputValidation('');
    const username = useInputValidation('', usernameValidators);
    const bio = useInputValidation('');
    const password = useStrongPassword('')
    const dispatch = useDispatch();

    const avatar = useFileHandler("single");

    const handleSignup = (e) => {
        e.preventDefault();
    }

    const handleLogin = async (e) => {
        e.preventDefault();

        const config = {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            },
        }

        try {

            const { data } = await axios.post(`${server}/api/v1/user/login`,
                {
                    username: username.value,
                    password: password.value
                },
                config
            );

            dispatch(userExists(true));
            toast.success(data.message)

        } catch (error) {
           toast.error(error?.response?.data?.message || "Something Went Wrong...");
        }




    }

    return (


        <Container component={"main"} maxWidth="xs" sx={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <Paper elevation={3} sx={{ padding: 4, display: "flex", flexDirection: "column", alignItems: "center" }}>



                {
                    isLogin ? (
                        <>
                            <Typography variant='h5'>Login</Typography>

                            <form style={{ width: '100%', marginTop: "1rem" }} onSubmit={handleLogin}>

                                <TextField required fullWidth label="Username" margin='normal' variant='outlined' value={username.value} onChange={username.changeHandler} />
                                <TextField required fullWidth label="Password" type='password' margin='normal' variant='outlined' value={password.value} onChange={password.changeHandler} />

                                <Button variant='contained' color='primary' type='submit' fullWidth sx={{ marginTop: "1rem" }}>Login</Button>

                                <Typography textAlign={"center"} m={"1rem"} >
                                    OR
                                </Typography>

                                <Button variant='text' onClick={toggleLogin} fullWidth >Signup</Button>

                            </form>
                        </>
                    ) : (
                        <>
                            <Typography variant='h5'>Sign Up</Typography>

                            <form style={{ width: '100%', marginTop: "1rem" }} onSubmit={handleSignup}>

                                <Stack position={"relative"} width={"10rem"} margin={"auto"}>
                                    <Avatar sx={{ width: "10rem", height: "10rem", objectFit: "contain" }} src={avatar.preview} />


                                    <IconButton sx={{
                                        position: "absolute",
                                        bottom: "0",
                                        right: "0",
                                        color: "grey",
                                        bgcolor: "rgba(0 0 0 0.5)",
                                        ":hover": {
                                            bgcolor: "rgba(0 0 0 1)"
                                        }
                                    }} component='label'>
                                        <>
                                            <CameraAlt />
                                            <VisuallyHiddenInput type='file' onChange={avatar.changeHandler} />
                                        </>
                                    </IconButton>

                                </Stack>

                                {
                                    avatar.error && (
                                        <Typography variant='caption' color={"error"} m={"1rem auto"} width={"fit-content"} display={"block"}>
                                            {
                                                avatar.error
                                            }
                                        </Typography>
                                    )
                                }

                                <TextField required fullWidth label="Name" margin='normal' variant='outlined' value={name.value} onChange={name.changeHandler} />
                                <TextField required fullWidth label="Bio" margin='normal' variant='outlined' value={bio.value} onChange={bio.changeHandler} />
                                <TextField required fullWidth label="Username" margin='normal' variant='outlined' value={username.value} onChange={username.changeHandler} />

                                {
                                    username.error && (
                                        <Typography variant='caption' color="error">
                                            {username.error}
                                        </Typography>
                                    )
                                }

                                <TextField required fullWidth label="Password" type='password' margin='normal' variant='outlined' value={password.value} onChange={password.changeHandler} />

                                {
                                    password.error && (
                                        <Typography color={"error"} variant='caption'>
                                            {
                                                password.error
                                            }
                                        </Typography>
                                    )
                                }

                                <Button variant='contained' color='primary' type='submit' fullWidth sx={{ marginTop: "1rem" }}>Sign Up </Button>

                                <Typography textAlign={"center"} m={"1rem"} >
                                    OR
                                </Typography>

                                <Button variant='text' onClick={toggleLogin} fullWidth >Login</Button>

                            </form>
                        </>
                    )

                }



            </Paper>
        </Container>
    )
}

export default Login;