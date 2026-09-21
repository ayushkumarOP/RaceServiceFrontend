import type { MouseEvent } from "react";

export function navigateTo(destination: string) {
  window.history.pushState({}, "", destination);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export function followInternalLink(event: MouseEvent<HTMLAnchorElement>, destination: string) {
  event.preventDefault();
  navigateTo(destination);
}
