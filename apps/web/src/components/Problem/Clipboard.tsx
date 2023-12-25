import { useState } from "react";
import { ClipboardCopyIcon, CheckIcon } from "@radix-ui/react-icons";

const Clipboard = ({ text }: { text: string }) => {
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
            <CheckIcon className="w-7 h-7 absolute right-3 top-3 cursor-pointer text-green-600" />
          </span>
        ) : (
          <span>
            <ClipboardCopyIcon className="w-6 h-6 absolute right-3 top-3 cursor-pointer" />
          </span>
        )}
      </button>
    </>
  );
};

export default Clipboard;
