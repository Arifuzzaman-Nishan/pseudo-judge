import { codeSlice, useDispatch } from "@/lib/redux";
import { useState } from "react";
import { UploadIcon } from "@radix-ui/react-icons";

const CodeUpload = () => {
  const [file, setFile] = useState<File | null>(null);

  const dispatch = useDispatch();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const code = e.target?.result;
        if (code) {
          dispatch(codeSlice.actions.setCodeStr(code.toString()));
        }
      };

      reader.readAsText(file);

      event.target.value = "";
    }
  };

  return (
    <div className="w-[180px]">
      <label className="flex space-x-3 items-center p-2 tracking-wide border cursor-pointer transition-colors duration-300 ease-in-out rounded-md hover:border-gray-400">
        <UploadIcon className="w-6 h-6" />
        <span className="text-xs font-semibold">
          {file ? file.name : "Upload Code"}
        </span>
        <input type="file" className="hidden" onChange={handleFileChange} />
      </label>
    </div>
  );
};

export default CodeUpload;
