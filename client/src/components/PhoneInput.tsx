import React from "react";

interface PhoneInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({ value, onChange, ...props }) => {
  // Handler to allow only digits and max 10 characters
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, ""); // Remove non-digits
    if (val.length > 10) val = val.slice(0, 10);
    onChange({ ...e, target: { ...e.target, value: val } });
  };
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center select-none">
        <span className="mr-1" style={{ display: 'flex', alignItems: 'center' }}>
          {/* Bangladesh flag SVG */}
          <svg
            role="img"
            aria-label="Bangladesh flag"
            width="24"
            height="16"
            viewBox="0 0 24 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="24" height="16" rx="2" fill="#006A4E"/>
            <circle cx="10" cy="8" r="5" fill="#F42A41"/>
          </svg>
        </span>
        <span className="text-gray-700 font-medium text-base">+880</span>
        <span className="h-6 w-px bg-gray-300 mx-2" />
      </span>
      <input
        type="tel"
        className="pl-28 pr-4 py-3 h-10 w-full rounded-md border border-facebook-border bg-facebook-gray text-base text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-facebook-blue focus:border-transparent outline-none transition disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="1xxxxxxxxx"
        value={value}
        onChange={handleChange}
        maxLength={10}
        inputMode="numeric"
        pattern="[0-9]*"
        {...props}
        style={{ minWidth: 0 }}
      />
    </div>
  );
}; 