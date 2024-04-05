import React, { Suspense, lazy, memo, useEffect, useState } from 'react';
import { Backdrop, Box, Button, Drawer, Grid, IconButton, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { KeyboardBackspace as KeyboardBackspaceIcon, Menu as MenuIcon, Edit as EditIcon, Done as DoneIcon, Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { matBlack } from '../constants/color';
import { useNavigate, useSearchParams } from "react-router-dom";
import { Link } from "../components/styles/StyledComponents";
import AvatarCard from "../components/shared/AvatarCard";
import { SampleChat, SampleUsers } from "../constants/SampleChat";
import UserItem from '../components/shared/userItem';
import { useMyGroupsQuery } from '../../redux/api/api';
import {useErrors} from "../hooks/hook";
import {LayoutLoader} from "../components/layout/LayoutLoader";

const ConfirmDeleteDialog = lazy(() => import("../components/dialogs/ConfirmDeleteDialog"));
const AddMemberDialog = lazy(() => import("../components/dialogs/AddMemberDialog"));

const isAddMember = false;

const Groups = () => {

  const navigate = useNavigate();
  const chatId = useSearchParams()[0].get("group");

  const myGroups = useMyGroupsQuery("");

  console.log(myGroups.data);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState("");
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false)

  const errors = [
    {
      isError: myGroups.isError,
      error: myGroups.error
    }
  ];

useErrors(errors);
  

  const navigateBack = () => {
    navigate("/")
  };

  const handleMobile = () => {
    setIsMobileMenuOpen((prev) => !prev)
  };

  const handleMobileClose = () => setIsMobileMenuOpen(false);

  const updateGroupName = () => {
    setIsEdit(false);
    console.log(groupNameUpdatedValue);
  };

  const openAddMemberHandler = () => {
    console.log("Add Members");
  };

  const openConfirmDeleteHandler = () => {
    console.log("Delete Group");
    setConfirmDeleteDialog(true);
  };


  const closeConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(false)
  };

  const deleteHandler = () => {
    console.log("delete handler");
    closeConfirmDeleteHandler();

  };

  const removeMemberHandler = (id) => {
    console.log("removeMember", id);
  }

  useEffect(() => {
    if (chatId) {
      setGroupName(`Group Name ${chatId}`);
      setGroupNameUpdatedValue(`Group Name ${chatId}`);
    }
    return () => {
      setGroupName("");
      setGroupNameUpdatedValue("");
      setIsEdit(false);
    }
  }, [chatId])

  const IconBtn = (
    <>

      <Box
        sx={{
          display: {
            xs: "block",
            sm: "none",
            position: "fixed",
            right: "1rem",
            top: "1rem"
          }
        }}
      >
        <IconButton onClick={handleMobile}>
          <MenuIcon />
        </IconButton>
      </Box>

      <Tooltip title={"back"}>

        <IconButton
          sx={{
            position: "absolute",
            top: "2rem",
            left: "2rem",
            bgcolor: matBlack,
            color: 'white',
            ":hover": {
              bgcolor: "rgba(0,0,0,0.7)"
            }
          }}
          onClick={navigateBack}
        >
          <KeyboardBackspaceIcon />
        </IconButton>

      </Tooltip>
    </>
  )



  const GroupName = (
    <Stack
      direction={"row"}
      alignItems={"center"}
      justifyContent={"center"}
      spacing={"1rem"}
      padding={"3rem"}
    >
      {
        isEdit ? (
          <>
            <TextField value={groupNameUpdatedValue} onChange={(e) => setGroupNameUpdatedValue(e.target.value)} />
            <IconButton onClick={updateGroupName}>
              <DoneIcon />
            </IconButton>
          </>
        ) : (
          <>
            <Typography variant='h4'>{groupName}</Typography>
            <IconButton onClick={() => setIsEdit(true)}><EditIcon /></IconButton>
          </>
        )
      }
    </Stack>
  )



  const ButtonGroup = (
    <Stack
      spacing={"1rem"}
      direction={{
        xs: "column-reverse",
        sm: "row"
      }}
      padding={{
        xs: "0",
        sm: "1rem",
        md: "1rem 4rem"
      }}
    >
      <Button size='large' color='error' variant='outlined' startIcon={<DeleteIcon />} onClick={openConfirmDeleteHandler}>
        Delete Group
      </Button>
      <Button size='large' variant='contained' startIcon={<AddIcon />} onClick={openAddMemberHandler}>
        Add Members
      </Button>

    </Stack>
  )



  return myGroups.isLoading ? <LayoutLoader/> : (
    <Grid container height={"100vh"}>
      <Grid
        item
        sx={{
          display: {
            xs: 'none',
            sm: "block"
          }
        }}
        sm={4}
        bgcolor={"bisque"}
      >
        <GroupList myGroups={SampleChat} chatId={chatId} />
      </Grid>

      <Grid item xs={12} sm={8}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          padding: "1rem 3rem",
        }}
      >
        {IconBtn}

        {groupName && <>

          {GroupName}

          <Typography
            margin={"2rem"}
            alignSelf={"flex-start"}
            variant='body1'
          >
            Members</Typography>

          <Stack
            maxWidth={"45rem"}
            width={"100%"}
            boxSizing={"border-box"}
            padding={{
              sm: "1rem",
              xs: "0",
              md: "1rem 4rem"
            }}
            spacing={"2rem"}
            // bgcolor={"lightgreen"}
            height={"50vh"}
            overflow={"auto"}
          >
            {/* Members Card */}

            {
              SampleUsers.map((i) => (
                <UserItem key={i._id} user={i} isAdded styling={{
                  boxShadow: "0 0 0.5rem rgba(0, 0, 0, 0.2)",
                  padding: "1rem 2rem",
                  borderRadius: "1rem"
                }}
                  handler={removeMemberHandler}
                />
              ))
            }

          </Stack>

          {ButtonGroup}

        </>}

      </Grid>


      {
        isAddMember && (
          <Suspense fallback={<Backdrop open />}>
            <AddMemberDialog />
          </Suspense>
        )
      }

      {
        confirmDeleteDialog && (
          <Suspense fallback={<Backdrop open />}>
            <ConfirmDeleteDialog open={confirmDeleteDialog}
              handleclose={closeConfirmDeleteHandler}
              deleteHandler={deleteHandler}
            />
          </Suspense>
        )
      }

      <Drawer open={isMobileMenuOpen} onClose={handleMobileClose}
        sx={{
          display: {
            xs: "block",
            sm: "none"
          }
        }}
      >
        <GroupList chatId={chatId} myGroups={SampleChat} w='50vw' />
      </Drawer>

    </Grid>
  )
}

const GroupList = ({ w = "100%", myGroups = [], chatId }) => {
  return (
    <Stack width={w}>
      {
        myGroups.length > 0 ? (
          myGroups.map((group) => <GroupListItem group={group} chatId={chatId} key={group._id} />)
        ) : (
          <Typography padding={"1rem"} textAlign={"center"} color={"blue"}>
            No groups
          </Typography>
        )
      }
    </Stack>
  )
};

const GroupListItem = memo(({ group, chatId }) => {
  const { name, avatar, _id } = group;
  return <Link to={`?group=${_id}`}
    onClick={(e) => {
      if (chatId === _id) e.preventDefault();
    }}
  >
    <Stack
      direction={"row"}
      spacing={"1rem"}
      alignItems={"center"}
    >
      <AvatarCard avatar={avatar} />
      <Typography>{name}</Typography>
    </Stack>
  </Link>
});

export default Groups;