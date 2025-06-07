import { Request, Response } from "express";
import Products from "../models/Products";
import { response } from "../utils/responseHandler";
import CartItems, { ICARTItem } from "../models/CartItems";

// ✅ Add to cart
export const addToCart = async (req: Request, res: Response) => {
  try {
    const userId = req.id;
    const { productId, quantity } = req.body;

    const product = await Products.findById(productId);
    if (!product) return response(res, 400, "Product not found");

    if (product.seller.toString() === userId) {
      return response(res, 400, "You cannot add your own product to the cart");
    }

    let cart = await CartItems.findOne({ user: userId });
    if (!cart) {
      cart = new CartItems({ user: userId, items: [] });
    }

    const existingItem = cart.items.find((item: ICARTItem) =>
      item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity } as ICARTItem);
    }

    await cart.save();
    return response(res, 200, "Item added to cart successfully", cart);
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal Server Error, please try again");
  }
};

// ✅ Remove from cart
export const removeFromCart = async (req: Request, res: Response) => {
    try {
      const userId = req.id;
      const { cartItemId } = req.params;
  
      const cart = await CartItems.findOne({ user: userId });
      if (!cart) return response(res, 400, "Cart not found");
  
      cart.items = cart.items.filter(
        (item: ICARTItem) => item._id.toString() !== cartItemId
      );
  
      await cart.save();
      return response(res, 200, "Item removed successfully", cart);
    } catch (error) {
      console.error(error);
      return response(res, 500, "Internal Server Error");
    }
  };
  

// ✅ Get cart
export const getCartByUser = async (req: Request, res: Response) => {
  try {
    const userId = req.id;

    let cart = await CartItems.findOne({ user: userId }).populate("items.product");

    if (!cart) {
      return response(res, 200, "Cart is empty", { items: [] });
    }

    // Optionally remove items with missing product references
    cart.items = cart.items.filter((item: ICARTItem) => item.product !== null);

    return response(res, 200, "User cart fetched successfully", cart);
  } catch (error) {
    console.error(error);
    return response(res, 500, "Internal Server Error, please try again");
  }
};
