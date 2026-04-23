declare module "@builder.io/partytown/react" {
  import type { ComponentType, ScriptHTMLAttributes } from "react";

  export type PartytownProps = ScriptHTMLAttributes<HTMLScriptElement> & {
    debug?: boolean;
    forward?: string[];
    lib?: string;
  };

  export const Partytown: ComponentType<PartytownProps>;
}
