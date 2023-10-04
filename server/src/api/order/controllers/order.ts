"use strict";

/**
 * order controller
 */

import { factories } from "@strapi/strapi";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SK, {
  apiVersion: "2023-08-16",
});

export default factories.createCoreController(
  "api::order.order",
  ({ strapi }) => ({
    async create(ctx: any) {
      const user = ctx.state.user;

      if (!user) {
        return ctx.unauthorized("You are not authorized!");
      }

      console.log(ctx.request.body.data);
      console.log(ctx.state.user.id);
      console.log("order controller");

      const { address, amount, dishes, token, city, postalCode } =
        ctx.request.body.data;

      try {
        // Charge the customer
        await stripe.charges.create({
          amount: amount,
          currency: "usd",
          description: `Order ${new Date()} by ${ctx.state.user.id}`,
          source: token,
        });

        // Create the order
        const order = await strapi.service("api::order.order").create({
          data: {
            amount,
            address,
            dishes,
            city,
            postalCode,
            token,
            user: ctx.state.user.id,
          },
        });
        return order;
      } catch (err) {
        // return 500 error
        console.log("err", err);
        ctx.response.status = 500;
        return {
          error: { message: "There was a problem creating the charge" },
          address,
          amount,
          dishes,
          token,
          city,
          postalCode,
        };
      }
    },
  })
);
