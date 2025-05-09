import React from "react";

const NumberInput = ({
  value,
  onChange,
  label,
  placeholder = "",
  suffix,
  allowDecimals = true,
  className = "",
  inputProps = {},
  hideArrows = false,
}) => {
  const handleChange = (e) => {
    let newValue = e.target.value;

    if (allowDecimals) {
      if (!/^-?\d*\.?\d*$/.test(newValue) && newValue !== "") return;
    } else {
      if (!/^-?\d*$/.test(newValue) && newValue !== "") return;
    }

    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      {label && (
        <h3 className="font-telegraf text-twilight font-bold">{label}</h3>
      )}
      <div
        className={`flex items-center justify-between rounded-[13px] border border-twilight bg-backg ${className}`}
      >
        <input
          type={hideArrows ? "text" : "number"}
          inputMode="decimal"
          value={value}
          onChange={handleChange}
          step={allowDecimals ? "0.01" : "1"}
          placeholder={placeholder}
          className="w-full bg-transparent text-twilight outline-none px-4 py-3 lg:py-2"
          {...inputProps}
        />
        {suffix && <span className="text-twilight pr-3">{suffix}</span>}
      </div>
    </div>
  );
};

export default NumberInput;
