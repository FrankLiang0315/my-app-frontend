"use client";
import { Loading } from "@/compornets/loading";
import { AuthContext } from "@/context/auth-context";
import {
  Button
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { SendGet } from "@/tools/send-api";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { getClientStatus } from "./order-tools";
import { Order } from "./order-type";
import { OrderItemDialog } from "./order-item-dialog";
import { getFormatDate } from "@/tools/format";

type CellType = {
  row: Order;
};

export default function OrderView() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [targetOrder, setTargerOrder] = useState<Order>();
  const auth = useContext(AuthContext);
  const route = useRouter();

  useEffect(() => {
    if (!auth.isLogin) {
      auth.getUserInfo();
    }
    SendGet("Order/list").then((res) => {
      if (res?.status === "Success") {
        setOrders(res.data);
      }
    });
  }, []);

  const cols: GridColDef[] = [
    {
      field: "orderNumber",
      headerName: "訂單編號",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "price",
      headerName: "金額",
      minWidth: 150,
      flex: 1,
      headerAlign: "right",
      align: "right",
      renderCell: ({ row }: CellType) => {
        return <p>${new Intl.NumberFormat().format(row.price)}</p>;
      },
    },
    {
      field: "status",
      headerName: "狀態",
      minWidth: 150,
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: ({ row }: CellType) => {
        return <p>{getClientStatus(row.status)}</p>;
      },
    },
    {
      field: "createdAt",
      headerName: "建立時間",
      minWidth: 150,
      flex: 1,
      // headerAlign: "right",
      // align: "right",
      renderCell: ({ row }: CellType) => {
        return <p>{getFormatDate(new Date(row.createdAt))}</p>;
      },
    },
    {
      field: "button",
      headerName: "",
      minWidth: 150,
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: ({ row }: CellType) => {
        return (
          <Button variant="contained" onClick={() => clickOpenDetail(row)}>
            內容
          </Button>
        );
      },
    },
  ];

  const clickOpenDetail = (order: Order) => {
    setTargerOrder(order);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setTargerOrder(undefined);
    setIsDialogOpen(false);
  };

  return (
    <>
      <div className="m-auto w-full max-w-[1000px]">
        {!auth.isLogin && <Loading />}
        {auth.isLogin && (
          <div className="text-center">
            <p className="text-3xl font-bold">訂單查詢</p>
            <DataGrid
              rowSelection={false}
              hideFooterPagination
              hideFooter
              rowHeight={100}
              columns={cols}
              rows={orders}
              getRowId={(row) => row.id}
              disableRowSelectionOnClick
              sx={{backgroundColor:"white"}}
            ></DataGrid>
            <OrderItemDialog
              isOpen={isDialogOpen}
              closeFn={closeDialog}
              order={targetOrder}
            ></OrderItemDialog>
          </div>
        )}
      </div>
    </>
  );
}
