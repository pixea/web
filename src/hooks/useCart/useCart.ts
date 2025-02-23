import {
  OrderItemFilePayload,
  OrderItemPayload,
  ShoppingCart,
} from "@/db/validation";
import { useCallback, useState } from "react";
import {
  addFileToCartItemAction,
  removeFileFromCartItemAction,
  saveCartItemConfigurationAction,
  saveCartItemSizeAction,
  removeCartItemAction,
} from "./actions";
import { Product } from "@/db/schema";

type CartOptions = {
  /**
   * Currently selected product
   */
  product?: Product;
};

const useCart = (initialCartState: ShoppingCart, options?: CartOptions) => {
  const [cart, setCart] = useState<ShoppingCart>(initialCartState);
  const [pendingActions, setPendingActions] = useState(0);

  const productId = options?.product?.id;

  const addFileToCartItem = useCallback(
    async (cartItemId: string, file: OrderItemFilePayload) => {
      setPendingActions((actions) => actions + 1);
      try {
        if (!productId) {
          throw new Error("Product not selected");
        }

        const updatedCart = await addFileToCartItemAction(
          cartItemId,
          productId,
          file
        );

        // Replace state with the server response
        setCart((currentCart) =>
          updatedCart.saved > currentCart.saved ? updatedCart : currentCart
        );
      } finally {
        setPendingActions((actions) => actions - 1);
      }
    },
    [productId]
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

  const saveCartItemConfiguration = useCallback(
    async (
      cartItemId: string,
      configuration: OrderItemPayload["configuration"][0]
    ) => {
      setPendingActions((actions) => actions + 1);
      try {
        if (!productId) {
          throw new Error("Product not selected");
        }

        const updatedCart = await saveCartItemConfigurationAction(
          cartItemId,
          productId,
          configuration
        );

        // Replace state with the server response
        setCart((currentCart) =>
          updatedCart.saved > currentCart.saved ? updatedCart : currentCart
        );
      } finally {
        setPendingActions((actions) => actions - 1);
      }
    },
    [productId]
  );

  const saveCartItemSize = useCallback(
    async (cartItemId: string, size: OrderItemPayload["size"]) => {
      setPendingActions((actions) => actions + 1);
      try {
        if (!productId) {
          throw new Error("Product not selected");
        }

        const updatedCart = await saveCartItemSizeAction(
          cartItemId,
          productId,
          size
        );

        // Replace state with the server response
        setCart((currentCart) =>
          updatedCart.saved > currentCart.saved ? updatedCart : currentCart
        );
      } finally {
        setPendingActions((actions) => actions - 1);
      }
    },
    [productId]
  );

  const removeCartItem = useCallback(async (cartItemId: string) => {
    setPendingActions((actions) => actions + 1);
    try {
      const updatedCart = await removeCartItemAction(cartItemId);

      // Replace state with the server response
      setCart((currentCart) =>
        updatedCart.saved > currentCart.saved ? updatedCart : currentCart
      );
    } finally {
      setPendingActions((actions) => actions - 1);
    }
  }, []);

  return {
    cart,
    addFileToCartItem,
    removeFileFromCartItem,
    saveCartItemConfiguration,
    saveCartItemSize,
    removeCartItem,
    isPending: pendingActions > 0,
  };
};

export default useCart;
