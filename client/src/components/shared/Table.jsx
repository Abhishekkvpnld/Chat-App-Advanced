import React from 'react';
import { DataGrid } from "@mui/x-data-grid";
import { Container, Paper, Typography, } from '@mui/material';

const Table = ({ rows, column, heading, rowHeight = 52 }) => {
    return (
        <Container style={{ height: "100vh" }}>

            <Paper
                elevation={3}
                sx={{
                    padding: "1rem 4rem",
                    borderRadius: "1rem",
                    margin: "auto",
                    width: "100%",
                    overflow: "hidden",
                    height: "100%",
                    boxShadow: "none"
                }}
            >
                <Typography
                    variant='h4'
                    textAlign={"center"}
                    sx={{
                        margin: "2rerm",
                        textTransform: "uppercase"
                    }}
                >
                    {heading}
                </Typography>
                <DataGrid
                    rows={rows}
                    columns={column}
                    rowHeight={rowHeight}
                    style={{
                        height: "80%"
                    }}
                    sx={{
                        border: "none",
                        ".table-header": {
                            bgcolor: 'black',
                            color: 'white'
                        }
                    }}
                />
            </Paper>

        </Container>
    )
}

export default Table;