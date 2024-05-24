import useSWR from 'swr';
import { useEffect, useMemo, useState } from 'react';
// utils
import { fetcher, endpoints, fetcher2 } from 'src/utils/axios';
import { useMockedUser } from 'src/hooks/use-mocked-user';
import { useAuthContext } from 'src/auth/hooks';
import axios from 'axios';

// ----------------------------------------------------------------------

export function useGetReports(setidOFAll,dispalyids,department,page,per_page) {
  const { user } = useMockedUser();
  const auth = useAuthContext();

  const URL = user.id 
  ? 
  dispalyids==undefined?
  `/api/reports/seller/${user.id}?&orders_status_id=${setidOFAll}&department_id=${department}&page=${page}&per_page=${per_page}`
  :  `/api/reports/seller/${user.id}?&orders_status_id=${dispalyids}&department_id=${department}&page=${page}&per_page=${per_page}`

  : null;
  // const URL = user.id
  // ? `/api/reports/seller/${user.id}&department_id=${department}`
  // : null;
  const accessToken = auth?.user?.accessToken;

  const { data, error, isValidating } = useSWR([URL, accessToken], fetcher);
  const isLoading = !data && !error;

  const memoizedValue = useMemo(
    () => ({
      reports: data?.data || [],
      meta: data?.meta,
      reportsLoading: isLoading,
      reportsError: error,
      reportsEmpty: !isLoading && data && data.data && data.data.length === 0,
    }),
    [data?.data, data?.meta, isLoading, error]
  );

  return memoizedValue;
}
export function useGetReportsDelivery(page, per_page) {
  const { user } = useMockedUser();
  const auth = useAuthContext();

const URL = user.id ? `/api/reports/driver/${user.id}` : null;

  const accessToken = auth?.user?.accessToken;

  const { data, error, isValidating } = useSWR([URL, accessToken], fetcher);
  const isLoading = !data && !error;
console.log(data);
  const memoizedValue = useMemo(
    () => ({
      reports: data?.data || [],
      meta: data?.meta,
      reportsLoading: isLoading,
      reportsError: error,
      reportsEmpty: !isLoading && data && data.data && data.data.length === 0,
    }),
    [data?.data, data?.meta, isLoading, error]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetorder(orderId) {
  const URL = orderId ? [`${endpoints.delivery.details}${orderId}`] : null;
  

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      order: data?.data || [],
      orderLoading: isLoading,
      orderError: error,
      orderValidating: isValidating,
    }),
    [data?.data, error, isLoading, isValidating]
  );
  return memoizedValue;
}

export function useGetStatusorder(department) {
  const { user } = useMockedUser();
  const URL = `api/ordersStatus/?active=1&type=2&order_by=serial&department_id=${department}`

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      orderStatus: data?.data,
      orderLoading: isLoading,
      orderError: error,
      orderValidating: isValidating,
    }),
    [data?.data, error, isLoading, isValidating]
  );
  return memoizedValue;
}
export function useGetStatics(department) {
  const { user } = useMockedUser();

  const URL = `api/reports/sales_statistics/${department}/${user.id}`
  

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      orderStatic: data?.data,
      orderLoading: isLoading,
      orderError: error,
      orderValidating: isValidating,
    }),
    [data?.data, error, isLoading, isValidating]
  );
  return memoizedValue;
}
export function useGetStaticsDelivery() {
  const { user } = useMockedUser();

  const URL = `api/reports/delivery_statistics/${user.id}`
  

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  console.log(URL,data);
  const memoizedValue = useMemo(
    () => ({
      orderStatic: data?.data,
      orderLoading: isLoading,
      orderError: error,
      orderValidating: isValidating,
    }),
    [data?.data, error, isLoading, isValidating]
  );
  return memoizedValue;
}


// ----------------------------------------------------------------------

export function useGetLatestPosts(title) {
  const URL = title ? [endpoints.post.latest, { params: { title } }] : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      latestPosts: data?.latestPosts || [],
      latestPostsLoading: isLoading,
      latestPostsError: error,
      latestPostsValidating: isValidating,
      latestPostsEmpty: !isLoading && !data?.latestPosts.length,
    }),
    [data?.latestPosts, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useSearchPosts(query) {
  const URL = query ? [endpoints.post.search, { params: { query } }] : null;

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
