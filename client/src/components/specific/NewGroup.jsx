import React, { useState } from 'react';
import UserItem from '../shared/userItem';
import { Button, Dialog, DialogTitle, Stack, TextField, Typography } from '@mui/material';
import { useInputValidation } from "6pp";
import { useDispatch } from "react-redux";
import { useAvailableFriendsQuery, useNewGroupMutation } from '../../../redux/api/api';
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import { Skeleton } from '@mui/material';
import { setIsNewGroup } from "../../../redux/reducers/misc";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

const NewGroup = () => {

  const dispatch = useDispatch();
  const { isNewGroup } = useSelector((state) => state.misc);
  const { isError, isLoading, error, data } = useAvailableFriendsQuery();

  const [newGroup, isLoadingNewGroup] = useAsyncMutation(useNewGroupMutation);

  const groupName = useInputValidation("");

  const [selectedMembers, setSelectedMembers] = useState([])

  const errors = [{
    isError,
    error
  }];

  useErrors(errors);

  const selectMemberHandler = (id) => {

    setSelectedMembers((prev) => prev.includes(id) ?
      prev.filter((currentElement) => currentElement !== id)
      :
      [...prev, id]
    )
    console.log(selectedMembers);

  }


  const submitHandler = () => {

    if (!groupName.value)
      return toast.error("Group name is required");

    if (selectedMembers.length < 2)
      return toast.error("Please Select Atleast 2 Members");

      newGroup("Creating New Group...",{name:groupName.value,members:selectedMembers});

    closeHandler();
  };

  const closeHandler = () => {
    dispatch(setIsNewGroup(false));
  };

  return (
    <Dialog open={isNewGroup} onClose={closeHandler}>
      <Stack p={{ xs: "1rem", sm: "2rem" }} width={"25rem"} spacing={"2rem"}>
        <DialogTitle textAlign={"center"} variant='h4'>New Group</DialogTitle>

        <TextField label="Group Name" value={groupName.value} onChange={groupName.changeHandler} />
        <Typography variant='body1'>Members</Typography>

        <Stack>
          {isLoading ? <Skeleton /> :
            data?.friends?.map((i) => (
              <UserItem
                user={i}
                key={i._id}
                handler={selectMemberHandler}
                isAdded={selectedMembers.includes(i._id)} />
            ))
          }
        </Stack>

        <Stack direction={"row"} justifyContent={"space-evenly"}>
          <Button variant='outlined' color='error' size='large' onClick={closeHandler}>Cancel</Button>
          <Button color='success' variant='contained' size='large' onClick={submitHandler} disabled={isLoadingNewGroup} >Create</Button>
        </Stack>

      </Stack>
    </Dialog>
  )
}

export default NewGroup;