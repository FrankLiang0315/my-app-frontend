"use client"
import { Divider } from '@mui/material';


export default function AboutUsView() {
  return (
    <div className='m-auto w-[calc(100%-200px)] md:w-[768px] '>
      <p className='text-3xl text-center font-bold'>關於我們</p>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 text-center'>
        <div>
          由於寵物在接受結紮手術前需要進行例行的血液檢查，有些寵物可能會在手術台上感到害怕和緊張，導致整個過程變得不順利。有沒有更好的方法來減輕這種情況呢？經過與獸醫的討論，我們意識到每隻寵物都有不同的健康狀況，這受到遺傳基因、生活方式以及飲食習慣等因素的影響。
          {/* <br></br>
          市面上的寵物食品通常是標準化的，適用於整個寵物群體，很少有針對個體差異的定制產品。為了讓寵物免受血液採集的痛苦，並提供手術後所需的營養支持，我們開發了一種非侵入式檢測方法，結合了營養專家和大數據分析的專利技術，以制定出適合每隻寵物需求的精確配方。 */}
          </div>
        <div>

          <div className='card px-3 py-2 relative mr-[0px]'>
            <p className='text-xl font-bold m-0 mb-1'>為您的寶貝量身訂做的</p>
            <p className='text-xl font-bold m-0 mb-1 text-red-700'>Hangi 營養糧</p>
            <p className='m-0'>就算是體型、品種一樣，年齡或生活方式一定不一樣，每一次的配方都是經過您的寶貝「毛髮檢測」檢測健康需求而客製的精準配方。</p>
            <img src="doctor.9ae25c35.svg" className=" absolute top-0 right-[-100px]" alt=""></img>
          </div>
          <img src="dog_cat.b257ed05.svg" alt=""></img>
        </div>
      </div>
      <Divider></Divider>
      <p className=' font-bold text-2xl text-center'>
        健康、寵愛、幸福、專業 <br /> 綜合起來代表活力微笑的企業文化
      </p>
      <div className='grid grid-rows-1 relative'>

        <div className='card p-3 m-1'>
          藉由更輕鬆但卻更精準的檢測方式，調配出給寶貝的滿滿健康營養，專心回歸到與寶貝之間的互動與陪伴，找回幸福純粹的快樂與活力，為寶貝建構出友善的環境,讓寶貝盡情融入在充滿愛的家庭中成長。
        </div>
        <div className='card p-3 m-1'>
          所有主食品項皆符合:<br />
          美國AAFCO/NRC訂定標準與ISO22000/HACCP雙認證工廠
        </div>
        <div className='card p-3 m-1'>
          嚴選食材製作，科學檢驗無藥物殘留
          投保產品責任險：產品製造商在製作過程因抗力、不可抗力因素，導致產品缺陷或瑕疵。產品在被使用的過程中發生意外或傷害，於保險期間內各個事件累積的理賠總金額可達3000萬元。
        </div>
        <img src="dog-1.d0973523.svg" className=" absolute bottom-0 left-[-130px]" alt=""></img>
      </div>
    </div>
  )
}