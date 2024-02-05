import { padTons } from "@/assets/constants";
import { render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, test } from "vitest";
import PadButtons from ".";

const PAD_ITENS: typeof padTons = [
    { id: 1, name: "C", file_id: "asdasdgdf" },
    { id: 2, name: "D", file_id: "gfdgdfasd" },
];
const CURRENT_PAD: number | null = 2;

describe("<PadButtons />", () => {
    test("Should render the pad buttons with correct name", async () => {
        const { getByText } = render(
            <PadButtons
                pads={PAD_ITENS}
                currentPad={CURRENT_PAD}
                handlePadClick={vi.fn()}
            />
        );

        const buttonC = getByText("C");
        const buttonD = getByText("D");
        expect(buttonC).toBeInTheDocument();
        expect(buttonD).toBeInTheDocument();
    });
    test("Should render the pad buttons with the correct amount", async () => {
        const { getAllByRole } = render(
            <PadButtons
                pads={PAD_ITENS}
                currentPad={CURRENT_PAD}
                handlePadClick={vi.fn()}
            />
        );
        const buttons = getAllByRole("button");
        expect(buttons).toHaveLength(2);
    });
    test("Should render not clicked button with the secondary variant", async () => {
        const { getByText } = render(
            <PadButtons
                pads={PAD_ITENS}
                currentPad={CURRENT_PAD}
                handlePadClick={vi.fn()}
            />
        );
        const buttonC = getByText("C");
        expect(buttonC).toHaveClass("bg-secondary");
    });
    test("Should render clicked button with the primary variant", async () => {
        const mockFn: {
            currentPad: number | null;
            onClick: (pad: (typeof padTons)[0]) => void;
        } = {
            currentPad: null,
            onClick: (pad: (typeof padTons)[0]) => (mockFn.currentPad = pad.id),
        };
        const spy = vi.spyOn(mockFn, "onClick");
        const { findByRole } = render(
            <PadButtons
                pads={PAD_ITENS}
                currentPad={mockFn.currentPad}
                handlePadClick={(pad) => mockFn.onClick(pad)}
            />
        );

        const buttonC = await findByRole("button", { name: "C" });
        await userEvent.click(buttonC);
        expect(spy).toHaveBeenCalled();
        expect(mockFn.currentPad).toBe(1);
    });
    test("Should render message when no pads are found", async () => {
        const { getByText } = render(
            <PadButtons
                pads={null}
                currentPad={CURRENT_PAD}
                handlePadClick={vi.fn()}
            />
        );
        const message = getByText("Nenhum pad encontrado");
        expect(message).toBeInTheDocument();
    });
});
