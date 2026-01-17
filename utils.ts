import { createDefine } from "fresh";

export interface State {
  title: string;
  /** API URL resolved per-request for timeline support */
  apiUrl: string;
}

export const define = createDefine<State>();
