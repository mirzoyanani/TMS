import React from "react";
import { statuses } from "../lib";
interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  styles: {
    [key: string]: string;
  };
}

const Select: React.FC<SelectProps> = ({ styles, value, onChange }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "done":
        return "rgba(0, 255, 0, 0.19)";
      case "in progress":
        return "rgba(255, 208, 0, 0.35)";
      case "todo":
        return "rgba(255, 0, 0, 0.1)";
      default:
        return "rgba(255, 0, 0, 0.1)";
    }
  };
  return (
    <select
      style={{ backgroundColor: getStatusColor(value) }}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={styles.status_select}
    >
      {statuses.map((item, id) => (
        <option key={id} className={styles.taskstatus} value={item}>
          {item}
        </option>
      ))}
    </select>
  );
};

export default Select;
