import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { User } from "../../../entities/types";

interface UserState {
  users: User[];
  total: number;
  loading: boolean;
  selectedUser: User | null;
}

type UserAction = 
  | { type: "SET_USERS"; payload: User[] }
  | { type: "SET_TOTAL"; payload: number }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_SELECTED_USER"; payload: User | null };

const initialState: UserState = {
  users: [],
  total: 0,
  loading: false,
  selectedUser: null
};

const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case "SET_USERS":
      return { ...state, users: action.payload };
    case "SET_TOTAL":
      return { ...state, total: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_SELECTED_USER":
      return { ...state, selectedUser: action.payload };
    default:
      return state;
  }
};

const UserContext = createContext<{
  state: UserState;
  dispatch: React.Dispatch<UserAction>;
}>({
  state: initialState,
  dispatch: () => null
});

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};