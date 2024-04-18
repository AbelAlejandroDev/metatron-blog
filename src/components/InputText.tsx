import { InputProps } from "./Input";

export default function InputText(props: InputProps) {
  return (
    <div className="flex flex-col">
      {props.label && (
        <label htmlFor={props.label} className="text-white">
          {props.label}
        </label>
      )}
      <input
        id={props.id ?? props.label?.toLowerCase()}
        value={props.value}
        className="p-1 rounded outline-none mt-0 shadow text-black"
        name={props.name ?? props.label?.toLowerCase()}
        defaultValue={props.defaultValue}
        disabled={props.disabled}
        type={props.type}
        aria-invalid={!!props.error}
        {...props.register(props.name ?? props.label?.toLowerCase(), {
          required: props.required,
          pattern: props.pattern,
          minLength: props.minLength,
          min: props.min,
          maxLength: props.maxLength,
          max: props.max,
          validate: props.validate,
        })}
      />
      {props?.error?.message && (
        <p role="alert" className="text-red-400">
          {props.error.message}
        </p>
      )}
    </div>
  );
}
