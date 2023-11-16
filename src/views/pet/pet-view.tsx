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
import { getFormatDate } from "@/tools/format";

type Pet = {
  id: number;
  name: string;
  dailyGrams: number;
};

type PetDetial = {
  id: number;
  petBreadId: number;
  breed: string;
  name: string;
  birthday: string;
  gender: number;
  weight: string;
  isNeutered: boolean;
  activity: number;
};

const activityArray = [
  { label: "只在室內活動且無激烈運動", value: 1 },
  { label: "每日運動量少於一小時", value: 2 },
  { label: "每日運動量一到三小時", value: 3 },
  { label: "每日運動量多於三小時", value: 4 },
];

const genderArray = [
  { label: "男生", value: 1 },
  { label: "女生", value: 2 },
];

export default function PetView() {
  const auth = useContext(AuthContext);
  const route = useRouter();
  const [pets, setPets] = useState<Pet[]>([]);
  const [targetPet, setTargetPet] = useState<PetDetial>();
  const [diaState, setDiaState] = useState(false);

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

  const openDialog = (pet: Pet) => {
    SendGet(`Pet/${pet.id}`).then((res) => {
      console.log(res);
      let targetPet = res.data;
      targetPet.birthday = getFormatDate(new Date(targetPet.birthday));
      console.log(targetPet);
      setTargetPet(targetPet);
    });

    setDiaState(true);
  };

  return (
    <>
      <div className="m-auto w-full max-w-[768px]">
        {!auth.isLogin && <Loading />}
        {auth.isLogin && (
          <div className="text-center">
            <p className="text-3xl font-bold">寵物資料</p>
            <div className="p-6">
              {pets.length === 0 && (
                <p className="m-0">目前還沒有寵物資料喔～請建立！</p>
              )}

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {pets.length !== 0 &&
                  pets.map((pet) => {
                    return (
                      <div
                        className="card p-3 flex flex-row cursor-pointer"
                        onClick={() => {
                          openDialog(pet);
                        }}
                        key={pet.id}
                      >
                        <PetsIcon sx={{ fontSize: 50 }}></PetsIcon>
                        <div className="flex justify-center w-full items-center text-lg">
                          {pet.name}
                        </div>
                      </div>
                    );
                  })}
              </div>

              <Button
                variant="contained"
                onClick={() => {
                  route.push("pet/create");
                }}
                sx={{mt: 3}}
              >
                新增
              </Button>
            </div>
            <TransitionDialog
              open={diaState}
              fullWidth
              maxWidth="sm"
              onClose={() => {
                setDiaState(false);
              }}
            >
              <DialogTitle>
                寵物資訊
                <div className="inline ml-3">
                  <Button variant="contained">編輯</Button>
                </div>
              </DialogTitle>
              <DialogContent>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>寵物名稱</TableCell>
                      <TableCell>{targetPet?.name}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>寵物品種</TableCell>
                      <TableCell>{targetPet?.breed}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>寵物生日</TableCell>
                      <TableCell>{targetPet?.birthday}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>寵物性別</TableCell>
                      <TableCell>
                        {
                          genderArray.find((a) => a.value === targetPet?.gender)
                            ?.label
                        }
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>寵物體重(kg)</TableCell>
                      <TableCell>{targetPet?.weight}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>寵物結紮</TableCell>
                      <TableCell>
                        {targetPet?.isNeutered ? "是" : "否"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>寵物活動量</TableCell>
                      <TableCell>
                        {
                          activityArray.find(
                            (a) => a.value === targetPet?.activity
                          )?.label
                        }
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </DialogContent>
            </TransitionDialog>
          </div>
        )}
      </div>
    </>
  );
}
