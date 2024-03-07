import { Dialog, DialogTitle, InputAdornment, List, ListItem, ListItemText, Stack, TextField } from '@mui/material';
import React, { useState } from 'react';
import { useInputValidation } from '6pp';
import { Search as SearchIcon } from "@mui/icons-material";
import UserItem from '../shared/userItem';
import { SampleUsers } from '../../constants/SampleChat';


const Search = () => {

  const search = useInputValidation('')

let isLoadingSendFriendRequest = false;
const [user, setuser] = useState(SampleUsers)

const addFriendHandler = (id)=>{
  console.log(id);
}

  return (
    <Dialog open>
      <Stack p={"2rem"} direction={"column"} width={"25rem"}>
        <DialogTitle textAlign={"center"} >Find People</DialogTitle>
        <TextField
          label=""
          value={search.valuer}
          onChange={search.changeHandler}
          variant='outlined'
          size='small'
          InputProps={
            {
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon />
                </InputAdornment>
              )
            }
          }
        />

<List>
{
  user.map((user)=>(
  <UserItem
  user={user} key={user._id} 
  handler={addFriendHandler}
  handlerIsLoading={isLoadingSendFriendRequest}
  />
  ))
}
</List>

      </Stack>
    </Dialog>
  )
}

export default Search