import useSWR from "swr";
import { useMemo } from "react";
// utils
import { fetcher, endpoints, sender } from "src/utils/axios";
import { useMockedUser } from "src/hooks/use-mocked-user";

// ----------------------------------------------------------------------

export function useGetBussinesses(page, per_page) {
  const URL = [endpoints.Business.list, { params: { page, per_page } }];

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      bussiness: data?.data || [],
      meta: data?.meta,
      bussinessLoading: isLoading,
      bussinessError: error,
      bussinessValidating: isValidating,
      bussinessEmpty: !isLoading && !data?.data.length,
    }),
    [data?.data, error, isLoading, isValidating, data?.meta]
  );

  return memoizedValue;
}
export function useGetAllCurrencies() {
  const URL = [endpoints.currencies];

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      currencies: data?.data || [],
      meta: data?.meta,
      currenciesLoading: isLoading,
      currenciesError: error,
      currenciesValidating: isValidating,
      currenciesEmpty: !isLoading && !data?.data.length,
    }),
    [data?.data, error, isLoading, isValidating, data?.meta]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetAllBusinesses(is_food_stuff) {
  console.log(is_food_stuff);
  const { user } = useMockedUser();
  const URL = user.id
  ? 
  is_food_stuff !== 0
  ? `${endpoints.Business.list}?is_food_stuff=1&user_id=${user.id}&active=1`
  : `${endpoints.Business.list}&user_id=${user.id}&active=1`  : null;
  const { data, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      businesses: data?.data || [],
      businessesLoading: !error && !data,
      businessesError: error,
      businessesValidating: isValidating,
      businessesEmpty: !error && !isValidating && (!data || !data?.data.length),
    }),
    [data?.data, error, isValidating]
  );

  return memoizedValue;
}
export function useGetAllBusineses() {
  const { user } = useMockedUser();
  const URL = user.id
  ?  `${endpoints.Business.list}?active=1&user_id=${user.id}`  : null;

  const { data, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      businesses: data?.data || [],
      businessesLoading: !error && !data,
      businessesError: error,
      businessesValidating: isValidating,
      businessesEmpty: !error && !isValidating && (!data || !data?.data.length),
    }),
    [data?.data, error, isValidating]
  );

  return memoizedValue;
}
// ----------------------------------------------------------------------

export function useGetBussiness(bussinesids) {
  const URL = bussinesids
    ? [`${endpoints.Business.details}${bussinesids}`]
    : null;

    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      bussiness: data?.data,
      bussinessLoading: isLoading,
      bussinessError: error,
      bussinessValidating: isValidating,
    }),
    [data?.data, error, isLoading, isValidating]
  );
  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetBusinessByCategories(business_department_id) {
  const URL = `${endpoints.Business.categories}/?is_parent=1&active=1&page=1&per_page=50&business_department_id=${business_department_id}`;
  const { data, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      businessesCategories: data?.data || [],
      businessesCategoriesLoading: !error && !data,
      businessesCategoriesError: error,
      businessesCategoriesValidating: isValidating,
    }),
    [data?.data, error, isValidating]
  );
  return memoizedValue;
}

export function useGetSubcategories(categoriesid,business_department_id) {
    const URL =  categoriesid!==null?
  `${endpoints.Business.categories}/?parent=${categoriesid}&active=1&page=1&per_page=50&business_department_id=${business_department_id}`:null;
 console.log(URL);
  const { data, error, isValidating } = useSWR(URL, fetcher);
  console.log(data);
  const memoizedValue = useMemo(
    () => ({
      businessesSubcategories: data?.data || [],
      businessesSubcategoriesLoading: !error && !data,
      businessesSubcategoriesError: error,
      businessesSubcategoriesValidating: isValidating,
    }),
    [data?.data, error, isValidating]
  );

  return memoizedValue;
}
export function useGetSubChaincategories(categoriesid,categoriesParent,business_department_id) {
    const URL =  categoriesid!==null &&categoriesParent!==null?
  `${endpoints.Business.categories}/?parent=${categoriesid,categoriesParent}&active=1&page=1&per_page=50&business_department_id=${business_department_id}`:null;
 console.log(URL);
  const { data, error, isValidating } = useSWR(URL, fetcher);
  console.log(data);
  const memoizedValue = useMemo(
    () => ({
      businessesSubChaincategories: data?.data || [],
      businessesSubChaincategoriesLoading: !error && !data,
      businessesSubChaincategoriesError: error,
      businessesSubChaincategoriesValidating: isValidating,
    }),
    [data?.data, error, isValidating]
  );

  return memoizedValue;
}
export function useGetBusinessByCategorieschildrens(categoriesid,business_department_id,categoriesParent) {
    const URL =  categoriesid!==null?
  `${endpoints.Business.categories}/?parent=${categoriesid}&active=1&page=1&per_page=50&business_department_id=${business_department_id}`:null;
 console.log(URL);
  const { data, error, isValidating } = useSWR(URL, fetcher);
  console.log(data);
  const memoizedValue = useMemo(
    () => ({
      businessesCategoriesParent: data?.data || [],
      businessesCategoriesParentLoading: !error && !data,
      businessesCategoriesParentError: error,
      businessesCategoriesParentValidating: isValidating,
    }),
    [data?.data, error, isValidating]
  );

  return memoizedValue;
}
export function useGetBusinessByCategorieschildrensofchild(categoriesParentOfParent,business_department_id,) {
    const URL =  categoriesParentOfParent==null?
  null:`${endpoints.Business.categories}/?parent=${categoriesParentOfParent}&active=1&page=1&per_page=50&business_department_id=${business_department_id}`;
 
  const { data, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      businessesCategoriesParentofpoarent: data?.data || [],
      businessesCategoriesParentofpoarentLoading: !error && !data,
      businessesCategoriesParentError: error,
      businessesCategoriesParentValidating: isValidating,
    }),
    [data?.data, error, isValidating]
  );

  return memoizedValue;
}
