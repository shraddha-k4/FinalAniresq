// export const baseUrl ="http://localhost:3000";

import { Platform } from "react-native";

export const baseUrl =
  Platform.OS === "web"
    ? "http://localhost:3000"
    : "http://10.237.216.119:3000"; 


export const Auth_signup = `${baseUrl}/api/auth/signup`;
export const Auth_login = `${baseUrl}/api/auth/login`;
export const Auth_forgotpassword = `${baseUrl}/api/auth/forgotpassword`;
export const Auth_verifyotp = `${baseUrl}/api/auth/verifyotp`;
export const Auth_profile = `${baseUrl}/api/auth/getProfile`;  //get profile
export const Auth_update_profile =`${baseUrl}/api/auth/updateprofile`;
//Report
export const Create_Report = `${baseUrl}/api/reports/create`;
export const My_Report = `${baseUrl}/api/reports/my`;
export const Get_Report_By_Id = (id) =>`${baseUrl}/api/reports/${id}`;
export const Get_all_report = `${baseUrl}/api/reports/all`;
// ADMIN APIs
export const Admin_Get_All_Users = `${baseUrl}/api/admin/users`;
export const Admin_Get_NGO_Users=`${baseUrl}/api/admin/ngousers`;
export const Admin_Get_Citizen_Users=`${baseUrl}/api/admin/citizenusers`;
export const Admin_Blacklist_User = (id) =>`${baseUrl}/api/admin/blacklist/${id}`;
export const Admin_Delete_User = (id) =>`${baseUrl}/api/admin/user/${id}`;
export const Admin_Get_Blacklisted=`${baseUrl}/api/admin/getblacklist`;
export const Admin_Unblacklist_User=(id)=>`${baseUrl}/api/admin/unblacklist/${id}`;
export const Admin_Dashboard_Stats = `${baseUrl}/api/admin/dashboardstats`;
