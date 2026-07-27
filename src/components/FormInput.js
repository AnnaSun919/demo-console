import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const FormInput = ({ label, error, className = "", ...props }) => (
  <div className="space-y-1">
    {label && <Label htmlFor={props.id}>{label}</Label>}
    <Input
      className={`${error ? "border-red-500 focus-visible:ring-red-500" : ""} ${className}`}
      {...props}
    />
    {error && typeof error === "string" && (
      <p className="text-sm text-red-500">{error}</p>
    )}
  </div>
);

export default FormInput;