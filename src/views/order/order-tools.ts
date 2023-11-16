export const getAdminStatus = (code: number) => {
  let statusText = "";
  // 0.創建 1.待付款 2.處理中 3.運送中 4.完成
  switch (code) {
    case 0:
      statusText = "已創建";
      break;
    case 1:
      statusText = "待付款";
      break;
    case 2:
      statusText = "處理中";
      break;
    case 3:
      statusText = "待出貨";
      break;
    case 4:
      statusText = "已出貨";
      break;
    case 5:
      statusText = "已完成";
      break;
    default:
      statusText = "異常";
      break;
  }

  return statusText;
};

export const getClientStatus = (code: number) => {
  let statusText = "";
  // 0.創建 1.待付款 2.處理中 3.運送中 4.完成
  switch (code) {
    case 0:
      statusText = "已創建";
      break;
    case 1:
      statusText = "待付款";
      break;
    case 2:
      statusText = "處理中";
      break;
    case 3:
      statusText = "處理中";
      break;
    case 4:
      statusText = "已出貨";
      break;
    case 5:
      statusText = "已完成";
      break;
    default:
      statusText = "異常";
      break;
  }

  return statusText;
};
