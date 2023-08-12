import { useEffect, useState } from "react";
import Select from "react-select";

export type Options = {
  value: string;
  label: string;
};

interface MultiSelectProps {
  value: string[];
  onChange: (skill: string[]) => void;
  disable: boolean;
  options: Options[];
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  value,
  onChange,
  disable,
  options,
}) => {
  const formatedValue = options.filter((obj) => value.includes(obj.value));
  const [selected, setSelected] = useState<Options[]>(formatedValue);

  useEffect(() => {
    value = selected.map((select) => select.value);
    onChange(value);
  }, [selected]);

  return (
    <>
      <Select
        placeholder="Skill use.."
        isMulti
        options={options}
        value={selected}
        isDisabled={disable}
        onChange={(value) => setSelected(value as Options[])}
        noOptionsMessage={() => "Oops!! data tidak ditemukan."}
        formatOptionLabel={(option: any) => (
          <div className="flex flex-row items-center gap-3">
            <div className="text-xs">{option.label}</div>
          </div>
        )}
        classNames={{
          control: () => "border-1 p-1 dark:bg-background",
          input: () => "text-xs",
          option: () => "text-xs dark:bg-background dark:hover:bg-slate-800",
          placeholder: () => "text-sm",
          menu: () => "text-xs dark:bg-background border-[1px]",
        }}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            borderColor: state.isFocused ? "#47556920" : "##48566a20",
            padding: 2,
          }),
        }}
        theme={(theme) => ({
          ...theme,
          borderRadius: 4,
          colors: {
            ...theme.colors,
            primary: "#48566a",
            primary25: "#48566a10",
            primary50: "#48566a40",
          },
        })}
      />
    </>
  );
};
