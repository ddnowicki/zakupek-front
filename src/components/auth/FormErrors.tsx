import { AlertTriangle } from "lucide-react";

interface FormErrorsProps {
  errors: string[];
}

export function FormErrors({ errors }: FormErrorsProps) {
  if (!errors?.length) return null;

  return (
    <div className="bg-destructive/15 text-destructive rounded-md p-3 mb-4" role="alert" aria-live="polite">
      <div className="flex gap-2">
        <AlertTriangle className="size-5 shrink-0 mt-0.5" />
        <div className="text-sm">
          {errors.length === 1 ? (
            <p>{errors[0]}</p>
          ) : (
            <ul className="list-disc pl-4">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default FormErrors;
