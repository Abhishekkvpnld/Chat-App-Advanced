import React, { useState } from 'react';
import { Avatar, Button, Container, IconButton, Paper, Stack, TextField, Typography } from "@mui/material";
import { CameraAlt } from "@mui/icons-material";
import { VisuallyHiddenInput } from '../components/StyledComponents';
import {useInputValidation} from "6pp"

const Login = () => {

    const [isLogin, setIsLogin] = useState(true)

    const toggleLogin = () => setIsLogin((prev) => !prev); 

    const Name = useInputValidation('');
    const Username = useInputValidation('');
    const Bio = useInputValidation('');
    const Password = useInputValidation('')

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

                            <form style={{ width: '100%', marginTop: "1rem" }}>

                                <TextField required fullWidth label="Username" margin='normal' variant='outlined' value={Username.value} onChange={Username.changeHandler} />
                                <TextField required fullWidth label="Password" type='password' margin='normal' variant='outlined' value={Password.value} onChange={Password.changeHandler} />

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

                            <form style={{ width: '100%', marginTop: "1rem" }}>

                                <Stack position={"relative"} width={"10rem"} margin={"auto"}>
                                    <Avatar sx={{ width: "10rem", height: "10rem", objectFit: "contain" }} />

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
                                            <VisuallyHiddenInput type='file' />
                                        </>
                                    </IconButton>

                                </Stack>

                                <TextField required fullWidth label="Name" margin='normal' variant='outlined' value={Name.value} onChange={Name.changeHandler} />
                                <TextField required fullWidth label="Bio" margin='normal' variant='outlined' value={Bio.value} onChange={Bio.changeHandler} />
                                <TextField required fullWidth label="Username" margin='normal' variant='outlined'value={Username.value} onChange={Name.changeHandler} />
                                <TextField required fullWidth label="Password" type='password' margin='normal' variant='outlined' value={Password.value} onChange={Password.changeHandler} />

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