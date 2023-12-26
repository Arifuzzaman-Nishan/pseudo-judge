import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { codeSlice, useDispatch } from "@/lib/redux";
import { UploadIcon } from "@radix-ui/react-icons";

export enum CodeLang {
  CPP = "cpp",
  C = "c",
}

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
    <div>
      <label className="flex space-x-3 items-center p-2 bg-white text-blue-500 tracking-wide border cursor-pointer transition-colors duration-300 ease-in-out rounded-md hover:border-gray-300">
        <UploadIcon className="w-6 h-6" />
        <span className="leading-tight text-xs font-semibold">
          {file ? file.name : "Upload Code"}
        </span>
        <input type="file" className="hidden" onChange={handleFileChange} />
      </label>
    </div>
  );
};

const CodeLangSelect = () => {
  const dispatch = useDispatch();
  const handleChange = (value: string) => {
    dispatch(codeSlice.actions.setLang(value as CodeLang));
  };

  return (
    <Select onValueChange={handleChange} defaultValue={CodeLang.CPP}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a Language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={CodeLang.CPP}>C++</SelectItem>
        <SelectItem value={CodeLang.C}>C</SelectItem>
      </SelectContent>
    </Select>
  );
};

const CodeEditorHeader = () => {
  return (
    <>
      <section className="mb-5">
        <div className="flex items-center space-x-3">
          <CodeLangSelect />
          <CodeUpload />
        </div>
      </section>
    </>
  );
};

export default CodeEditorHeader;
