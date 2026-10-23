export interface CartItem {
  id: number | string;
  slug: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

const CART_STORAGE_KEY = "global_marketplace_cart";

function announceCartChange() {
  window.dispatchEvent(new Event("cartUpdated"));
}

export function getCartItems(): CartItem[] {
  try {
    const rawCart = localStorage.getItem(CART_STORAGE_KEY);
    const parsedCart: unknown = rawCart ? JSON.parse(rawCart) : [];
    if (!Array.isArray(parsedCart)) return [];

    return parsedCart
      .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object"))
      .map((item) => ({
        id: (item.id as number | string | undefined) ?? String(item.slug || item.name || "product"),
        slug: String(item.slug || ""),
        name: String(item.name || "Product"),
        price: Number(item.price) || 0,
        imageUrl: String(item.imageUrl || item.image || item.image_url || ""),
        quantity: Math.max(1, Math.floor(Number(item.quantity) || 1)),
      }));
  } catch {
    return [];
  }
}

function saveCartItems(items: CartItem[]) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  announceCartChange();
}

export function addProductToCart(product: {
  id?: number | string;
  slug?: string;
  name: string;
  price: number | string;
  imageUrl?: string;
  image?: string;
  image_url?: string;
}, quantity = 1) {
  const productId = product.id ?? product.slug ?? product.name;
  const items = getCartItems();
  const existingItem = items.find((item) => String(item.id) === String(productId));

  if (existingItem) {
    existingItem.quantity += Math.max(1, Math.floor(quantity));
  } else {
    items.push({
      id: productId,
      slug: product.slug || String(productId),
      name: product.name,
      price: Number(product.price) || 0,
      imageUrl: product.imageUrl || product.image || product.image_url || "",
      quantity: Math.max(1, Math.floor(quantity)),
    });
  }

  saveCartItems(items);
}

export function updateCartItemQuantity(id: CartItem["id"], quantity: number) {
  const items = getCartItems().map((item) =>
    String(item.id) === String(id)
      ? { ...item, quantity: Math.max(1, Math.floor(quantity)) }
      : item
  );
  saveCartItems(items);
}

export function removeCartItem(id: CartItem["id"]) {
  saveCartItems(getCartItems().filter((item) => String(item.id) !== String(id)));
}

export function clearCart() {
  saveCartItems([]);
}
