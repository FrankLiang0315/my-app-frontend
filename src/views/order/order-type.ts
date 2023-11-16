export type Order = {
  orderNumber: string;
  status: StatusEnum;
  price: number;
  createdAt: Date;
  ordererName: string;
  ordererTel: string;
  ordererAdd: string;
  receiverName: string;
  receiverTel: string;
  receiverAdd: string;
  orderItems: {
    months: number;
    price: number;
    product: number;
    pet: {
      name: string;
    };
  }[];
  user?:{
    userName: string;
  }
};

export enum ProductEnum {
  "狗糧" = 1,
}

export enum StatusEnum {
  Created = 0,
  PendingPayment = 1,
  InProgress = 2,
  PendingLogistics = 3,
  Shipping = 4,
  Completed = 5
}