# Source: https://betterstack.com/community/guides/scaling-nodejs/ory-kratos/
# Original language: typescript
# Normalized: ts
# Block index: 12

[label app/login/page.tsx]
import { Login, OryPage, OryPageProps } from "@ory/elements-react";
import { ory } from "@/app/ory";
import { AxiosError } from "axios";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const { searchParams } = new URL(
    "http://localhost:3000" + (arguments[0]?.searchParams?.return_to ?? "")
  );
  const returnTo = searchParams.get("return_to") ?? "";
  const flowId = searchParams.get("flow") ?? "";

  if (!flowId) {
    return redirect(ory.toLogin({ return_to: returnTo }));
  }

  let flow: LoginFlow | undefined;

  try {
    const { data } = await ory.getLoginFlow({ id: flowId });
    flow = data;
  } catch (error) {
    // Handle errors
  }

  return (
    <OryPage>
      <Login flow={flow} />
    </OryPage>
  );
}