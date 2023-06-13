// @ts-nocheck

import KhaltiCheckout from "khalti-checkout-web";
import config from "../config/khaltiConfig.js";

export const KhaltiComponent = () => {
  let checkout = new KhaltiCheckout(config);


  return (
    <div>
      <div
        onClick={() => checkout.show({ amount: 10000 })}
        className="khaltiButton"
      >
        Pay Via Khalti
      </div>
    </div>
  );
};
