import { Button, Dialog, DialogTitle, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { SampleUsers } from "../../constants/SampleChat";
import UserItem from "../shared/userItem";
import { useAsyncMutation, useErrors } from '../../hooks/hook';
import { useAddGroupMembersMutation, useAvailableFriendsQuery } from '../../../redux/api/api';
import { useSelector, useDispatch } from "react-redux";
import { setIsAddMember } from '../../../redux/reducers/misc';
import { Skeleton } from "@mui/material";

const AddMemberDialog = ({ chatId }) => {

    const dispatch = useDispatch();

    const { isAddMember } = useSelector((state) => state.misc);
    const { isLoading, data, isError, error } = useAvailableFriendsQuery(chatId);

    const [selectedMembers, setSelectedMembers] = useState([])

    const [addMembers, isLoadingAddMembers] = useAsyncMutation(useAddGroupMembersMutation);

    const selectMemberHandler = (id) => {

        setSelectedMembers((prev) => prev.includes(id) ?
            prev.filter((currentElement) => currentElement !== id)
            :
            [...prev, id]
        );
    };


    const closeHandler = () => {
        dispatch(setIsAddMember(false));
    };


    const addMemberSubmitHandler = () => {
        addMembers("Adding Members...", { members: selectedMembers, chatId });
        closeHandler();
    };

    useErrors([{ error, isError }]);

    return (
        <Dialog open={isAddMember} onClose={closeHandler}>
            <Stack p={"2rem"} spacing={"2rem"} width={"20rem"}>
                <DialogTitle textAlign={"center"}>Add Members</DialogTitle>
                <Stack spacing={"1rem"}>
                    {isLoading ? (<Skeleton />) :
                        data?.friends?.length > 0 ? (data?.friends?.map((i) => (
                            <UserItem
                                key={i._id}
                                user={i}
                                handler={selectMemberHandler}
                                isAdded={selectedMembers.includes(i._id)}
                            />
                        ))
                        ) : (
                            <Typography textAlign={"center"}>No Friends</Typography>
                        )
                    }
                </Stack>

                <Stack direction={"row"} alignItems={"center"} justifyContent={"space-evenly"}>
                    <Button color='error' variant='outlined' onClick={closeHandler}>Cancel</Button>
                    <Button onClick={addMemberSubmitHandler} disabled={isLoadingAddMembers} color='success' variant='outlined'>Submit Changes</Button>
                </Stack>

            </Stack>

        </Dialog>
    )
}

export default AddMemberDialog;