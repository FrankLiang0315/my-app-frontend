import FormTextField from "@/compornets/form-text-field";
import { Button, Divider } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SendPost } from "@/tools/send-api";
import Checkbox from "@mui/material/Checkbox";
import { ChangeEvent } from "react";

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

const ordererFields = [
  { name: "ordererName", label: "訂購人姓名", size: "s" },
  { name: "ordererTel", label: "訂購人電話", size: "s" },
  { name: "ordererAdd", label: "訂購人地址", size: "l" },
];

const receiverFields = [
  { name: "receiverName", label: "收件人姓名", size: "s" },
  { name: "receiverTel", label: "收件人電話", size: "s" },
  { name: "receiverAdd", label: "收件人地址", size: "l" },
];

export function CartConfirm({ items, pets }: Props) {
  const form = useForm<Inputs>({
    resolver: yupResolver(schema),
  });

  const { handleSubmit, setValue, getValues } = form;

  const cols: GridColDef[] = [
    {
      flex: 1,
      minWidth: 150,
      field: "petName",
      headerName: "寵物名稱",
      renderCell: ({ row }: CellType) => {
        return <p>{pets.find((pet) => pet.id === row.petId)?.name}</p>;
      },
    },
    {
      flex: 1,
      minWidth: 150,
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
      flex: 1,
      minWidth: 150,
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

  const sameAsOrder = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setValue("receiverAdd", getValues("ordererAdd"));
      setValue("receiverName", getValues("ordererName"));
      setValue("receiverTel", getValues("ordererTel"));
    }
  };

  return (
    <>
      <form
        className="flex flex-col gap-3"
        onSubmit={handleSubmit((data) => CreateOrder(data))}
      >
        <div className="card p-5">
          <div>
            <p className="m-0 mb-5 text-xl font-bold">訂購資訊</p>
            <div className="w-full m-auto grid grid-cols-12 gap-4">
              {ordererFields.map((of) => {
                return (
                  <div
                    key={of.name}
                    className={
                      of.size === "l"
                        ? "col-span-12"
                        : "col-span-12 sm:col-span-6"
                    }
                  >
                    <FormTextField
                      size={"small"}
                      fullWidth
                      form={form}
                      label={of.label}
                      name={of.name}
                    ></FormTextField>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="my-5">
            <Divider></Divider>
          </div>
          <div>
            <p className="m-0 mb-5 text-xl font-bold">收件資訊</p>
            <div className="col-span-12 ml-[-9px]">
              <Checkbox onChange={(event) => sameAsOrder(event)} />
              同訂購人
            </div>
            <div className="w-full m-auto grid grid-cols-12 gap-4">
              {receiverFields.map((rf) => {
                return (
                  <div
                  key={rf.name}
                    className={
                      rf.size === "l"
                        ? "col-span-12"
                        : "col-span-12 sm:col-span-6"
                    }
                  >
                    <FormTextField
                      size={"small"}
                      fullWidth
                      form={form}
                      label={rf.label}
                      name={rf.name}
                    ></FormTextField>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="my-5">
            <Divider></Divider>
          </div>
          <div>
            <p className="m-0 mb-5 text-xl font-bold">付款資訊</p>
            <Button variant="outlined">信用卡/金融卡</Button>
          </div>
          <div className="my-5">
            <Divider></Divider>
          </div>
          <div>
            <p className="m-0 mb-5 text-xl font-bold">訂購內容</p>
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
          </div>
          <div className="flex justify-center mt-5">
            <Button variant="contained" type="submit">
              確認結帳
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}
