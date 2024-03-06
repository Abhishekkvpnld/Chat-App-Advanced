import React from 'react';
import { Grid, Skeleton, Stack } from '@mui/material';

export const LayoutLoader = () => {
    return (
        <Grid container height={"calc(100vh-4rem)"}>

            <Grid item sm={4} md={3} sx={{ display: { xs:"none", sm:"block" }}} height={"100%"} padding={"1rem"}>
                <Skeleton variant='rectangular' height={"100Vh"} />
            </Grid>

            <Grid height={'100%'} item xs={12} sm={8} md={5} lg={6} padding={"1rem"}>
             <Stack spacing={"1rem"}>
               {
                Array.from({length:10}).map((_,index)=>(
                <Skeleton key={index} variant='rectangular' height={"5rem"} />
                ))}

             </Stack>
            </Grid >

            <Grid item md={4} lg={3} height={"100%"} sx={{ display: { xs: "none", md: "block" },padding:"1rem"}}>
                <Skeleton variant='rectangular' height={"100Vh"}/>
            </Grid>

        </Grid>
        )
}