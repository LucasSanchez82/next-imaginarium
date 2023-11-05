"use client";
import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { registerSchema } from "@/lib/schemas/authSchemas";
import { registerType } from "@/lib/types/authTypes";
import { signIn } from "next-auth/react";
import React from "react";

const RegisterForm = () => {
  const {toast} = useToast();
  /*
      const res = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify(formValues),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const formValues: {
        name: string;
        email: string;
        password: string;
      }

  */
  const handleSubmit = async (formValues: registerType) => {
      const response = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify(formValues),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if(response.ok){
      signIn(undefined, {callbackUrl: '/'})
    }else{
      const res = await response.json();
      toast({
        variant: "destructive",
        title: "Impossible de creer le compte...",
        description: res.message,
      //   action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    }
  };

  return (
    <>
      <AutoForm formSchema={registerSchema} onSubmit={handleSubmit} fieldConfig={{
        password: {
          inputProps: {
            type: 'password'
          }
        }
      }}>
        <AutoFormSubmit>Creer un compte</AutoFormSubmit>
      </AutoForm>
    </>
  );
};

export default RegisterForm;
