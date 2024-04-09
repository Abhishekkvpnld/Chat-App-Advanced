import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import Table from '../../components/shared/Table';
import { Dashboard } from '@mui/icons-material';
import { fileFormat, transformImage } from '../../lib/Features';
import moment from 'moment';
import { Avatar, Box, Stack } from '@mui/material';
import RenderAttachment from "../../components/shared/RenderAttachment";
import { useFetchData } from "6pp";
import { server } from '../../constants/config';
import { useErrors } from "../../hooks/hook";
import { Skeleton } from "@mui/material";

const column = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 200
  },
  {
    field: "attachment",
    headerName: "Attachments",
    headerClassName: "table-header",
    width: 200,
    renderCell: (params) => {

      const { attachment } = params.row;

      return attachment?.length > 0 ?
        attachment.map((i, index) => {

          const url = i.url;
          const file = fileFormat(url);


          return (
            <Box key={index}>
              <a href={url} download target='_blank' style={{ color: "black" }}>
                {RenderAttachment(file, url)}
              </a>
            </Box>
          )
        })
        : "No Attachments";
    }

  },

  {
    field: "content",
    headerName: "Content",
    headerClassName: "table-header",
    width: 400
  },
  {
    field: "sender",
    headerName: "Sent By",
    headerClassName: "table-header",
    width: 200,
    renderCell: (params) => (
      <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
        <Avatar alt={params.row.sender.name} src={params.row.sender.avatar} />
        <span>{params.row.sender.name}</span>
      </Stack>
    )
  },
  {
    field: "chat",
    headerName: "Chat",
    headerClassName: "table-header",
    width: 220
  },
  {
    field: "groupChat",
    headerName: "Group Chat",
    headerClassName: "table-header",
    width: 100
  },
  {
    field: "createdAt",
    headerName: "Time",
    headerClassName: "table-header",
    width: 250
  },
]

const MessageManagement = () => {

  const { loading, data, error } = useFetchData(`${server}/api/v1/admin/messages`, "dashboard-messages");

  useErrors([
    {
      isError: error,
      error: error
    }
  ]);

  const [rows, setRows] = useState([]);

  useEffect(() => {
   if(data){
    setRows(data.messages.map((i) => ({
      ...i,
      id: i._id,
      sender: {
        name: i.sender.name,
        avatar: transformImage(i.sender.avatar, 50)
      },
      createdAt: moment(i.createdAt, "YYYY-MM-DDTHH:mm:ss:SSSZ").format("MMMM Do YYYY, h:mm:ss a")
    })))
   }
  }, [data]);

  return (
    <AdminLayout>
      {
        loading ? <Skeleton height={"100vh"}/> :
          <Table
            heading={"All Messages"}
            column={column}
            rows={rows}
            rowHeight={200}
          />
      }
    </AdminLayout>
  )
}

export default MessageManagement;