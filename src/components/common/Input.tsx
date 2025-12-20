interface InputFieldProps {
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  Icon,
  type,
  placeholder,
  value,
  onChange,
  required = false,
}) => (
  <div className="relative">
    <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
    <input
      type={type}
      placeholder={placeholder}
      required={required}
      className="block w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-[#E91E63] text-slate-700 font-medium placeholder-slate-400 transition-shadow duration-200"
      value={value}
      onChange={onChange}
    />
  </div>
);
export default InputField;
