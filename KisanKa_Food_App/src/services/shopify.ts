import { logApiError, logApiResponse } from "../utils/apiLogger";

const SHOP_URL = "fi8c7b-sr.myshopify.com";
const ACCESS_TOKEN = "77cd746e224f8073d6ce029ab0b79b5b";

export const getProducts = async () => {
  const startedAt = Date.now();
  try {
    const response = await fetch(`https://${SHOP_URL}/products.json`);

    const data = await response.json();

    const products = (data.products || []).filter(
      (product: any) => !product.tags?.includes("banner"),
    );

    logApiResponse("shopify", "GET /products.json", {
      startedAt,
      status: response.status,
      summary: `${products.length} products`,
      body: data,
    });

    return products;
  } catch (error) {
    logApiError("shopify", "GET /products.json", error);
    return [];
  }
};

export const getCollections = async () => {
  const startedAt = Date.now();
  try {
    const response = await fetch(`https://${SHOP_URL}/collections.json`);

    const data = await response.json();

    const collections = (data.collections || []).filter(
      (collection: any) => collection.handle !== "app-banners",
    );

    logApiResponse("shopify", "GET /collections.json", {
      startedAt,
      status: response.status,
      summary: `${collections.length} collections`,
      body: data,
    });

    return collections;
  } catch (error) {
    logApiError("shopify", "GET /collections.json", error);
    return [];
  }
};
export const createShopifyCheckout = async (cart: any[]) => {
  const startedAt = Date.now();
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

    const userErrors = json?.data?.cartCreate?.userErrors || [];
    const checkoutUrl = json?.data?.cartCreate?.cart?.checkoutUrl || null;

    logApiResponse("shopify", "POST /graphql cartCreate", {
      startedAt,
      status: response.status,
      summary: checkoutUrl
        ? `checkoutUrl ready (${lines.length} lines)`
        : `no checkoutUrl, ${userErrors.length} userErrors`,
      body: json,
    });

    if (userErrors.length) {
      logApiError("shopify", "POST /graphql cartCreate", userErrors);
    }

    return checkoutUrl;
  } catch (e) {
    logApiError("shopify", "POST /graphql cartCreate", e);
    return null;
  }
};

/** Same endpoint `collection/[id]` previously fetched inline — moved here so screens share one integration. */
export const getCollectionProducts = async (handle: string) => {
  const startedAt = Date.now();
  try {
    const response = await fetch(
      `https://${SHOP_URL}/collections/${handle}/products.json`,
    );

    const data = await response.json();

    const products = data.products || [];

    logApiResponse("shopify", `GET /collections/${handle}/products.json`, {
      startedAt,
      status: response.status,
      summary: `${products.length} products`,
      body: data,
    });

    return products;
  } catch (error) {
    logApiError("shopify", `GET /collections/${handle}/products.json`, error);
    throw error;
  }
};

/** Same GraphQL query `product/[id]` previously ran inline — moved here so screens share one integration. */
export const getProductById = async (id: string) => {
  const startedAt = Date.now();
  const query = `
{
  products(first: 100) {
    edges {
      node {
        id
        title
        description
        vendor
        productType
        availableForSale

        images(first: 10) {
          edges {
            node {
              url
            }
          }
        }

        variants(first: 10) {
          edges {
            node {
              id
              title
              price {
                amount
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

    const allProducts = json?.data?.products?.edges || [];

    const foundProduct = allProducts.find((p: any) => {
      const shopifyId = p.node.id.split("/").pop();
      return shopifyId === String(id);
    });

    logApiResponse("shopify", "POST /graphql products", {
      startedAt,
      status: response.status,
      summary: foundProduct
        ? `found product ${foundProduct.node.title}`
        : `product ${id} not found in ${allProducts.length} products`,
      body: json,
    });

    return foundProduct?.node ?? null;
  } catch (error) {
    logApiError("shopify", "POST /graphql products", error);
    throw error;
  }
};

export const getBanners = async () => {
  const startedAt = Date.now();
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

    const banners = json?.data?.collection?.products?.edges || [];

    logApiResponse("shopify", "POST /graphql banners", {
      startedAt,
      status: response.status,
      summary: `${banners.length} banners`,
      body: json,
    });

    return banners;
  } catch (error) {
    logApiError("shopify", "POST /graphql banners", error);
    return [];
  }
};
