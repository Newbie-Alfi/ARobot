import { useEffect, useState } from "react";
import { Select, SelectProps } from "antd";
import { instrumentAPI } from "./api";

interface IInstrumentSelectProps
  extends Pick<SelectProps, "style" | "className"> {
  value: string[];
  onChange(v: string[]): void;
}

export const InstrumentSelect = ({
  value = [],
  onChange,
  ...props
}: IInstrumentSelectProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [, setError] = useState<string>();
  const [instruments, setInstruments] = useState<IInstrument[]>([]);

  const fetchInstruments = async () => {
    try {
      setIsLoading(true);

      const response = await instrumentAPI.get();

      setInstruments(response.data);
    } catch (e) {
      setError("Ошибка получения инструментов");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInstruments();
  }, []);

  return (
    <Select
      // TODO
      {...props}
      placeholder="Инструмент"
      showSearch
      value={value}
      filterOption={(input, option) =>
        (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
      }
      mode="multiple"
      loading={isLoading}
      options={instruments.map((v) => ({
        key: v.figi,
        value: v.figi,
        label: v.description,
      }))}
      onChange={(v: string[]) => {
        onChange(v);
      }}
    ></Select>
  );
};
