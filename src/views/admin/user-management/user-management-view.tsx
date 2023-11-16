"use client"

import { AuthContext } from "@/context/auth-context";
import { MessageContext } from "@/context/message-context";
import { getFormatDate } from "@/tools/format";
import { SendGet, SendPost } from "@/tools/send-api";
import { getAdminStatus } from "@/views/order/order-tools";
import { Order, StatusEnum } from "@/views/order/order-type";
import { Button } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { notFound, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

type User = {
  id: string;
  userName: string;
  email: string;
}

type CellType = {
    row: User;
  };

export default function UserManagementView() {
    const auth = useContext(AuthContext);
    const [users, setUsers] = useState<Order[]>([]);
    const searchParams = useSearchParams();
    const message = useContext(MessageContext);

    
  useEffect(() => {
    console.log(localStorage.getItem("isAdmin"));
    if (localStorage.getItem("isAdmin") !== "true") {
      return notFound();
    }
  });

  useEffect(()=>{
    SendGet("User/list").then((res)=>{
      setUsers(res.data); 
    });
  },[])

  const cols: GridColDef[] = [
    {
      flex: 1,
      minWidth:200,
      field: "id",
      headerName: "用戶代號",
    },
    {
      flex: 1,
      minWidth:150,
      field: "userName",
      headerName: "名稱",
    },
    {
        flex:1,
        minWidth:200,
        field: "email",
        headerName: "信箱"
    },
    
  ];



  return (
  <DataGrid
    rowSelection={false}
    hideFooterPagination
    hideFooter
    // rowHeight={100}
    columns={cols}
    rows={users}
    getRowId={(row) => row.id}
    disableRowSelectionOnClick
  ></DataGrid>
  );
}