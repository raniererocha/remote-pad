import { render } from "@testing-library/react";
import { describe, test } from "vitest";
import Button from ".";

const BUTTON_VARIANTS = {
    primary: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    danger: "bg-red-500 text-white",
    outline: "border border-primary text-primary",
    link: "border-none text-primary underline hover:no-underline",
};
const BUTTON_NAME = "teste";

describe("<Button />", () => {
    test("Should render a button", async () => {
        const { findByRole } = render(<Button>{BUTTON_NAME}</Button>);
        const button = await findByRole("button");

        expect(button).toBeInTheDocument();
    });
    test("Should render a button with text", async () => {
        const { findByText } = render(<Button>{BUTTON_NAME}</Button>);
        const text = await findByText(BUTTON_NAME);

        expect(text).toBeInTheDocument();
    });
    test("Should render a button with the primary variant", async () => {
        const { findByRole } = render(
            <Button variant="primary">{BUTTON_NAME}</Button>
        );
        const button = await findByRole("button");

        expect(button).toHaveClass(BUTTON_VARIANTS.primary);
    });
    test("Should render a button with the secondary variant", async () => {
        const { findByRole } = render(
            <Button variant="secondary">{BUTTON_NAME}</Button>
        );
        const button = await findByRole("button");

        expect(button).toHaveClass(BUTTON_VARIANTS.secondary);
    });
    test("Should render a button with the danger variant", async () => {
        const { findByRole } = render(
            <Button variant="danger">{BUTTON_NAME}</Button>
        );
        const button = await findByRole("button");

        expect(button).toHaveClass(BUTTON_VARIANTS.danger);
    });
    test("Should render a button with the outline variant", async () => {
        const { findByRole } = render(
            <Button variant="outline">{BUTTON_NAME}</Button>
        );
        const button = await findByRole("button");

        expect(button).toHaveClass(BUTTON_VARIANTS.outline);
    });
    test("Should render a button with the link variant", async () => {
        const { findByRole } = render(
            <Button variant="link">{BUTTON_NAME}</Button>
        );
        const button = await findByRole("button");

        expect(button).toHaveClass(BUTTON_VARIANTS.link);
    });
    test("Should render a button with the primary variant by default", async () => {
        const { findByRole } = render(<Button>{BUTTON_NAME}</Button>);
        const button = await findByRole("button");

        expect(button).toHaveClass(BUTTON_VARIANTS.primary);
    });
    test("Should call the onClick function when clicked", async () => {
        const func = {
            onClick: vi.fn(),
        };
        const spy = vi.spyOn(func, "onClick");
        const { findByRole } = render(
            <Button onClick={func.onClick}>{BUTTON_NAME}</Button>
        );
        const button = await findByRole("button");

        button.click();
        expect(spy).toHaveBeenCalled();
    });
});
