import FormTextField from "@/compornets/form-text-field";
import { Button } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SendPost } from "@/tools/send-api";

type ConfirmItem = {
  petId: number;
  itemName: string;
  months: number;
  price: number;
};

type Pet = {
  id: number;
  name: string;
  dailyGrams: number;
};

type CellType = {
  row: ConfirmItem;
};

type Props = {
  items: ConfirmItem[];
  pets: Pet[];
};
type Inputs = {
  ordererName: string;
  ordererTel: string;
  ordererAdd: string;
  receiverName: string;
  receiverTel: string;
  receiverAdd: string;
};

const schema = yup
  .object({
    ordererName: yup.string().required("必填"),
    ordererTel: yup.string().required("必填"),
    ordererAdd: yup.string().required("必填"),
    receiverName: yup.string().required("必填"),
    receiverTel: yup.string().required("必填"),
    receiverAdd: yup.string().required("必填"),
  })
  .required();

export function CartConfirm({ items, pets }: Props) {
  const form = useForm<Inputs>({
    resolver: yupResolver(schema),
  });

  const { handleSubmit } = form;

  const cols: GridColDef[] = [
    {
      flex: 0.3,
      field: "petName",
      headerName: "寵物名稱",
      renderCell: ({ row }: CellType) => {
        return <p>{pets.find((pet) => pet.id === row.petId)?.name}</p>;
      },
    },
    {
      flex: 0.3,
      field: "itemName",
      headerName: "產品",
      renderCell: ({ row }: CellType) => {
        return (
          <p>
            {row.itemName}（{row.months}個月）
          </p>
        );
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

  const CreateOrder = async (order: Inputs) => {
    const res = await SendPost("Order/create", {
      items: items,
      ...order,
    });

    if (res?.status === "Success") {
      location.replace(
        `${process.env.BACK_END_URL}/api/Payment/${res.data.orderNumber}`
      );
    }
  };

  return (
    <>
      <form
        className="flex flex-col gap-3"
        onSubmit={handleSubmit((data) => CreateOrder(data))}
      >
        <div className="card p-5">
          <div className="w-[500px] m-auto grid grid-cols-5 gap-y-4">
            <div className="col-span-2 flex items-center">訂購人姓名</div>
            <div className="col-span-3 items-center">
              <FormTextField
                size={"small"}
                fullWidth
                form={form}
                name={"ordererName"}
              ></FormTextField>
            </div>
            <div className="col-span-2 flex items-center">訂購人電話</div>
            <div className="col-span-3 items-center">
              <FormTextField
                size={"small"}
                fullWidth
                form={form}
                name={"ordererTel"}
              ></FormTextField>
            </div>
            <div className="col-span-2 flex items-center">訂購人地址</div>
            <div className="col-span-3 items-center">
              <FormTextField
                size={"small"}
                fullWidth
                form={form}
                name={"ordererAdd"}
              ></FormTextField>
            </div>
            <div className="col-span-2 flex items-center">收件人姓名</div>
            <div className="col-span-3 items-center">
              <FormTextField
                size={"small"}
                fullWidth
                form={form}
                name={"receiverName"}
              ></FormTextField>
            </div>
            <div className="col-span-2 flex items-center">收件人電話</div>
            <div className="col-span-3 items-center">
              <FormTextField
                size={"small"}
                fullWidth
                form={form}
                name={"receiverTel"}
              ></FormTextField>
            </div>
            <div className="col-span-2 flex items-center">收件人地址</div>
            <div className="col-span-3 items-center">
              <FormTextField
                size={"small"}
                fullWidth
                form={form}
                name={"receiverAdd"}
              ></FormTextField>
            </div>
          </div>
        </div>
        <DataGrid
          rowSelection={false}
          hideFooterPagination
          hideFooter
          rowHeight={100}
          columns={cols}
          rows={items}
          getRowId={(row) => row.petId + row.itemName}
          disableRowSelectionOnClick
        ></DataGrid>
        <div className="flex justify-center">
          <Button variant="contained" type="submit">
            確認結帳
          </Button>
        </div>
      </form>
    </>
  );
}
