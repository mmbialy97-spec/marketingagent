import { defineAgent } from "eve";

// Free-tier AI Gateway model with tool use. To upgrade later, swap for "anthropic/claude-sonnet-5.5"
// after adding paid AI Gateway credits.
export default defineAgent({
  model: "nvidia/nemotron-3.5-lightning-free",
});
