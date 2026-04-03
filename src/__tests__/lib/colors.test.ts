import { generateProfileGradient } from "@/lib/colors";

describe("generateProfileGradient", () => {
  it("returns a valid CSS gradient string", () => {
    const result = generateProfileGradient("cafe42");
    expect(result).toMatch(/^linear-gradient\(/);
  });

  it("returns consistent gradient for same username", () => {
    const a = generateProfileGradient("cafe42");
    const b = generateProfileGradient("cafe42");
    expect(a).toBe(b);
  });

  it("returns different gradients for different usernames", () => {
    const a = generateProfileGradient("cafe42");
    const b = generateProfileGradient("lunanails");
    expect(a).not.toBe(b);
  });
});
