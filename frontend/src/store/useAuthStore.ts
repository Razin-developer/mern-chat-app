import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = "/";

export const useAuthStore: any = create((set, get: any) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,
  isCheckingForgot: false,
  forgotCode: null,
  forgotEmail: '',
  isVerifyingForgot: false,
  isResetingPassword: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      set({ authUser: res.data.user });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data: any) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data.user });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error: any) {
      toast.error(error.response.data.message);
      console.log(error)
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data: any) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data.user });
      toast.success("Logged in successfully");

      get().connectSocket();
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  },

  forgot: async (data: {email: string}) => {
    set({isCheckingForgot: true});
    try {
      const res = await axiosInstance.post("/auth/forgot", data);
      set({forgotCode: res.data.code, forgotEmail: data.email});
      toast.success("Code sent to your email");
    } catch (error: any) {
      toast.error(error.response.data.message);
      console.log('error in forgot', error);
      throw new Error("Error in forgot");
    } finally {
      set({isCheckingForgot: false});
    }
  },

  verifyForgot: async (code: number) => {
    set({isVerifyingForgot: true});
    try {
      const email = get().forgotEmail
      console.log(email);
      
      if (Number(code) !== Number(get().forgotCode)) {
        toast.error("Enter correct code")
        set({isVerifyingForgot: false});
        throw new Error("Enter correct code"); 
      }
      const res = await axiosInstance.post("/auth/forgot/success", {email});
      set({authUser: res.data});
      toast.success("Successfully loggedIn");
    } catch (error: any) {
      toast.error(error.response.data.message);
      console.log('error in forgot', error);
    } finally {
      set({isVerifyingForgot: false});
    }
  },

  reset: async (data: {email: string, password: string, confirm: string}) => {
    set({isCheckingForgot: true});
    try {
      const res = await axiosInstance.post("/auth/reset", data);
      set({authUser: res.data});
      toast.success("Password change successflly");
    } catch (error: any) {
      toast.error(error.response.data.message);
      console.log('error in reset', error);
      throw new Error("Error in Reset");
    } finally {
      set({isCheckingForgot: false});
    }
  },

  updateProfile: async (data: any) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data.user });
      toast.success("Profile updated successfully");
    } catch (error: any) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
