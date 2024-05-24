import useSWR from 'swr';
import { useMemo } from 'react';
// utils
import { fetcher, endpoints, sender } from 'src/utils/axios';
import { useMockedUser } from "src/hooks/use-mocked-user";

// ----------------------------------------------------------------------


export const updateuserData = async (userId,values) => {
  const URL = [endpoints.user.update + "/" + userId];
  try {
    const result = await sender(URL,values);

    const success = result.message === "Updated Successfully" || result.message === "تم التحديث بنجاح";
    return { success, data: result.data };
  } catch (error) {
    console.error("Error updating Order:", error);
    return { success: false, error };
  }
};
export const resest_password = async (userId,values) => {
  const URL = `/api/users/change-password/${userId}`;
  try {
    const result = await sender(URL,values);

    const success = result.message === "Updated Successfully" || result.message === "تم التحديث بنجاح";
    return { success, data: result.data };
  } catch (error) {
    console.error("Error updating Order:", error);
    return { success: false, error };
  }
};