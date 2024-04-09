import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import Table from '../../components/shared/Table';
import { Avatar } from '@mui/material';
import { transformImage } from "../../lib/Features";
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
    field: "avatar",
    headerName: "Avatar",
    headerClassName: "table-header",
    width: 150,
    renderCell: (params) => (
      <Avatar alt={params.row.name} src={params.row.avatar} />
    )
  },

  {
    field: "name",
    headerName: "Name",
    headerClassName: "table-header",
    width: 200
  },
  {
    field: "username",
    headerName: "Username",
    headerClassName: "table-header",
    width: 200
  },
  {
    field: "friends",
    headerName: "Friends",
    headerClassName: "table-header",
    width: 200
  },
  {
    field: "groups",
    headerName: "Groups",
    headerClassName: "table-header",
    width: 200
  },
]

const UserManagement = () => {

  const { loading, data, error } = useFetchData(`${server}/api/v1/admin/users`, "dashboard-users");

  useErrors([
    {
      isError: error,
      error: error
    }
  ]);


  const [rows, setRows] = useState([]);


  useEffect(() => {

    if (data) {
      setRows(data.users.map(
        (i) => ({
          ...i,
          id: i._id,
          avatar: transformImage(i.avatar, 50)
        })));
    };

  }, [data]);


  return (
    <AdminLayout>
      {
        loading ? <Skeleton height={"100vh"} /> :
          <Table heading={"All Users"} rows={rows} column={column} />
      }
    </AdminLayout>
  )
}

export default UserManagement;