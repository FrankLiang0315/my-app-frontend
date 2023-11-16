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


type CellType = {
    row: Order;
  };

export default function OrderManagementView() {
    const auth = useContext(AuthContext);
    const [orders, setOrders] = useState<Order[]>([]);
    const searchParams = useSearchParams();
    const message = useContext(MessageContext);

    
  useEffect(() => {
    console.log(localStorage.getItem("isAdmin"));
    if (localStorage.getItem("isAdmin") !== "true") {
      return notFound();
    }
  });

  useEffect(()=>{
    logisticsShowDialog();
    SendGet("Order/list-all").then((res)=>{
        setOrders(res.data); 
    });
  },[])

  const cols: GridColDef[] = [
    {
      flex: 1,
      minWidth:150,
      field: "orderNumber",
      headerName: "訂單編號",
    },
    {
        flex:1,
        minWidth:150,
        field: "userName.user.userName",
        headerName: "用戶",
        renderCell: ({ row }: CellType) => {
          return <p>{row?.user?.userName}</p>;
        }
    },
    {
      flex: 1,
      minWidth:150,
      field: "price",
      headerName: "金額",
      headerAlign: "right",
      align: "right",
      renderCell: ({ row }: CellType) => {
        return <p>${new Intl.NumberFormat().format(row.price)}</p>;
      },
    },
    {
      flex: 1,
      minWidth:150,
      field: "status",
      headerName: "狀態",
      headerAlign: "center",
      align: "center",
      renderCell: ({ row }: CellType) => {
        return <p>{getAdminStatus(row.status)}</p>;
      },
    },
    {
      flex: 1,
      minWidth:150,
      field: "createdAt",
      headerName: "建立時間",
      // headerAlign: "right",
      // align: "right",
      renderCell: ({ row }: CellType) => {
        return <p>{getFormatDate(new Date(row.createdAt))}</p>;
      },
    },
    {
      flex: 1,
      minWidth:150,
      field: "button",
      headerName: "操作",
      headerAlign: "center",
      align: "center",
      renderCell: ({ row }: CellType) => {
        return row.status === StatusEnum.PendingLogistics && (
          
          <Button variant="contained" onClick={() => {Logistics(row.orderNumber)}}>
            建立貨運單
          </Button>
        );
      },
    },
  ];

  const Logistics = (orderNumber: string) =>{
    location.replace(`${process.env.BACK_END_URL}/api/Logistics/${orderNumber}`);
  } 

  const logisticsShowDialog = () => {
    const logisticsStatus =  searchParams.get('logisticsStatus');
    const orderNumber =  searchParams.get('orderNumber');
    const errorMessage =  searchParams.get('errorMessage');
    if(logisticsStatus === "1") {
      message.showDialog("success",`${orderNumber} 貨運單建立成功`)
    } else if (logisticsStatus === "0") {
      message.showDialog("error",`${orderNumber} 貨運單建立失敗 ${errorMessage}`)
    }
  };


  return (
  <DataGrid
    rowSelection={false}
    hideFooterPagination
    hideFooter
    // rowHeight={100}
    columns={cols}
    rows={orders}
    getRowId={(row) => row.id}
    disableRowSelectionOnClick
  ></DataGrid>
  );
}