import React, { useState } from 'react';
import { SampleUsers } from "../../constants/SampleChat";
import UserItem from '../shared/userItem';
import { Button, Dialog, DialogTitle, Stack, TextField, Typography } from '@mui/material';
import { useInputValidation } from "6pp";


const NewGroup = () => {

  const groupName = useInputValidation("")

  const [members, setMembers] = useState(SampleUsers)
  const [selectedMembers, setSelectedMembers] = useState([])

  const selectMemberHandler = (id) => {
    //select members

    // setMembers((prev)=>prev.map((user)=>user._id === id ? {...user,isAdded:!user.isAdded} : user ))

    setSelectedMembers((prev) => prev.includes(id) ?
      // prev.filter((currentElement) => currentElement !== id) 
      ''
      :
      [...prev, id]
    )

    console.log(selectedMembers);

  }


  const submitHandler = () => {
    //add selected members
  }

  const closeHandler = () => {

  }

  return (
    <Dialog open onClose={closeHandler}>
      <Stack p={{ xs: "1rem", sm: "2rem" }} width={"25rem"} spacing={"2rem"}>
        <DialogTitle textAlign={"center"} variant='h4'>New Group</DialogTitle>

        <TextField label="Group Name" value={groupName.value} onChange={groupName.changeHandler} />

        <Typography variant='body1'>Members</Typography>

        <Stack>
          {
            members.map((i) => (
              <UserItem
                user={i}
                key={i._id}
                handler={selectMemberHandler}
                isAdded={selectedMembers.includes(i._id)} />
            ))
          }
        </Stack>

        <Stack direction={"row"} justifyContent={"space-evenly"}>
          <Button variant='outlined' color='error' size='large'>Cancel</Button>
          <Button color='success' variant='contained' size='large' onClick={submitHandler} >Create</Button>
        </Stack>

      </Stack>
    </Dialog>
  )
}

export default NewGroup;