const SHOP_URL = "fi8c7b-sr.myshopify.com";
const ACCESS_TOKEN = "77cd746e224f8073d6ce029ab0b79b5b";

export const getProducts = async () => {
  try {
    const response = await fetch(`https://${SHOP_URL}/products.json`);

    const data = await response.json();

    return (data.products || []).filter(
      (product: any) => !product.tags?.includes("banner"),
    );
  } catch (error) {
    console.log("PRODUCT ERROR:", error);
    return [];
  }
};

export const getCollections = async () => {
  try {
    const response = await fetch(`https://${SHOP_URL}/collections.json`);

    const data = await response.json();

    return (data.collections || []).filter(
      (collection: any) => collection.handle !== "app-banners",
    );
  } catch (error) {
    console.log("COLLECTION ERROR:", error);
    return [];
  }
};
export const createShopifyCheckout = async (cart: any[]) => {
  try {
    const lines = cart.map((item) => ({
      merchandiseId: item.variantId,
      quantity: item.quantity,
    }));

    const query = `
      mutation cartCreate($lines: [CartLineInput!]) {
        cartCreate(input: { lines: $lines }) {
          cart {
            id
            checkoutUrl
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const response = await fetch(
      `https://${SHOP_URL}/api/2025-01/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": ACCESS_TOKEN,
        },
        body: JSON.stringify({
          query,
          variables: {
            lines,
          },
        }),
      },
    );

    const json = await response.json();

    console.log("SHOPIFY CART:", JSON.stringify(json, null, 2));

    return json.data.cartCreate.cart.checkoutUrl;
  } catch (e) {
    console.log("CHECKOUT ERROR", e);
    return null;
  }
};

export const getBanners = async () => {
  const query = `
  {
    collection(handle: "app-banners") {
      products(first: 20) {
        edges {
          node {
            id
            title
            images(first: 1) {
              edges {
                node {
                  url
                }
              }
            }
          }
        }
      }
    }
  }
  `;

  try {
    const response = await fetch(
      `https://${SHOP_URL}/api/2025-01/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": ACCESS_TOKEN,
        },
        body: JSON.stringify({ query }),
      },
    );

    const json = await response.json();

    console.log("BANNERS:", json);

    return json?.data?.collection?.products?.edges || [];
  } catch (error) {
    console.log("BANNER ERROR:", error);
    return [];
  }
};
