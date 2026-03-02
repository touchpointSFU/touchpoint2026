declare module "*.frag" {
  const value: string;
  export default value;
}

declare module "*.vert" {
  const value: string;
  export default value;
}

declare module "resolve-lygia" {
  export function resolveLygia(shader: string): string;
}

declare module "*.svg?url" {
  const value: string;
  export default value;
}

declare module "*.svg" {
  import * as React from "react";
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}
