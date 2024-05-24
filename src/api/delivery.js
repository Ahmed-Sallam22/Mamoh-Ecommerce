import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints, sender } from 'src/utils/axios';
import { useMockedUser } from "src/hooks/use-mocked-user";

// ----------------------------------------------------------------------

export function useGetAllMarketOrders(setidOFAll,orders_status_id,page,per_page) {
  const { user } = useMockedUser();
console.log(orders_status_id);
  const URL = user.id 
  ? 
  orders_status_id==undefined?
  `${endpoints.delivery.allOrders}?&orders_status_id=${setidOFAll}&department_id=5&product_user_id=${user.id}&page=${page}&per_page=${per_page}`
  :  `${endpoints.delivery.allOrders}?&orders_status_id=${orders_status_id}&department_id=5&product_user_id=${user.id}`

  : null;
  console.log(URL);

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  console.log(data);
  const memoizedValue = useMemo(
    () => ({
      allMarketOrders: data?.data || [],
      ordersLoading: isLoading,
      ordersError: error,
      meta: data?.meta,
      ordersValidating: isValidating,
      ordersEmpty: !isLoading && !data?.data.length,
    }),
    [data, error, isLoading, isValidating]
  );
  return memoizedValue;
}
export function useGetAllFoodOrders(setidOFAll,orders_status_id,page,per_page) {
  const { user } = useMockedUser();
  const URL = user.id 
  ? 
  orders_status_id==undefined?
  `${endpoints.delivery.allOrders}?&orders_status_id=${setidOFAll}&department_id=8&product_user_id=${user.id}&page=${page}&per_page=${per_page}`
  :  `${endpoints.delivery.allOrders}?&orders_status_id=${orders_status_id}&department_id=8&product_user_id=${user.id}`

  : null;
  console.log(URL);

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      allFoodOrders: data?.data || [],
      ordersFoodLoading: isLoading,
      ordersError: error,
      meta: data?.meta,
      ordersValidating: isValidating,
      ordersEmpty: !isLoading && !data?.data.length,
    }),
    [data, error, isLoading, isValidating]
  );
  return memoizedValue;
}
export function useGetAllFoodOrdersDelivery() {
  const { user } = useMockedUser();

  const URL = user.id
  ? [endpoints.delivery.allOrders, { params: { delivery_user_id: user.id, department_id: 8 } }]
  : null;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      allFoodOrdersDelivery: data?.data || [],
      ordersLoading: isLoading,
      ordersError: error,
      ordersValidating: isValidating,
      ordersEmpty: !isLoading && !data?.data.length,
    }),
    [data, error, isLoading, isValidating]
  );
  return memoizedValue;
}
export function useGetAllMarketOrdersDelivery() {
  const { user } = useMockedUser();

  const URL = user.id
  ? [endpoints.delivery.allOrders, { params: { delivery_user_id: user.id, department_id: 5 } }]
  : null;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      allMarketOrdersDelivery: data?.data || [],
      ordersLoading: isLoading,
      ordersError: error,
      ordersValidating: isValidating,
      ordersEmpty: !isLoading && !data?.data.length,
    }),
    [data, error, isLoading, isValidating]
  );
  return memoizedValue;
}

export function useGetOrder(OrderID) {
  const { user } = useMockedUser();

  const URL = OrderID ? [`${endpoints.delivery.details}${OrderID}?product_user_id=${user.id}`] : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      orderbyID: data?.data,
      orderLoading: isLoading,
      orderError: error,
      orderValidating: isValidating,
    }),
    [data?.data, error, isLoading, isValidating]
  );
  return memoizedValue;
}
export function useGetReasones() {
  const { user } = useMockedUser();

  const URL =  `api/rejection-reasons/?page=1&per_page=50&active=1`

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      Reasones: data?.data,
      ReasonesLoading: isLoading,
      ReasonesError: error,
      ReasonesValidating: isValidating,
    }),
    [data?.data, error, isLoading, isValidating]
  );
  return memoizedValue;
}


export const updateOrder = async (ordertId, orders_status_id) => {
    console.log(orders_status_id);
  const URL = [endpoints.delivery.update + "/" + ordertId];
  console.log(URL);
  try {
    const result = await sender(URL,orders_status_id);

    const success = result.message === "Updated Successfully" || result.message === "تم التحديث بنجاح";
    return { success, data: result.data };
  } catch (error) {
    console.error("Error updating Order:", error);
    return { success: false, error };
  }
};