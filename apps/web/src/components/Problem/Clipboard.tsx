import { FC, useState } from "react";
import { ClipboardCopyIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

type ClipboardProps = {
  text: string;
  className?: string;
};

const Clipboard: FC<ClipboardProps> = ({ text, className }) => {
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (err: any) {
      console.error("Failed to copy: ", err.message);
    }
  };

  return (
    <>
      <button onClick={() => copyToClipboard(text)}>
        {showSuccess ? (
          <span>
            <CheckIcon
              className={cn(
                "w-7 h-7 absolute right-3 top-3 cursor-pointer text-green-600",
                className
              )}
            />
          </span>
        ) : (
          <span>
            <ClipboardCopyIcon
              className={cn(
                "w-6 h-6 absolute right-3 top-3 cursor-pointer",
                className
              )}
            />
          </span>
        )}
      </button>
    </>
  );
};

export default Clipboard;
