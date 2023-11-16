import { FormAutocomplete } from "@/compornets/form-autocomplete";
import { AuthContext } from "@/context/auth-context";
import { MessageContext } from "@/context/message-context";
import { SendGet, SendPost } from "@/tools/send-api";
import {
  Autocomplete,
  Button,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useContext, useEffect, useState } from "react";
import { CartConfirm } from "./cart-confirm";

type Pet = {
  id: number;
  name: string;
  dailyGrams: number;
};

type ConfirmItem = {
  petId: number;
  itemName: string;
  months: number;
  price: number;
};

type CellType = {
  row: Pet;
};

const options = [
  { label: "無", value: 0 },
  { label: "一個月", value: 1 },
  { label: "三個月", value: 3 },
  { label: "六個月", value: 6 },
  { label: "一年", value: 12 },
];

export default function CartView() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [cartItems, setCartItems] = useState<{ id: number; value: number }[]>(
    []
  );
  const [confirmItems, setConfirmItems] = useState<ConfirmItem[]>([]);
  const [confirmStep, setConfirmStep] = useState<boolean>(false);
  const auth = useContext(AuthContext);
  const message = useContext(MessageContext);

  useEffect(() => {
    if (!auth.isLogin) {
      auth.getUserInfo();
    }
    SendGet("Pet/list").then((res) => {
      console.log(res);
      if (res?.status === "Success") {
        setPets(res.data);
      }
    });
  }, []);

  useEffect(() => {
    console.log(cartItems);
  }, [cartItems]);

  useEffect(() => {
    console.log(pets);
  }, [pets]);

  const cols: GridColDef[] = [
    { flex: 1, minWidth: 150, field: "name", headerName: "寵物名稱" },
    {
      flex: 1,
      minWidth: 400,
      field: "products",
      headerName: "產品",
      renderCell: ({ row }: CellType) => {
        return (
          <div className="w-full grid grid-cols-4">
            <div className="flex items-center">狗糧方案</div>
            <div className="col-span-3 items-center">
              <Select
                value={cartItems.find((item) => item.id === row.id)?.value ?? 0}
                onChange={(event) => {
                  console.log(event.target.value);

                  let newCartItems = structuredClone(cartItems);
                  let repeatIndex = newCartItems.findIndex(
                    (value) => value.id === row.id
                  );
                  console.log(repeatIndex);
                  if (repeatIndex === -1) {
                    newCartItems.push({
                      id: row.id,
                      value: parseInt(event.target.value.toString()),
                    });
                  } else {
                    newCartItems[repeatIndex] = {
                      id: row.id,
                      value: parseInt(event.target.value.toString()),
                    };
                  }
                  setCartItems(newCartItems);
                }}
                fullWidth
                size="small"
              >
                {options.map((option) => {
                  return (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  );
                })}
              </Select>
            </div>
          </div>
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
        return (
          <p>${new Intl.NumberFormat().format(getPricePerMonth(row))}/月</p>
        );
      },
    },
  ];

  const getPrice = (pet: Pet) => {
    const month = cartItems.find((value) => value.id === pet.id)?.value;
    const basePrice = Math.floor(pet.dailyGrams / 40) * 10 + 500;
    switch (month) {
      case 1:
        return basePrice;
      case 3:
        return basePrice * 3 - 300;
      case 6:
        return basePrice * 6 - 1200;
      case 12:
        return basePrice * 12 - 2400;
      default:
        return 0;
    }
  };

  const getPricePerMonth = (pet: Pet) => {
    const month = cartItems.find((value) => value.id === pet.id)?.value;
    const price = getPrice(pet);
    if (!month) {
      return 0;
    }
    return Math.floor(price / month);
  };

  const totalPrice = () => {
    let price = 0;
    pets.forEach((pet) => {
      price += getPrice(pet);
    });
    return price;
  };
  const toConfirmStep = async () => {
    const items = cartItems.filter((item) => item.value > 0);
    if (items.length === 0) {
      message.showDialog("error", "未輸入任何產品！");
    } else {
      let confirmItems: { petId: number; product: number; months: number }[] =
        [];

      items.forEach((item) => {
        const pet = pets.find((pet) => pet.id === item.id);
        if (pet) {
          confirmItems.push({
            petId: item.id,
            months: item.value,
            product: 1,
          });
        }
      });
      const res: {
        data: {
          items: {
            petId: number;
            price: number;
            months: number;
            product: number;
          }[];
        };
      } = await SendPost("Order/get-items-price", { items: confirmItems });
      console.log(res);
      setConfirmItems(
        res.data.items.map((item) => {
          return {
            petId: item.petId,
            price: item.price,
            itemName: "狗糧",
            months: item.months,
          };
        })
      );
      setConfirmStep(true);
    }
  };

  return (
    <div className="m-auto w-full max-w-[1000px]">
      <p className="text-center text-3xl font-bold">購物車</p>
      {!confirmStep && (
        <>
          <DataGrid
            rowSelection={false}
            hideFooterPagination
            hideFooter
            rowHeight={100}
            columns={cols}
            rows={pets}
            getRowId={(row) => row.id}
            disableRowSelectionOnClick
            sx={{backgroundColor:"white"}}
          ></DataGrid>
          <div className="flex justify-end gap-2 items-center m-3">
            <div className="flex justify-end text-lg">
              總金額：${new Intl.NumberFormat().format(totalPrice())}
            </div>
            <Button
              variant="contained"
              onClick={() => {
                toConfirmStep();
              }}
            >
              結帳
            </Button>
          </div>
        </>
      )}
      {confirmStep && (
        <CartConfirm items={confirmItems} pets={pets}></CartConfirm>
      )}
    </div>
  );
}
