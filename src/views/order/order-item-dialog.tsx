import { TransitionDialog } from "@/compornets/transition-dialog";
import { Button, DialogContent, DialogTitle } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { getStatus } from "./order-tools";
import { Order, ProductEnum } from "./order-type";

type Props = {
  isOpen: boolean;
  order: Order | undefined;
  closeFn: () => void;
};

type CellType = {
  row: Order["orderItems"][0];
};

export function OrderItemDialog(props: Props) {
  const { isOpen, order, closeFn } = props;

  const cols: GridColDef[] = [
    {
      flex: 0.3,
      field: "petName",
      headerName: "寵物",
      renderCell: ({ row }: CellType) => {
        return <p>{row.pet.name}</p>;
      },
    },
    {
      flex: 0.3,
      field: "product",
      headerName: "產品",
      renderCell: ({ row }: CellType) => {
        return <p>{ProductEnum[row.product]}</p>;
      },
    },
    {
      flex: 0.3,
      field: "months",
      headerName: "數量",
      headerAlign: "center",
      align: "center",
      renderCell: ({ row }: CellType) => {
        return <p>{row.months}個月</p>;
      },
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
  ];

  const toPayment = () => {
    if (order)
      location.replace(
        `${process.env.BACK_END_URL}/api/Payment/${order.orderNumber}`
      );
  };

  return (
    <TransitionDialog
      open={isOpen}
      onClose={() => closeFn()}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>訂單內容</DialogTitle>
      <DialogContent>
        {order && (
          <>
            <div className="grid grid-cols-12 gap-y-4 mb-4 items-center">
              <div className="col-span-4">訂單編號：{order.orderNumber}</div>
              <div className="col-span-4">
                訂單金額：${new Intl.NumberFormat().format(order.price)}
              </div>
              <div className="col-span-4">
                訂單狀態：{getStatus(order.status)}
                {order.status === 1 && (
                  <div className="ml-4 inline-block">
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => {
                        toPayment();
                      }}
                    >
                      前往付款
                    </Button>
                  </div>
                )}
              </div>
              <div className="col-span-4">訂購人姓名：{order.ordererName}</div>
              <div className="col-span-4">訂購人電話：{order.ordererTel}</div>
              <div className="col-span-12">訂購人地址：{order.ordererAdd}</div>
              <div className="col-span-4">收件人姓名：{order.receiverName}</div>
              <div className="col-span-4">收件人電話：{order.receiverTel}</div>
              <div className="col-span-12">收件人地址：{order.receiverAdd}</div>
            </div>
            <DataGrid
              rows={order.orderItems}
              columns={cols}
              hideFooter
            ></DataGrid>
          </>
        )}
      </DialogContent>
    </TransitionDialog>
  );
}
