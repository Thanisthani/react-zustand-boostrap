import { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";

import { AxiosInstance } from "axios";
import authStore from "../store/authStore";


const useAxiosPrivate = () : AxiosInstance  => {
    const refresh = useRefreshToken();
    const auth = authStore((state: any) => state.auth);

    useEffect(() => {
        
        const requestIntercept = axiosPrivate.interceptors.request.use(

            function (config) {
                if (!config.headers!['Authorization']) {
                    config.headers!['Authorization'] = `Bearer ${auth?.accessToken}`;
                }
                
                console.log("ithu header",config.headers);
                console.log("access token state",auth?.accessToken )
                return config;
              }, function (error) {
                // Do something with request error
                return Promise.reject(error);
        })
            
            

        //     config  => {
        //         if (!config.headers!['Authorization']) {
        //             config.headers!['Authorization'] = `Bearer ${auth?.accessToken}`;
        //         }
        //         console.log("access token state",auth?.accessToken )
        //         return config;
        //     }, (error) => Promise.reject(error)
        // );

        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const newAccessToken = await refresh();
                    console.log("new access token", newAccessToken)
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return await axiosPrivate(prevRequest);
                }
                return Promise.reject(error);
            }
        );


        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        }


    },[auth,refresh])

    return axiosPrivate
}

export default useAxiosPrivate;