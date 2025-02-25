/**
 * ---------------------------------------------------------------------------------
 * This file has been generated by Sanity TypeGen.
 * Command: `sanity typegen generate`
 *
 * Any modifications made directly to this file will be overwritten the next time
 * the TypeScript definitions are generated. Please make changes to the Sanity
 * schema definitions and/or GROQ queries if you need to update these types.
 *
 * For more information on how to use Sanity TypeGen, visit the official documentation:
 * https://www.sanity.io/docs/sanity-typegen
 * ---------------------------------------------------------------------------------
 */

// Source: schema.json
export type SanityImagePaletteSwatch = {
  _type: "sanity.imagePaletteSwatch";
  background?: string;
  foreground?: string;
  population?: number;
  title?: string;
};

export type SanityImagePalette = {
  _type: "sanity.imagePalette";
  darkMuted?: SanityImagePaletteSwatch;
  lightVibrant?: SanityImagePaletteSwatch;
  darkVibrant?: SanityImagePaletteSwatch;
  vibrant?: SanityImagePaletteSwatch;
  dominant?: SanityImagePaletteSwatch;
  lightMuted?: SanityImagePaletteSwatch;
  muted?: SanityImagePaletteSwatch;
};

export type SanityImageDimensions = {
  _type: "sanity.imageDimensions";
  height?: number;
  width?: number;
  aspectRatio?: number;
};

export type SanityFileAsset = {
  _id: string;
  _type: "sanity.fileAsset";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  originalFilename?: string;
  label?: string;
  title?: string;
  description?: string;
  altText?: string;
  sha1hash?: string;
  extension?: string;
  mimeType?: string;
  size?: number;
  assetId?: string;
  uploadId?: string;
  path?: string;
  url?: string;
  source?: SanityAssetSourceData;
};

export type Geopoint = {
  _type: "geopoint";
  lat?: number;
  lng?: number;
  alt?: number;
};

export type AccessCode = {
  _id: string;
  _type: "accessCode";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  code?: string;
  userId?: string;
  isUsed?: boolean;
  createdAt?: string;
};

export type Course = {
  _id: string;
  _type: "course";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  courseName?: string;
  courseIntervals?: Array<{
    startDate?: string;
    endDate?: string;
    _key: string;
  }>;
};

export type Sales = {
  _id: string;
  _type: "sales";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  title?: string;
  description?: string;
  discountAmount?: number;
  couponCode?: string;
  validForm?: string;
  validUntil?: string;
  isActive?: boolean;
};

export type Order = {
  _id: string;
  _type: "order";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  orderIndex?: number;
  orderNumber?: string;
  paymentType?: "card" | "ramburs" | "transfer";
  status?: "in_asteptare" | "platita" | "livrata" | "anulata" | "returnata";
  orderDate?: string;
  invoice?: {
    number?: string;
    series?: string;
    url?: string;
  };
  customerName?: string;
  email?: string;
  address?: {
    firstName?: string;
    lastName?: string;
    province?: string;
    city?: string;
    postalCode?: string;
    street?: string;
    phone?: string;
    email?: string;
  };
  billingAddress?: {
    isLegalEntity?: boolean;
    companyName?: string;
    cui?: string;
    tradeRegisterNumber?: string;
    companyAddress?: string;
    companyCity?: string;
    companyCounty?: string;
    companyPostalCode?: string;
    bankName?: string;
    iban?: string;
  };
  products?: Array<{
    product?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "product";
    };
    quantity?: number;
    variant?: {
      curbura?: string;
      grosime?: string;
      marime?: string;
      price?: number;
      stock?: number;
    };
    _key: string;
  }>;
  totalPrice?: number;
  discount?: number;
  promoCode?: string;
  shippingCost?: number;
  currency?: "RON" | "EUR";
};

export type Product = {
  _id: string;
  _type: "product";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  name?: string;
  slug?: Slug;
  images?: Array<{
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    alt?: string;
    _type: "image";
    _key: string;
  }>;
  description?: Array<{
    children?: Array<{
      marks?: Array<string>;
      text?: string;
      _type: "span";
      _key: string;
    }>;
    style?: "normal" | "h1" | "h2" | "h3" | "h4" | "blockquote";
    listItem?: "bullet";
    markDefs?: Array<{
      href?: string;
      _type: "link";
      _key: string;
    }>;
    level?: number;
    _type: "block";
    _key: string;
  } | {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    alt?: string;
    _type: "image";
    _key: string;
  }>;
  variants?: Array<{
    curbura?: "M" | "C" | "D";
    grosime?: "0.05" | "0.10" | "0.15";
    marime?: "7" | "8" | "9" | "10" | "11" | "12" | "13" | "14" | "15" | "mix";
    price?: number;
    stock?: number;
    _key: string;
  }>;
  categories?: Array<{
    _ref: string;
    _type: "reference";
    _weak?: boolean;
    _key: string;
    [internalGroqTypeReferenceTo]?: "category";
  }>;
};

export type Category = {
  _id: string;
  _type: "category";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  title?: string;
  slug?: Slug;
  description?: string;
};

export type Slug = {
  _type: "slug";
  current?: string;
  source?: string;
};

export type BlockContent = Array<{
  children?: Array<{
    marks?: Array<string>;
    text?: string;
    _type: "span";
    _key: string;
  }>;
  style?: "normal" | "h1" | "h2" | "h3" | "h4" | "blockquote";
  listItem?: "bullet";
  markDefs?: Array<{
    href?: string;
    _type: "link";
    _key: string;
  }>;
  level?: number;
  _type: "block";
  _key: string;
} | {
  asset?: {
    _ref: string;
    _type: "reference";
    _weak?: boolean;
    [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
  };
  hotspot?: SanityImageHotspot;
  crop?: SanityImageCrop;
  alt?: string;
  _type: "image";
  _key: string;
}>;

export type SanityImageCrop = {
  _type: "sanity.imageCrop";
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};

export type SanityImageHotspot = {
  _type: "sanity.imageHotspot";
  x?: number;
  y?: number;
  height?: number;
  width?: number;
};

export type SanityImageAsset = {
  _id: string;
  _type: "sanity.imageAsset";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  originalFilename?: string;
  label?: string;
  title?: string;
  description?: string;
  altText?: string;
  sha1hash?: string;
  extension?: string;
  mimeType?: string;
  size?: number;
  assetId?: string;
  uploadId?: string;
  path?: string;
  url?: string;
  metadata?: SanityImageMetadata;
  source?: SanityAssetSourceData;
};

export type SanityAssetSourceData = {
  _type: "sanity.assetSourceData";
  name?: string;
  id?: string;
  url?: string;
};

export type SanityImageMetadata = {
  _type: "sanity.imageMetadata";
  location?: Geopoint;
  dimensions?: SanityImageDimensions;
  palette?: SanityImagePalette;
  lqip?: string;
  blurHash?: string;
  hasAlpha?: boolean;
  isOpaque?: boolean;
};

export type AllSanitySchemaTypes = SanityImagePaletteSwatch | SanityImagePalette | SanityImageDimensions | SanityFileAsset | Geopoint | AccessCode | Course | Sales | Order | Product | Category | Slug | BlockContent | SanityImageCrop | SanityImageHotspot | SanityImageAsset | SanityAssetSourceData | SanityImageMetadata;
export declare const internalGroqTypeReferenceTo: unique symbol;
// Source: ./sanity/lib/getMyOrders/getMyOders.tsx
// Variable: My_ORDERS_QUERY
// Query: *[_type == "order" && clerkUserId == $userId] | order(_createdAt desc){    ...,    products[]{      ...,      product->    }  }
export type My_ORDERS_QUERYResult = Array<{
  _id: string;
  _type: "order";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  orderIndex?: number;
  orderNumber?: string;
  paymentType?: "card" | "ramburs" | "transfer";
  status?: "anulata" | "in_asteptare" | "livrata" | "platita" | "returnata";
  orderDate?: string;
  invoice?: {
    number?: string;
    series?: string;
    url?: string;
  };
  customerName?: string;
  email?: string;
  address?: {
    firstName?: string;
    lastName?: string;
    province?: string;
    city?: string;
    postalCode?: string;
    street?: string;
    phone?: string;
    email?: string;
  };
  billingAddress?: {
    isLegalEntity?: boolean;
    companyName?: string;
    cui?: string;
    tradeRegisterNumber?: string;
    companyAddress?: string;
    companyCity?: string;
    companyCounty?: string;
    companyPostalCode?: string;
    bankName?: string;
    iban?: string;
  };
  products: Array<{
    product: {
      _id: string;
      _type: "product";
      _createdAt: string;
      _updatedAt: string;
      _rev: string;
      name?: string;
      slug?: Slug;
      images?: Array<{
        asset?: {
          _ref: string;
          _type: "reference";
          _weak?: boolean;
          [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
        };
        hotspot?: SanityImageHotspot;
        crop?: SanityImageCrop;
        alt?: string;
        _type: "image";
        _key: string;
      }>;
      description?: Array<{
        children?: Array<{
          marks?: Array<string>;
          text?: string;
          _type: "span";
          _key: string;
        }>;
        style?: "blockquote" | "h1" | "h2" | "h3" | "h4" | "normal";
        listItem?: "bullet";
        markDefs?: Array<{
          href?: string;
          _type: "link";
          _key: string;
        }>;
        level?: number;
        _type: "block";
        _key: string;
      } | {
        asset?: {
          _ref: string;
          _type: "reference";
          _weak?: boolean;
          [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
        };
        hotspot?: SanityImageHotspot;
        crop?: SanityImageCrop;
        alt?: string;
        _type: "image";
        _key: string;
      }>;
      variants?: Array<{
        curbura?: "C" | "D" | "M";
        grosime?: "0.05" | "0.10" | "0.15";
        marime?: "10" | "11" | "12" | "13" | "14" | "15" | "7" | "8" | "9" | "mix";
        price?: number;
        stock?: number;
        _key: string;
      }>;
      categories?: Array<{
        _ref: string;
        _type: "reference";
        _weak?: boolean;
        _key: string;
        [internalGroqTypeReferenceTo]?: "category";
      }>;
    } | null;
    quantity?: number;
    variant?: {
      curbura?: string;
      grosime?: string;
      marime?: string;
      price?: number;
      stock?: number;
    };
    _key: string;
  }> | null;
  totalPrice?: number;
  discount?: number;
  promoCode?: string;
  shippingCost?: number;
  currency?: "EUR" | "RON";
}>;

// Source: ./sanity/lib/products/getAllProducts.ts
// Variable: ALL_PRODUCTS_QUERY
// Query: *[                _type == "product"            ] | order(name asc)
export type ALL_PRODUCTS_QUERYResult = Array<{
  _id: string;
  _type: "product";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  name?: string;
  slug?: Slug;
  images?: Array<{
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    alt?: string;
    _type: "image";
    _key: string;
  }>;
  description?: Array<{
    children?: Array<{
      marks?: Array<string>;
      text?: string;
      _type: "span";
      _key: string;
    }>;
    style?: "blockquote" | "h1" | "h2" | "h3" | "h4" | "normal";
    listItem?: "bullet";
    markDefs?: Array<{
      href?: string;
      _type: "link";
      _key: string;
    }>;
    level?: number;
    _type: "block";
    _key: string;
  } | {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    alt?: string;
    _type: "image";
    _key: string;
  }>;
  variants?: Array<{
    curbura?: "C" | "D" | "M";
    grosime?: "0.05" | "0.10" | "0.15";
    marime?: "10" | "11" | "12" | "13" | "14" | "15" | "7" | "8" | "9" | "mix";
    price?: number;
    stock?: number;
    _key: string;
  }>;
  categories?: Array<{
    _ref: string;
    _type: "reference";
    _weak?: boolean;
    _key: string;
    [internalGroqTypeReferenceTo]?: "category";
  }>;
}>;

// Source: ./sanity/lib/products/getProductsByCategory.ts
// Variable: PRODUCTS_BY_CATEGORY_QUERY
// Query: *[            _type == 'product' &&            references(*[_type == 'category' && slug.current == $categorySlug]._id)        ] | order(name asc)
export type PRODUCTS_BY_CATEGORY_QUERYResult = Array<{
  _id: string;
  _type: "product";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  name?: string;
  slug?: Slug;
  images?: Array<{
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    alt?: string;
    _type: "image";
    _key: string;
  }>;
  description?: Array<{
    children?: Array<{
      marks?: Array<string>;
      text?: string;
      _type: "span";
      _key: string;
    }>;
    style?: "blockquote" | "h1" | "h2" | "h3" | "h4" | "normal";
    listItem?: "bullet";
    markDefs?: Array<{
      href?: string;
      _type: "link";
      _key: string;
    }>;
    level?: number;
    _type: "block";
    _key: string;
  } | {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    alt?: string;
    _type: "image";
    _key: string;
  }>;
  variants?: Array<{
    curbura?: "C" | "D" | "M";
    grosime?: "0.05" | "0.10" | "0.15";
    marime?: "10" | "11" | "12" | "13" | "14" | "15" | "7" | "8" | "9" | "mix";
    price?: number;
    stock?: number;
    _key: string;
  }>;
  categories?: Array<{
    _ref: string;
    _type: "reference";
    _weak?: boolean;
    _key: string;
    [internalGroqTypeReferenceTo]?: "category";
  }>;
}>;

// Source: ./sanity/lib/products/searchProductsByName.ts
// Variable: PRODUCT_SEARCH_QUERY
// Query: *[    _type == "product"    && name match $searchParam    ] | order(name desc)
export type PRODUCT_SEARCH_QUERYResult = Array<{
  _id: string;
  _type: "product";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  name?: string;
  slug?: Slug;
  images?: Array<{
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    alt?: string;
    _type: "image";
    _key: string;
  }>;
  description?: Array<{
    children?: Array<{
      marks?: Array<string>;
      text?: string;
      _type: "span";
      _key: string;
    }>;
    style?: "blockquote" | "h1" | "h2" | "h3" | "h4" | "normal";
    listItem?: "bullet";
    markDefs?: Array<{
      href?: string;
      _type: "link";
      _key: string;
    }>;
    level?: number;
    _type: "block";
    _key: string;
  } | {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    alt?: string;
    _type: "image";
    _key: string;
  }>;
  variants?: Array<{
    curbura?: "C" | "D" | "M";
    grosime?: "0.05" | "0.10" | "0.15";
    marime?: "10" | "11" | "12" | "13" | "14" | "15" | "7" | "8" | "9" | "mix";
    price?: number;
    stock?: number;
    _key: string;
  }>;
  categories?: Array<{
    _ref: string;
    _type: "reference";
    _weak?: boolean;
    _key: string;
    [internalGroqTypeReferenceTo]?: "category";
  }>;
}>;

// Source: ./sanity/lib/sales/getActiveSaleByCouponCode.ts
// Variable: ACTIVE_SALE_BY_COUPON_CODE_QUERY
// Query: *[        _type == "sales"         && isActive == true        && couponCode == $couponCode        && dateTime(now()) >= dateTime(validForm)        && dateTime(now()) <= dateTime(validUntil)    ] | order(validForm desc)[0]
export type ACTIVE_SALE_BY_COUPON_CODE_QUERYResult = {
  _id: string;
  _type: "sales";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  title?: string;
  description?: string;
  discountAmount?: number;
  couponCode?: string;
  validForm?: string;
  validUntil?: string;
  isActive?: boolean;
} | null;

// Query TypeMap
import "@sanity/client";
declare module "@sanity/client" {
  interface SanityQueries {
    "\n    *[_type == \"order\" && clerkUserId == $userId] | order(_createdAt desc){\n    ...,\n    products[]{\n      ...,\n      product->\n    }\n  }\n": My_ORDERS_QUERYResult;
    "\n            *[\n                _type == \"product\"\n            ] | order(name asc)\n        ": ALL_PRODUCTS_QUERYResult;
    "\n        *[\n            _type == 'product' &&\n            references(*[_type == 'category' && slug.current == $categorySlug]._id)\n        ] | order(name asc)\n        ": PRODUCTS_BY_CATEGORY_QUERYResult;
    "*[\n    _type == \"product\"\n    && name match $searchParam\n    ] | order(name desc)": PRODUCT_SEARCH_QUERYResult;
    "*[\n        _type == \"sales\" \n        && isActive == true\n        && couponCode == $couponCode\n        && dateTime(now()) >= dateTime(validForm)\n        && dateTime(now()) <= dateTime(validUntil)\n    ] | order(validForm desc)[0]": ACTIVE_SALE_BY_COUPON_CODE_QUERYResult;
  }
}
