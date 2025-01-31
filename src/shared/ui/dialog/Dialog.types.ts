import * as DialogPrimitive from "@radix-ui/react-dialog";

export interface DialogProps extends DialogPrimitive.DialogProps {}

export interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export interface DialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string;
}