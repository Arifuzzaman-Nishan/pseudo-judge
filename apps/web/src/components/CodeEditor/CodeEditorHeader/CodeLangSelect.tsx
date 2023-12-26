import { codeSlice, useDispatch } from "@/lib/redux";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export enum CodeLang {
  CPP = "cpp",
  C = "c",
}

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

export default CodeLangSelect;
