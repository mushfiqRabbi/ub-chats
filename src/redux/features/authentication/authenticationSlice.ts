import { createSlice } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../../firebase/firebaseConfig";
import { signOut } from "firebase/auth";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

interface SignInData {
  email: string;
  password: string;
}
interface SignUpData extends SignInData {
  fullName: string;
}

export const signInUser = createAsyncThunk(
  "authentication/signInUser",
  async (user: SignInData) => {
    try {
      return JSON.stringify(
        await signInWithEmailAndPassword(auth, user.email, user.password)
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }
);

export const signUpUser = createAsyncThunk(
  "authentication/signUpUser",
  async (user: SignUpData) => {
    try {
      return JSON.stringify(
        await createUserWithEmailAndPassword(auth, user.email, user.password)
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }
);

export const signOutUser = createAsyncThunk(
  "authentication/singOutUser",
  async () => {
    try {
      return JSON.stringify(await signOut(auth));
    } catch (error) {
      if (error instanceof Error) throw new Error(error.message);
    }
  }
);

let signInToast: string | number;
let signUpToast: string | number;
let signOutToast: string | number;

export const authenticationSlice = createSlice({
  name: "authentication",
  initialState: {
    user: null,
    authLoading: true,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = JSON.parse(action.payload);
      state.authLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInUser.pending, (state) => {
        state.authLoading = true;
        signInToast = toast.loading("LOGGING IN...");
      })
      .addCase(signInUser.fulfilled, (state) => {
        state.authLoading = false;
        // console.log(action);
        toast.update(signInToast, {
          render: "LOGIN SUCCESSFUL!",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
      })
      .addCase(signInUser.rejected, (state, action) => {
        state.authLoading = false;
        toast.update(signInToast, {
          render:
            action.error.message
              ?.slice(action.error.message?.indexOf("/") + 1, -2)
              .replace(/-/gi, " ")
              .toUpperCase() + "!",
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      })
      .addCase(signUpUser.pending, (state) => {
        state.authLoading = true;
        signUpToast = toast.loading("SIGNING UP...");
      })
      .addCase(signUpUser.fulfilled, (state) => {
        state.authLoading = false;
        // console.log(action);
        toast.update(signUpToast, {
          render: "SIGNUP SUCCESSFUL!",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.authLoading = false;
        toast.update(signUpToast, {
          render:
            action.error.message
              ?.slice(action.error.message?.indexOf("/") + 1, -2)
              .replace(/-/gi, " ")
              .toUpperCase() + "!",
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      })
      .addCase(signOutUser.pending, (state) => {
        state.authLoading = true;
        signOutToast = toast.loading("SINGING OUT...");
      })
      .addCase(signOutUser.fulfilled, (state) => {
        state.authLoading = false;
        // console.log(action);
        toast.update(signOutToast, {
          render: "SIGNING OUT SUCCESSFUL!",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
      })
      .addCase(signOutUser.rejected, (state, action) => {
        state.authLoading = false;
        toast.update(signOutToast, {
          render:
            action.error.message
              ?.slice(action.error.message?.indexOf("/") + 1, -2)
              .replace(/-/gi, " ")
              .toUpperCase() + "!",
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      });
  },
});

export const { setUser } = authenticationSlice.actions;

export default authenticationSlice.reducer;
