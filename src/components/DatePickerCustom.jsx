import { forwardRef, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiCalendar, BsChevronDown } from "../assets/icons";
import "./DatePickerCustom.scss";

const CustomInput = forwardRef(({ value, isOpen, onToggle }, ref) => (
  <button
    type="button"
    className="datepicker-trigger"
    onClick={onToggle}
    ref={ref}
  >
    <FiCalendar size={18} className="datepicker-icon" />
    <span className="datepicker-value">{value}</span>
    <BsChevronDown
      size={14}
      className={`datepicker-arrow ${isOpen ? "datepicker-arrow--open" : ""}`}
    />
  </button>
));

CustomInput.displayName = "CustomInput";

const DatePickerCustom = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const closedByOutsideClick = useRef(0);

  const handleToggle = () => {
    // If onClickOutside just fired (< 100ms ago), skip — it was the button click itself
    if (Date.now() - closedByOutsideClick.current < 100) return;
    setIsOpen((prev) => !prev);
  };

  const handleClickOutside = () => {
    closedByOutsideClick.current = Date.now();
    setIsOpen(false);
  };

  return (
    <div className="datepicker-custom">
      <DatePicker
        selected={value}
        onChange={(date) => {
          onChange(date);
          setIsOpen(false);
        }}
        dateFormat="dd.MM.yyyy"
        calendarStartDay={1}
        open={isOpen}
        onClickOutside={handleClickOutside}
        popperPlacement="bottom-end"
        customInput={<CustomInput isOpen={isOpen} onToggle={handleToggle} />}
      />
    </div>
  );
};

export default DatePickerCustom;
