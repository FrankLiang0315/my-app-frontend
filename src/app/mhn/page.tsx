"use client"
import ProductView from "@/views/product/product-view"
import { Grid } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";


type Place = { name: string, type: number };
type Env = { envId: number, env: string, collection:string, monsters:{name:string,img?:string}[]};
type ShowValue = Place & Partial<Env>;
type CellType =  {
  row: ShowValue;
}

//type 1 沼澤 -> 森林 -> 沙漠
//type 2 森林 -> 沙漠 -> 沼澤
//type 3 沙漠 -> 沼澤 -> 森林 
const places: Place[] = [
  { name: '租屋處', type: 1 },
  { name: '秀厝家', type: 2 },
  { name: '雯珍家', type: 2 },
  { name: '何源里', type: 2 },
  { name: '逢甲公園', type: 2 },
  { name: '逢甲大學門口', type: 3 }
]

const envInfo: Env[] = [
  { envId: 0, env: '沼澤', collection: '礦石', monsters:[
    {name:'大凶豺龍', img:'mhn/牙龍種_大兇豺龍_icon.png'},
    {name:'搔鳥', img:'mhn/鳥龍種_搔鳥_icon.png'},
    {name:'毒妖鳥', img:'mhn/鳥龍種_毒妖鳥_icon.png'},
    {name:'土砂龍', img:'mhn/獸龍種_土砂龍_icon.png'},
    {name:'飛雷龍', img:'mhn/牙龍種_飛雷龍_icon.png'},
    {name:'風漂龍', img:'mhn/飛龍種_風漂龍_icon.png'},
    {name:'大凶顎龍', img:'mhn/牙龍種_大兇顎龍_icon.png'},
    {name:'浮空龍', img:'mhn/飛龍種_浮空龍_icon.png'},
    {name:'泥魚龍', img:'mhn/魚龍種_泥魚龍_icon.png'}
  ]},
  { envId: 1, env: '森林', collection: '植物', monsters:[
    {name:'大凶豺龍', img:'mhn/牙龍種_大兇豺龍_icon.png'},
    {name:'搔鳥', img:'mhn/鳥龍種_搔鳥_icon.png'},
    {name:'毒妖鳥', img:'mhn/鳥龍種_毒妖鳥_icon.png'},
    {name:'飛雷龍', img:'mhn/牙龍種_飛雷龍_icon.png'},
    {name:'雌火龍', img:'mhn/飛龍種_雌火龍_icon.png'},
    {name:'火龍', img:'mhn/飛龍種_火龍_icon.png'},
    {name:'大凶顎龍', img:'mhn/牙龍種_大兇顎龍_icon.png'},
    {name:'蠻顎龍', img:'mhn/獸龍種_蠻顎龍_icon.png'},
  ]},
  { envId: 2, env: '沙漠', collection: '骨塚', monsters:[
    {name:'大凶豺龍', img:'mhn/牙龍種_大兇豺龍_icon.png'},
    {name:'搔鳥', img:'mhn/鳥龍種_搔鳥_icon.png'},
    {name:'毒妖鳥', img:'mhn/鳥龍種_毒妖鳥_icon.png'},
    {name:'土砂龍', img:'mhn/獸龍種_土砂龍_icon.png'},
    {name:'雌火龍', img:'mhn/飛龍種_雌火龍_icon.png'},
    {name:'角龍', img:'mhn/飛龍種_角龍_icon.png'},
    {name:'蠻顎龍', img:'mhn/獸龍種_蠻顎龍_icon.png'},
    {name:'浮空龍', img:'mhn/飛龍種_浮空龍_icon.png'}
  ]}
];

const cols: GridColDef[] = [
  { flex: 0.3, field: 'name', headerName: '地點' },
  { flex: 0.2, field: 'env', headerName: '環境' },
  { flex: 0.2, field: 'collection', headerName: '採集' },
  { flex: 0.3, field: 'monsters', headerName: '大型魔物',
    renderCell:({row}:CellType)=>{
      return(<>
      {
        row.monsters?.map((monster)=>{
          return(
            <img className='w-8 mr-2' src={monster.img} alt={monster.name} key={monster.name}/>
          )
        })
      }
      </>)
    }
}
]


export default function Product() {
  const [todayValues, setTodayValues] = useState<ShowValue[]>([]);
  const [today, setToday] = useState<Date>();
 
  useEffect(() => {
    const base = new Date(2023, 9, 10, 8);
    const today = new Date();
    setToday(today);
    const days = Math.floor(DateDifference(base, today));
    let todayTypeEnv:{type: number, envId: number}[] = [];
    let todayValues: ShowValue[] = [];

    for(let i = 1; i<=3;i++) {
      todayTypeEnv.push({type:i, envId:getEnvId(days, i)});
    }


    places.forEach((place) => {

      let envId = todayTypeEnv.find((typeEnv)=> place.type ===typeEnv.type)?.envId;
      let env = envInfo.find((info)=> info.envId === envId);
      todayValues.push(
        { ...place, 
          ...env
        })

    });

    setTodayValues(todayValues);
  }, []);


  let DateDifference = function (Date1: Date, Date2: Date) { // date object 日期格式
    let milliseconds_Time = Date2.getTime() - Date1.getTime();
    return milliseconds_Time / (1000 * 3600 * 24);
  };

  let getEnvId = (days: number, type: number) => {
    let index = 0;

    switch (type) {
      case 1: index = days; break;
      case 2: index = days + 1; break;
      case 3: index = days + 2; break;
    }

    return index % 3;
  }




  return (
    <>
      {/* {base.toDateString()}<br />  */}
      {today?.toDateString()} {today?.toTimeString()} <br />
      {/* {todayValues.map((todayValue) => {
        return (<div key={todayValue.name}>
          今天 {todayValue.name} 為 {todayValue.env}
        </div>)
      })}
      <br />
      <div>今日可挖礦</div>
      {
        todayValues.map((todayValue) => {
          if (todayValue.env === '沼澤') {
            return (
              <div key={todayValue.name}>
                {todayValue.name}
              </div>
            )
          }
        })
      } */}
      <DataGrid
        columns={cols}
        rows={todayValues}
        getRowId={(row) => row.name}
        disableRowSelectionOnClick
      />
    </>
  )
}