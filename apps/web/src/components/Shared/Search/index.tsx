import { Input } from "@/components/ui/input";
import React, { FC } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import useDebounce from "@/hooks/useDebounce";

type SearchProps = {
  placeholder: string;
  value?: string;
  setValue?: React.Dispatch<React.SetStateAction<string>>;
};

const Search: FC<SearchProps> = ({ placeholder, value, setValue }) => {
  const [tempValue, setTempValue] = React.useState<string>("");
  const debounce = useDebounce((value) => {
    if (setValue) {
      setValue(value);
    }
  }, 1000);

  return (
    <>
      <div className="max-w-xs relative">
        <div className="absolute top-0 bottom-0 w-5 h-5 my-auto  left-3">
          <MagnifyingGlassIcon className="w-full" />
        </div>
        <Input
          onChange={(e) => {
            setTempValue(e.target.value);
            debounce(e.target.value);
          }}
          value={tempValue}
          className="w-full pl-12 pr-4"
          placeholder={placeholder}
          type="search"
        />
      </div>
    </>
  );
};

export default Search;
