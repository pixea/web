import { OrderItemFilePayload, ShoppingCart } from "@/db/validation";
import { useOptimistic, useTransition } from "react";
import { addFileToCartItemAction } from "./actions";
import { DateTime } from "luxon";

interface AddFileToCartItemMessage {
  type: "addFileToCartItem";
  cartItemId: string;
  file: OrderItemFilePayload;
}

const useCart = (initialCartState: ShoppingCart) => {
  const [isPending, startTransition] = useTransition();

  const [optimisticCart, updateOptimisticCart] = useOptimistic<
    ShoppingCart,
    AddFileToCartItemMessage
  >(initialCartState, (state, newMessage) => {
    switch (newMessage.type) {
      case "addFileToCartItem":
        const newState = { ...state };

        if (!newState.items) {
          newState.items = [];
        }

        const existingItem = newState.items.find(
          (item) => item.id === newMessage.cartItemId
        );

        if (existingItem) {
          if (!existingItem.files) {
            existingItem.files = { pieces: 1, items: [] };
          }

          existingItem.files.items.push(newMessage.file);
        } else {
          newState.items.push({
            id: newMessage.cartItemId,
            files: { pieces: 1, items: [newMessage.file] },
          });
        }

        newState.saved = DateTime.utc().toISO();

        return newState;
    }

    return state;
  });

  const addFileToCartItem = (
    cartItemId: string,
    file: OrderItemFilePayload
  ) => {
    startTransition(async () => {
      await addFileToCartItemAction(cartItemId, file);

      startTransition(() => {
        updateOptimisticCart({ type: "addFileToCartItem", cartItemId, file });
      });
    });
  };

  return {
    cart: optimisticCart,
    addFileToCartItem,
    isPending,
  };
};

export default useCart;
