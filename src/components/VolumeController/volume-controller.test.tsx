import { describe, test } from "vitest";
import { render } from "@testing-library/react";
import VolumeController from ".";

describe("<VolumeController />", () => {
    test("Shold render the volume controller", async () => {
        const { getByRole } = render(<VolumeController />);

        const input = getByRole("slider");
        expect(input).toBeInTheDocument();
    });
    test("Shold render the volume controller with a default value", async () => {
        const { getByRole } = render(<VolumeController />);

        const input = getByRole("slider") as HTMLInputElement;
        expect(input.value).toBe("50");
    });
    test("Shold render the volume controller with a custom value", async () => {
        const { getByRole } = render(<VolumeController defaultValue={75} />);

        const input = getByRole("slider") as HTMLInputElement;
        expect(input.value).toBe("75");
    });
    test("Shold change the volume value when the input changes", async () => {
        const { getByRole } = render(<VolumeController />);

        const input = getByRole("slider") as HTMLInputElement;
        input.value = "75";
        expect(input.value).toBe("75");
    });
});
