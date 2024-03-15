import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import React from 'react'

const ConfirmDeleteDialog = ({open ,handleclose , deleteHandler}) => {
  return (
   <Dialog open={open} onClose={handleclose}>
    <DialogTitle>Confirm Delete</DialogTitle>
    <DialogContent>
        <DialogContentText>Are you sure you want to delete this group ?</DialogContentText>
    </DialogContent>
    <DialogActions>
        <Button variant='text' onClick={handleclose}>No</Button>
        <Button variant='text' color='error' onClick={deleteHandler}>Yes</Button>
    </DialogActions>
   </Dialog>
  )
}

export default ConfirmDeleteDialog;