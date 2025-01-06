import { OrderItemFilePayload, ShoppingCart } from "@/db/validation";
import { useState } from "react";
import { addFileToCartItemAction } from "./actions";

const useCart = (initialCartState: ShoppingCart) => {
  const [cart, setCart] = useState<ShoppingCart>(initialCartState);
  const [pendingActions, setPendingActions] = useState(0);

  const addFileToCartItem = async (
    cartItemId: string,
    file: OrderItemFilePayload
  ) => {
    setPendingActions((actions) => actions + 1);
    try {
      const updatedCart = await addFileToCartItemAction(cartItemId, file);

      // Replace state with the server response
      setCart((currentCart) =>
        updatedCart.saved > currentCart.saved ? updatedCart : currentCart
      );
    } catch (error) {
      console.error("Failed to update cart:", error);
      // Handle error appropriately (rollback optimistic update if necessary)
    } finally {
      setPendingActions((actions) => actions - 1);
    }
  };

  return {
    cart,
    addFileToCartItem,
    isPending: pendingActions > 0,
  };
};

export default useCart;
