import React, { Suspense, lazy, memo, useEffect, useState } from 'react';
import { Backdrop, Box, Button, Drawer, Grid, IconButton, Stack, TextField, Tooltip, Typography, CircularProgress } from "@mui/material";
import { KeyboardBackspace as KeyboardBackspaceIcon, Menu as MenuIcon, Edit as EditIcon, Done as DoneIcon, Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { matBlack } from '../constants/color';
import { useNavigate, useSearchParams } from "react-router-dom";
import { Link } from "../components/styles/StyledComponents";
import AvatarCard from "../components/shared/AvatarCard";
import UserItem from '../components/shared/userItem';
import { useChatDetailsQuery, useDeleteChatMutation, useMyGroupsQuery, useRemoveGroupMemberMutation, useRenameGroupMutation } from '../../redux/api/api';
import { useAsyncMutation, useErrors } from "../hooks/hook";
import { LayoutLoader } from "../components/layout/LayoutLoader";
import { useDispatch, useSelector } from "react-redux";
import { setIsAddMember } from '../../redux/reducers/misc';
import Header from '../components/layout/Header';

const ConfirmDeleteDialog = lazy(() => import("../components/dialogs/ConfirmDeleteDialog"));
const AddMemberDialog = lazy(() => import("../components/dialogs/AddMemberDialog"));


const Groups = () => {

  const chatId = useSearchParams()[0].get("group");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAddMember } = useSelector((state) => state.misc);

  const myGroups = useMyGroupsQuery("");

  const groupDetails = useChatDetailsQuery(
    { chatId, populate: true },
    { skip: !chatId });

  const [updateGroup, isLoadingGroupName] = useAsyncMutation(useRenameGroupMutation);
  const [removeMember, isLoadingRemoveMember] = useAsyncMutation(useRemoveGroupMemberMutation);
  const [deleteGroup, isLoadingDeleteGroup] = useAsyncMutation(useDeleteChatMutation);


  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState("");
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false)
  const [members, setMembers] = useState([]);


  const errors = [
    {
      isError: myGroups.isError,
      error: myGroups.error
    },
    {
      isError: groupDetails.isError,
      error: groupDetails.error
    }
  ];

  useErrors(errors);


  useEffect(() => {
    const groupData = groupDetails.data
    if (groupData) {
      setGroupName(groupData.chat.name);
      setGroupNameUpdatedValue(groupData.chat.name);
      setMembers(groupData.chat.members)
    };

    return () => {
      setGroupName("");
      setGroupNameUpdatedValue("");
      setMembers([]);
      setIsEdit(false);
    };

  }, [groupDetails.data]);


  const navigateBack = () => {
    navigate("/")
  };


  const handleMobile = () => {
    setIsMobileMenuOpen((prev) => !prev)
  };


  const handleMobileClose = () => setIsMobileMenuOpen(false);


  const updateGroupName = () => {
    setIsEdit(false);
    updateGroup("Updating Group Name...", {
      chatId,
      name: groupNameUpdatedValue
    });
  };


  const openAddMemberHandler = () => {
    dispatch(setIsAddMember(true));
  };


  const openConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(true);
  };


  const closeConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(false)
  };

  const deleteHandler = () => {
    deleteGroup("Deleting Group...", chatId);
    closeConfirmDeleteHandler();
    navigate("/");
  };


  const removeMemberHandler = (userId) => {
    removeMember("Removing Member...", { chatId, userId })
  };


  // useEffect(() => {
  //   const groupData = groupDetails.data
  //   if (chatId) {
  //     setGroupName(groupData.chat.name);
  //     setGroupNameUpdatedValue(groupData.chat.name);
  //   }
  //   return () => {
  //     setGroupName("");
  //     setGroupNameUpdatedValue("");
  //     setIsEdit(false);
  //   }
  // }, [chatId]);



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
            <IconButton onClick={updateGroupName} disabled={isLoadingGroupName}>
              <DoneIcon />
            </IconButton>
          </>
        ) : (
          <>
            <Typography variant='h4'>{groupName}</Typography>
            <IconButton onClick={() => setIsEdit(true)} disabled={isLoadingGroupName}><EditIcon /></IconButton>
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



  return myGroups?.isLoading ? <LayoutLoader /> : (
    
    <Grid container height={"100vh"}>

      <Grid
        item
        sx={{
          display: {xs: 'none', sm: "block"}}}
        sm={4}
        bgcolor={"#48D1CC"}
      >
        <Typography textAlign={"center"} padding={"1rem"}>Groups</Typography>
        <GroupList myGroups={myGroups?.data?.groups} chatId={chatId} />
      </Grid>


      <Grid item xs={12} sm={8}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          padding: "1rem 1.5rem",
        }}
      >
        {IconBtn}

        {groupName && <>

          {GroupName}

          <Typography
            margin={"2rem"}
            alignSelf={"flex-start"}
            variant='body1'
            style={{ fontSize: "2rem", color: "blueviolet" }}
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
            spacing={"0.1rem"}
            height={"50vh"}
            overflow={"auto"}
          >
            {/* Members Card */}

            {isLoadingRemoveMember ? <CircularProgress /> :
              members?.map((i) => (
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

        </>
        }

      </Grid>


      {
        isAddMember && (
          <Suspense fallback={<Backdrop open />}>
            <AddMemberDialog chatId={chatId} />
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
        <GroupList chatId={chatId} myGroups={myGroups?.data?.groups} w='50vw' />
      </Drawer>

    </Grid>
  )
}

const GroupList = ({ w = "100%", myGroups = [], chatId }) => {
  return (
    <Stack width={w}>
      {
        myGroups.length > 0 ? (
          myGroups.map((group) =>
            <GroupListItem group={group} chatId={chatId} key={group._id} />)
        ) : (
          <div>
            <Typography paddingTop={"70%"} textAlign={"center"} color={"black"} fontSize={"25px"}>
              No Groups
            </Typography>
          </div>
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