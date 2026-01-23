"use client"

import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupButton } from "@/components/ui/input-group";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { ComponentProps, forwardRef, useState } from "react";



const PasswordInput = forwardRef<HTMLInputElement, ComponentProps<typeof Input>>(
  ({ ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleVisibility = () => {
      setShowPassword(curr => !curr);
    };

    return (
      <InputGroup>
        <Input
          ref={ref}
          type={showPassword ? "text" : "password"}
          {...props}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            variant="ghost"
            size="icon-xs"
            type="button"
            onClick={toggleVisibility}
            aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          >
            {showPassword ? (
              <EyeOffIcon className="size-4" />
            ) : (
              <EyeIcon className="size-4" />
            )}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
