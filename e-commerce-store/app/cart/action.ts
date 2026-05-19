"use server";

import { prisma } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function addToCart(productId: number, quantityToAdd: number = 1) {
  try {
    // 1. Authenticate the User
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { error: "You must be logged in to access the hangar." };
    }

    const userId = parseInt(session.user.id);

    // 2. Find or Create the User's Cart
    // We use an "upsert" here. It tries to find the cart, and if it fails, it creates it instantly!
    const cart = await prisma.cart.upsert({
      where: { userId: userId },
      update: {}, // Do nothing if it exists
      create: { userId: userId }, // Create it if it doesn't
    });

    // 3. Check if the product is already in the cart
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: productId,
      },
    });

    // 4. Update quantity or add new item
    if (existingCartItem) {
      // If they already have 1 Strike Freedom, and click Add again, make it 2!
      await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantityToAdd },
      });
    } else {
      // Otherwise, create a brand new line item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: productId,
          quantity: quantityToAdd,
        },
      });
    }

    // 5. Refresh the page data so the Cart counter updates instantly
    revalidatePath("/dashboard");
    return { success: true };

  } catch (error) {
    console.error("Add to cart error:", error);
    return { error: "Failed to secure unit in cart." };
  }
}

export async function increaseCartItem(cartItemId: number) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { error: "Authentication required." };
    }

    // 1. Find the item
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId }
    });

    if (!cartItem) return { error: "Item not found." };

    // 2. Increase the quantity by 1
    await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity: cartItem.quantity + 1 }
    });

    // 3. Refresh the UI
    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("Increase cart item error:", error);
    return { error: "Failed to update unit quantity." };
  }
}

// Add this to your app/cart/actions.ts file
export async function decreaseFromCart(cartItemId: number) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { error: "Authentication required." };
    }

    const userId = parseInt(session.user.id);

    // 1. Find the specific item and verify it belongs to this pilot's cart
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        cart: { userId: userId }
      }
    });

    if (!cartItem) return { error: "Item not found in staging." };

    // 2. The Step-Down Logic
    if (cartItem.quantity > 1) {
      // If they have 2 or more, just reduce the count by 1
      await prisma.cartItem.update({
        where: { id: cartItemId },
        data: { quantity: cartItem.quantity - 1 }
      });
    } else {
      // If they only have 1 left, completely delete the row
      await prisma.cartItem.delete({
        where: { id: cartItemId }
      });
    }

    // 3. Refresh the page data
    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("Decrease cart item error:", error);
    return { error: "Failed to update unit quantity." };
  }
}