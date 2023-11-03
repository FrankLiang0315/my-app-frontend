export type Order = {
  orderNumber: string;
  status: number;
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
};

export enum ProductEnum {
  "狗糧" = 1,
}
