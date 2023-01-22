import {css} from "catom";
import {register} from "~/handlers/auth";
import {useCancellableControllerRef} from "~/hooks/use-cancellable-controller";
import {useLogin} from "~/hooks/use-login";
import {User} from "~/types/user";

import {A, redirect, useState} from "@hydrophobefireman/ui-lib";
import {useAlerts} from "@kit/alerts";
import {TextButton} from "@kit/button";
import {Box} from "@kit/container";

import {Form} from "../Form";
import {ThemeInput} from "../ThemeInput";

export function Register() {
  const [email, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [formState, setFormState] = useState<"idle" | "pending" | "registered">(
    "idle"
  );

  const ctrl = useCancellableControllerRef();
  const {persist} = useAlerts();
  async function handleRegister() {
    if (formState === "pending") return;
    setFormState("pending");
    const res = register(email, name, password);
    ctrl.current = res.controller;
    const {error} = await res.result;
    if (error) {
      setFormState("idle");
      return persist({
        content: error,
        cancelText: "Okay",
        actionText: "retry",

        type: "error",
        onActionClick() {
          handleRegister();
        },
      });
    }
    setFormState("registered");
    persist({
      content: "Account created!",
      type: "success",
      onActionClick: () => redirect("/"),
      actionText: "Login",
    });
  }

  return (
    <>
      <Form onSubmit={handleRegister}>
        <Box>
          <ThemeInput required value={name} setValue={setName} label="name" />
          <ThemeInput
            required
            value={email}
            setValue={setUsername}
            label="email"
          />

          <ThemeInput
            required
            value={password}
            setValue={setPassword}
            type="password"
            label="password"
          />
          <div
            class={css({
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              flex: 1,
            })}
          >
            <TextButton
              class={css({
                width: "100%",
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              })}
              disabled={formState === "pending"}
              mode="secondary"
              variant="shadow"
            >
              Submit
            </TextButton>
          </div>
        </Box>
        <Box horizontal="center" class={css({marginTop: "2rem"})}>
          Already have an account?{" "}
          <A class={css({textDecoration: "underline"})} href="/auth?mode=login">
            Login
          </A>
        </Box>
      </Form>
    </>
  );
}
