"use client";
import { Loading } from "@/compornets/loading";
import { AuthContext } from "@/context/auth-context";
import {
  Button,
  CircularProgress,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import PetsIcon from "@mui/icons-material/Pets";
import { TransitionDialog } from "@/compornets/transition-dialog";
import { SendGet } from "@/tools/send-api";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { getStatus } from "./order-tools";
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
      flex: 0.3,
      field: "orderNumber",
      headerName: "訂單編號",
    },
    {
      flex: 0.3,
      field: "price",
      headerName: "金額",
      headerAlign: "right",
      align: "right",
      renderCell: ({ row }: CellType) => {
        return <p>${new Intl.NumberFormat().format(row.price)}</p>;
      },
    },
    {
      flex: 0.3,
      field: "status",
      headerName: "狀態",
      headerAlign: "center",
      align: "center",
      renderCell: ({ row }: CellType) => {
        return <p>{getStatus(row.status)}</p>;
      },
    },
    {
      flex: 0.3,
      field: "createdAt",
      headerName: "建立時間",
      // headerAlign: "right",
      // align: "right",
      renderCell: ({ row }: CellType) => {
        return <p>{getFormatDate(new Date(row.createdAt))}</p>;
      },
    },
    {
      flex: 0.3,
      field: "button",
      headerName: "",
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
            ></DataGrid>
            <OrderItemDialog isOpen={isDialogOpen} closeFn={closeDialog} order={targetOrder}></OrderItemDialog>
          </div>
        )}
      </div>
      
    </>
  );
}
