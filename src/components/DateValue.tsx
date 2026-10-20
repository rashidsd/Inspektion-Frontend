import dayjs from "dayjs";



function DateValue({ value }:any) {
  const d = dayjs(value);
  if (!value) return <span>{""}</span>;
  return <span>{d.isValid() ? d.format("DD-MM-YY") : ""}</span>;
}

export default DateValue;
