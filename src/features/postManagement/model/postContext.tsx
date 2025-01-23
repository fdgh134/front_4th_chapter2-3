import React, { createContext, useContext, useReducer, ReactNode } from "react";

interface PostState {
  posts: any[];
  total: number;
  loading: boolean;
  selectedPost: any | null;
  selectedUser: any | null;
  comments: Record<number, any[]>;
  searchQuery: string;
  selectedTag: string;
  skip: number;
  limit: number;
}

type PostAction = 
  | { type: "SET_POSTS"; payload: any[] }
  | { type: "SET_TOTAL"; payload: number }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_SELECTED_POST"; payload: any | null }
  | { type: "SET_SELECTED_USER"; payload: any | null }
  | { type: "SET_COMMENTS"; payload: { postId: number; comments: any[] } }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "SET_SELECTED_TAG"; payload: string }
  | { type: "SET_SKIP"; payload: number }
  | { type: "SET_LIMIT"; payload: number };

const initialState: PostState = {
  posts: [],
  total: 0,
  loading: false,
  selectedPost: null,
  selectedUser: null,
  comments: {},
  searchQuery: "",
  selectedTag: "",
  skip: 0,
  limit: 10
};

const postReducer = (state: PostState, action: PostAction): PostState => {
  switch (action.type) {
    case "SET_POSTS":
      return { ...state, posts: action.payload };
    case "SET_TOTAL":
      return { ...state, total: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_SELECTED_POST":
      return { ...state, selectedPost: action.payload };
    case "SET_SELECTED_USER":
      return { ...state, selectedUser: action.payload };
    case "SET_COMMENTS":
      return { 
        ...state, 
        comments: { 
          ...state.comments, 
          [action.payload.postId]: action.payload.comments 
        } 
      };
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload };
    case "SET_SELECTED_TAG":
      return { ...state, selectedTag: action.payload };
    case "SET_SKIP":
      return { ...state, skip: action.payload };
    case "SET_LIMIT":
      return { ...state, limit: action.payload };
    default:
      return state;
  }
};

const PostContext = createContext<{
  state: PostState;
  dispatch: React.Dispatch<PostAction>;
}>({
  state: initialState,
  dispatch: () => null
});

export const PostProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(postReducer, initialState);

  return (
    <PostContext.Provider value={{ state, dispatch }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePostContext = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePostContext must be used within a PostProvider");
  }
  return context;
};
