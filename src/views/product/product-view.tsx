"use client"
import { Button, Divider } from '@mui/material';
import { useState } from 'react';
import { AnimalHospitalDialog } from './animal-hospital-dialog';

const demands = [
  { img: 'icon-digestive-care.png.rendition.200.200.png', name: '消化系統護理' },
  { img: 'icon-kidney-support.png.rendition.200.200.avif', name: '腎臟病護理' },
  { img: 'icon-skin-coat.png.rendition.200.200.avif', name: '皮膚與毛皮健康' },
  { img: 'icon-urinary-health.png.rendition.200.200.avif', name: '泌尿道護理' },
  { img: 'icon-weight-management.png.rendition.200.200.avif', name: '體重管理' }
];

export default function ProductView() {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const findAnimalHospital = () => setDialogOpen(true);
  return (
    <div className='m-auto w-full lg:w-[calc(100%-200px)]'>
      <p className='text-3xl text-center font-bold'>臨床實證的科學營養，協助獸醫師改善寵物的生活</p>
      <p className='text-center'>當獸醫師為您的毛孩評估後，建議適合且特定的營養需求，您可安心使用Hangi處方食品，為毛孩的每一天提供最好的照護。</p>
      <div className='card py-[15px] px-[20px]'>
        <div className='text-lg font-bold mb-6'>Hangi處方食品提供經臨床實證的科學營養，滿足每個寵物的獨特營養需求。</div>
        <div className='grid grid-cols-2 gap-4'>
          {demands.map((demand) => {
            return (<div className='flex content-center gap-4' key={demand.name}>
              <img className='w-[60px] h-[60px]' src={demand.img} />
              <p>{demand.name}</p>
            </div>);
          })}
        </div>
      </div>
      <div className='my-4'>

        我們的寵物食品經過營養學博士和獸醫師的臨床驗證和研發，為您的寵物提供最科學、最優質的營養關懷，您可以安心選擇我們的產品。我們的營養關懷範圍包括消化系統護理、腎臟疾病護理、泌尿道護理、口腔護理、食物敏感等多種健康問題。
        <br />
        <br />
        如果您的寵物曾經被診斷出有特定的健康問題，或者您認為它們可能需要額外的營養補充，我們建議您諮詢您的獸醫，以深入了解處方食品如何協助您的寵物恢復到最佳的健康狀態。
      </div>
      <div className='card py-[15px] px-[20px] text-center'>
        <div className='text-lg font-bold mb-2'>尋找附近的動物醫院</div>
        <div className='mb-5'> 我們的處方食品提供專業的寵物營養，需經過獸醫師評估及指示後使用。請點選以下連結，協助您就近找到獸醫師，為您評估寵物的健康。</div>
        <Divider></Divider>
        <div className='text-center my-5'>
          <Button variant='contained' onClick={findAnimalHospital}>尋找動物醫院</Button>
        </div>
      </div>
      <AnimalHospitalDialog isOpen={dialogOpen} setIsOpen={setDialogOpen}></AnimalHospitalDialog>
    </div>
  )
}