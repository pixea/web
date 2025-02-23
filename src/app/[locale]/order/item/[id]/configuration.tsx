import { Product } from "@/db/schema";
import { OrderItemPayload } from "@/db/validation";

type Props = {
  product: Product;
  values?: OrderItemPayload["configuration"];
};

const Configuration = ({}: Props) => {
  return null;
};

export default Configuration;
