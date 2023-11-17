import { Loading } from "@/compornets/loading";
import { AuthContext } from "@/context/auth-context";
import {
  Autocomplete,
  Button,
  CircularProgress,
  Grid,
  Step,
  StepLabel,
  Stepper,
  TextField,
} from "@mui/material";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import FormTextField from "@/compornets/form-text-field";
import { FormRadioButtons } from "@/compornets/form-radio-buttons";
import { SendGet, SendPost } from "@/tools/send-api";
import { FormAutocomplete } from "@/compornets/form-autocomplete";
import InputAdornment from "@mui/material/InputAdornment";
import { MessageContext } from "@/context/message-context";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { getFormatDate } from "@/tools/format";

// public string? Name { get; set; }
//     public DateTime? Birthday { get; set; }
//     public int? Gender { get; set; } //性別 1:公 2:母
//     public string? Weight { get; set; }
//     public string? Breed { get; set; } //品種
//     public Boolean? IsNeutered { get; set; } //絕育YN
//     public int? Posture { get; set; } //體態1:過瘦 2:瘦 3:理想 4:超重 5:過胖
//     public int? Activity { get; set; } //活動 1:無激烈運動 2:每日運動少於1h 3:1h~3h 4:3h up

type Inputs = {
  // 1
  name: string; // 名稱
  gender: number; // 性別
  isNeutered: boolean; // 是否結紮
  // img: string; //上傳照片
  // 2
  petBreedId: number; // 品種
  // 3
  birthday: string; // 生日
  // 4
  weight: string; // 體重
  // 5
  activity: number; // 活動狀態
  // 6
  // posture: number; // 體態
};
const schema = yup.object({
  name: yup.string().required("必填"),
  gender: yup.number().required("必填"),
  isNeutered: yup.boolean().required("必填"),
  petBreedId: yup.number().required("必填"),
  birthday: yup.string().required("必填"),
  weight: yup.string().required("必填"),
  activity: yup.number().required("必填"),
  // posture: yup.number().required("必填"),
});

const genderButtons = [
  { label: "男生", value: "1" },
  { label: "女生", value: "2" },
];
const isNeuteredButtons = [
  { label: "已結紮", value: true },
  { label: "未結紮", value: false },
];

const activityButtons = [
  { label: "只在室內活動且無激烈運動", value: "1" },
  { label: "每日運動量少於一小時", value: "2" },
  { label: "每日運動量一到三小時", value: "3" },
  { label: "每日運動量多於三小時", value: "4" },
];

export default function PetCreateView() {
  const auth = useContext(AuthContext);
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [today, setToday] = useState(new Date().toISOString().split("T")[0]);
  const [breedList, setBreedList] = useState<
    { id: number; name: string; type: number; size: number }[]
  >([]);
  const [petType, setPetType] = useState(1); // todo 1:狗 2:貓

  const route = useRouter();
  const getBreedList = useMemo(() => {
    return breedList.filter((breed) => breed.type === petType);
  }, [breedList, petType]);

  const form = useForm<Inputs>({
    resolver: yupResolver(schema),
  });
  const {
    handleSubmit,
    setValue,
    getValues,
    trigger,
    formState: { errors },
    watch,
  } = form;

  useEffect(() => {
    if (!auth.isLogin) {
      auth.getUserInfo();
    }

    SendGet("Pet/breed-list").then((res) => {
      setBreedList(res.data);
    });
    watch("birthday");
  }, []);

  // useEffect(() => {
  //   console.log(getValues());
  // }, [getValues()]);

  const message = useContext(MessageContext);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data);
    // let finalData = data;

    const res = await SendPost("Pet/create", data);
    if (res.status === "Success") {
      setStep(step + 1);
    } else {
      message.showDialog("error", "建立失敗 " + res.message);
    }
  };

  const lastStep = () => {
    setStep(step - 1);
  };

  const steps = [
    { label: "寵物訊息", title: `寵物訊息` },
    { label: "寵物品種", title: `${getValues("name")} 的品種是？` },
    { label: "寵物體重", title: `${getValues("name")} 的體重是？` },
    { label: "寵物生日", title: `${getValues("name")} 的生日是？` },
    { label: "寵物活動量", title: `${getValues("name")} 的每日活動量？` },
    { label: "完成建立", title: "完成建立啦！" },
  ];

  const nextStep = async () => {
    try {
      const vaildFields = (): (
        | "name"
        | "gender"
        | "isNeutered"
        | "petBreedId"
        | "birthday"
        | "weight"
        | "activity"
      )[] => {
        switch (step) {
          case 0:
            return ["name", "gender", "isNeutered"];
          case 1:
            return ["petBreedId"];
          case 2:
            return ["weight"];
          case 3:
            return ["birthday"];
          case 4:
            return ["activity"];
          default:
            return ["name", "gender", "isNeutered"];
        }
      };
      const res = await trigger(vaildFields()); // 触发字段的验证
      if (res) {
        setStep(step + 1);
      }
    } catch (error) {
      console.error(error);
    }
  };

  function getAge(dateString: string) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  return (
    <>
      <div className="m-auto w-full max-w-[768px]">
        {!auth.isLogin && <Loading />}
        {auth.isLogin && (
          <div className="text-center">
            <p className="text-3xl font-bold">建立寵物資訊</p>
            <Stepper activeStep={step} alternativeLabel>
              {steps.map((step) => (
                <Step key={step.label}>
                  <StepLabel>{step.label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <div className="card m-auto max-w-[600px] mt-6 p-6">
              <form onSubmit={handleSubmit(onSubmit)}>
                <p className="text-2xl font-bold text-[#1976d2] mt-0">
                  {steps[step].title}
                </p>
                <div className="flex flex-col gap-3">
                  {step === 0 && (
                    <>
                      <FormTextField
                        form={form}
                        name="name"
                        label="寵物名稱"
                        fullWidth
                      />
                      <FormRadioButtons
                        form={form}
                        name="gender"
                        buttons={genderButtons}
                      ></FormRadioButtons>
                      <FormRadioButtons
                        form={form}
                        name="isNeutered"
                        buttons={isNeuteredButtons}
                      ></FormRadioButtons>
                    </>
                  )}
                  {step === 1 && (
                    <>
                      <FormAutocomplete
                        form={form}
                        value={"id"}
                        label={"name"}
                        options={getBreedList}
                        name={"petBreedId"}
                      />
                      <p>
                        當寶貝為混合品種以及不確認品種時，請選擇其他品種，如您不確定如何選擇可諮詢健康夥伴，為您一對一答疑指導。
                      </p>
                    </>
                  )}
                  {step === 2 && (
                    <>
                      <FormTextField
                        form={form}
                        name="weight"
                        label="體重"
                        fullWidth
                        type="number"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">kg</InputAdornment>
                          ),
                        }}
                      />
                      <p>
                        因個體差異，（如：骨骼發育大小）會產生個體與標準體重的範圍偏差，請認真填寫
                      </p>
                    </>
                  )}
                  {step === 3 && (
                    <>
                      <FormTextField
                        form={form}
                        name="birthday"
                        fullWidth
                        type="date"
                        inputProps={{
                          max: today,
                        }}
                      />
                      {!isNaN(getAge(getValues("birthday"))) && (
                        <p>
                          {getValues("name")} 已經{" "}
                          {getAge(getValues("birthday"))} 歲啦！
                        </p>
                      )}
                    </>
                  )}
                  {step === 4 && (
                    <>
                      <FormRadioButtons
                        form={form}
                        name="activity"
                        buttons={activityButtons}
                      />
                    </>
                  )}
                  {step === steps.length - 1 && (
                    <>
                      <div className="text-center">
                        <CheckCircleOutlineIcon
                          color="success"
                          sx={{ fontSize: 128 }}
                        />
                      </div>
                      <Button variant="contained" sx={{width:"25%", margin:"auto"}} onClick={()=>{router.push("/pet")}}>返回列表</Button>
                    </>
                  )}
                </div>
                {/* buttons */}
                {step !== steps.length - 1 && (
                  <div className="mt-20 flex justify-between">
                    <Button
                      variant="contained"
                      disabled={step === 0}
                      onClick={lastStep}
                    >
                      上一頁
                    </Button>

                    {step !== steps.length - 2 && (
                      <Button variant="contained" onClick={nextStep}>
                        下一頁
                      </Button>
                    )}
                    {step === steps.length - 2 && (
                      <Button variant="contained" type="submit">
                        送出
                      </Button>
                    )}
                  </div>
                )}
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
