import type CspDev from "csp-dev";

export function ozone(): CspDev.DirectiveDescriptor {
  return {
    "connect-src": ["api.testnet.ozonescan.org", "*.api.testnet.ozonescan.org"],
  };
}
