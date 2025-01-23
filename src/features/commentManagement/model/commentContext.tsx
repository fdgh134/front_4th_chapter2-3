import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { Comment } from "../../../entities/types";

interface CommentState {
  commentsByPostId: Record<number, Comment[]>;
  loading: boolean;
  total: number;
  selectedComment: Comment | null;
}

type CommentAction = 
  | { type: "SET_COMMENTS"; payload: { postId: number; comments: Comment[] } }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_TOTAL"; payload: number }
  | { type: "SET_SELECTED_COMMENT"; payload: Comment | null };

const initialState: CommentState = {
  commentsByPostId: {},
  loading: false,
  total: 0,
  selectedComment: null
};

const commentReducer = (state: CommentState, action: CommentAction): CommentState => {
  switch (action.type) {
    case "SET_COMMENTS":
      return { 
        ...state, 
        commentsByPostId: {
          ...state.commentsByPostId,
          [action.payload.postId]: action.payload.comments
        }
      };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_TOTAL":
      return { ...state, total: action.payload };
    case "SET_SELECTED_COMMENT":
      return { ...state, selectedComment: action.payload };
    default:
      return state;
  }
};

const CommentContext = createContext<{
  state: CommentState;
  dispatch: React.Dispatch<CommentAction>;
}>({
  state: initialState,
  dispatch: () => null
});

export const CommentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(commentReducer, initialState);

  return (
    <CommentContext.Provider value={{ state, dispatch }}>
      {children}
    </CommentContext.Provider>
  );
};

export const useCommentContext = () => {
  const context = useContext(CommentContext);
  if (!context) {
    throw new Error("useCommentContext must be used within a CommentProvider");
  }
  return context;
};