import { OrderItemFilePayload, ShoppingCart } from "@/db/validation";
import { useCallback, useState } from "react";
import {
  addFileToCartItemAction,
  removeFileFromCartItemAction,
} from "./actions";

const useCart = (initialCartState: ShoppingCart) => {
  const [cart, setCart] = useState<ShoppingCart>(initialCartState);
  const [pendingActions, setPendingActions] = useState(0);

  const addFileToCartItem = useCallback(
    async (cartItemId: string, file: OrderItemFilePayload) => {
      setPendingActions((actions) => actions + 1);
      try {
        const updatedCart = await addFileToCartItemAction(cartItemId, file);

        // Replace state with the server response
        setCart((currentCart) =>
          updatedCart.saved > currentCart.saved ? updatedCart : currentCart
        );
      } finally {
        setPendingActions((actions) => actions - 1);
      }
    },
    []
  );

  const removeFileFromCartItem = useCallback(
    async (cartItemId: string, fileId: string) => {
      setPendingActions((actions) => actions + 1);
      try {
        const updatedCart = await removeFileFromCartItemAction(
          cartItemId,
          fileId
        );

        // Replace state with the server response
        setCart((currentCart) =>
          updatedCart.saved > currentCart.saved ? updatedCart : currentCart
        );
      } finally {
        setPendingActions((actions) => actions - 1);
      }
    },
    []
  );

  return {
    cart,
    addFileToCartItem,
    removeFileFromCartItem,
    isPending: pendingActions > 0,
  };
};

export default useCart;
