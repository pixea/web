"use client";

import { Product } from "@/db/schema";
import { ShoppingCart } from "@/db/validation";
import useCart from "@/hooks/useCart/useCart";
import { Session } from "next-auth";

import Checkout from "./checkout";
import OrderItems from "./items";

type Props = {
  initialCart: ShoppingCart;
  products: Product[];
  session?: Session | null;
};

const OrderContent = ({ initialCart, products, session }: Props) => {
  const { cart, removeCartItem, resetCart, isPending } = useCart(initialCart);

  return (
    <>
      <OrderItems cart={cart} products={products} removeCartItem={removeCartItem} />
      <Checkout
        cart={cart}
        products={products}
        session={session}
        isPending={isPending}
        resetCart={resetCart}
      />
    </>
  );
};

export default OrderContent;
