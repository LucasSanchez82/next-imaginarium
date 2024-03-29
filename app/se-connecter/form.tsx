"use client";
import { SubmitButton } from "@/components/submitButton";
import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import { useToast } from "@/components/ui/use-toast";
import { loginSchema } from "@/lib/schemas/authSchemas";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";

const LoginForm = () => {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (formValues: z.infer<typeof loginSchema>) => {
    const callbackUrl = searchParams.get("callbackUrl") || "/profile"; // prend la route existante et rajoute /profile
    const res = await signIn("credentials", {
      redirect: false,
      email: formValues.email,
      password: formValues.password,
      callbackUrl,
    });
    if (res?.error) {
      toast({
        variant: "destructive",
        title: "Erreur lors de la connection.",
        description: "mot de passe ou email non correct.",
        //   action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    } else {
      router.push(callbackUrl);
    }
  };
  return (
    <AutoForm
      formSchema={loginSchema}
      parsedAction={handleSubmit}
      fieldConfig={{
        password: {
          inputProps: {
            type: "password",
          },
        },
      }}
    >
      <SubmitButton>Se connecter</SubmitButton>
    </AutoForm>
  );
};

export default LoginForm;
