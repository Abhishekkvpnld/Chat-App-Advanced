import { Button, Dialog, DialogTitle, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { SampleUsers } from "../../constants/SampleChat";
import UserItem from "../shared/userItem";

const AddMemberDialog = ({ addMember, isLoadingAddMember, chatId }) => {

    const [members, setMembers] = useState(SampleUsers)
    const [selectedMembers, setSelectedMembers] = useState([])


    const selectMemberHandler = (id) => {

        setSelectedMembers((prev) => prev.includes(id) ?
            prev.filter((currentElement) => currentElement !== id)
            :
            [...prev, id]
        )
        console.log(selectedMembers);

    }


    const closeHandler = () => {
        setSelectedMembers([]);
        setMembers([]);
    };

    const addMemberSubmitHandler = () => {
closeHandler();
    };



    return (
        <Dialog open onClose={closeHandler}>
            <Stack p={"2rem"} spacing={"2rem"} width={"20rem"}>
                <DialogTitle textAlign={"center"}>Add Members</DialogTitle>
                <Stack spacing={"1rem"}>
                    {
                        members.length > 0 ? (members.map((i) => (
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
                    <Button onClick={addMemberSubmitHandler} disabled={isLoadingAddMember} color='success' variant='outlined'>Submit Changes</Button>
                </Stack>

            </Stack>

        </Dialog>
    )
}

export default AddMemberDialog;