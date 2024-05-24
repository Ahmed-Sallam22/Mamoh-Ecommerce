import useSWR from "swr";
import { useMemo } from "react";
// utils
import { fetcher, endpoints, sender } from "src/utils/axios";

// ----------------------------------------------------------------------

export function useGetProducts(page, per_page,name) {
  const params = { business_department_id: 8, page, per_page
    // , active: 1
   };

  if (name ==undefined || name =="") {
    delete params.q_field;
    delete params.q;
  } else {
    params.q_field = 'name';
    params.q = name;
  }
  
  const URL = [endpoints.product.list, { params }];
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      Foodproducts: data?.data || [],
      meta: data?.meta,
      FoodproductsLoading: isLoading,
      FoodproductsError: error,
      FoodproductsValidating: isValidating,
      FoodproductsEmpty: !isLoading && !data?.data.length,
    }),
    [data?.data, error, isLoading, isValidating, data?.meta]
  );

  return memoizedValue;
}
export function useGetMarket_product(page, per_page,name) {
  const params = { business_department_id: 5, page, per_page
    // , active: 1
   };
  if (name ==undefined || name =="") {
    delete params.q_field;
    delete params.q;
  } else {
    params.q_field = 'name';
    params.q = name;
  }
  const URL = [endpoints.product.list, { params }];
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
console.log(URL,data);
  const memoizedValue = useMemo(
    () => ({
      Marketproducts: data?.data || [],
      meta: data?.meta,
      MarketproductsLoading: isLoading,
      MarketproductsError: error,
      MarketproductsValidating: isValidating,
      MarketproductsEmpty: !isLoading && !data?.data.length,
    }),
    [data?.data, error, isLoading, isValidating, data?.meta]
  );

  return memoizedValue;
}
// /order/69
// ----------------------------------------------------------------------

export function useGetProduct(productId) {
  const URL = productId ? [`${endpoints.product.details}${productId}`] : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      product: data?.data,
      productLoading: isLoading,
      productError: error,
      productValidating: isValidating,
    }),
    [data?.data, error, isLoading, isValidating]
  );
  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useSearchProducts(query) {
  const URL = query ? [endpoints.product.search, { params: { query } }] : null;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      searchResults: data?.results || [],
      searchLoading: isLoading,
      searchError: error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !data?.results.length,
    }),
    [data?.results, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export const deleteProducts = async (productIds) => {
  const URL = endpoints.product.delete;
  const deletedIds = [];
  const failedIds = [];
  try {
    await Promise.all(
      productIds.map(async (productId) => {
        try {
          const deleteUrl = URL + "/" + productId;

          const result = await sender(deleteUrl);
          const success = result.message === "Deleted Successfully";
          if (success) {
            return deletedIds.push(productId);
          } else {
            return failedIds.push({ productId, message: result.message });
          }
        } catch (error) {
          return failedIds.push({ productId, message: error.errors });
        }
      })
    );
    return { deletedIds, failedIds };
  } catch (error) {
    console.error("Error deleting products:", error);
    return { success: false, error };
  }
};

export const updateProduct = async (productId, requestBody) => {
  const URL = [endpoints.product.update + "/" + productId, requestBody];
  try {
    const result = await sender(URL);
    const success = result.message === "Updated Successfully" || result.message === "تم التحديث بنجاح";
    return { success, data: result.data };
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false, error };
  }
};

export function useGetCountry(countryId) {
  const URL = countryId ? [`${endpoints.countries}${countryId}`] : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      country: data?.data,
      countryLoading: isLoading,
      countryError: error,
      countryValidating: isValidating,
    }),
    [data?.data, error, isLoading, isValidating]
  );
  return memoizedValue;
}

export function useGetALLProducts() {
  const URL = endpoints.product.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  
  const memoizedValue = useMemo(
    () => ({
      products: data?.data || [],
      meta: data?.meta,
      productsLoading: isLoading,
      productsError: error,
      productsValidating: isValidating,
      productsEmpty: !isLoading && !data?.data.length,
    }),
    [data?.data, error, isLoading, isValidating, data?.meta]
  );

  return memoizedValue;
}
export function useGETFillterColor(categoreyId,business_department_id) {
  const URL = categoreyId===undefined||categoreyId===''?null:
  [`${endpoints.Fillter.color}?active=1&category_id=${categoreyId}&departments=${business_department_id}`];
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      Colors: data?.data || [],
      meta: data?.meta,
      ColorsLoading: isLoading,
      ColorsError: error,
      ColorsValidating: isValidating,
      ColorsEmpty: !isLoading && !data?.data.length,
    }),
    [data?.data, error, isLoading, isValidating, data?.meta]
  );

  return memoizedValue;
}
