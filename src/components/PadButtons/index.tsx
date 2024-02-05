import { padTons } from "@/assets/constants";
import { PadButton } from "./PadButton";

export default function PadButtons({
    pads,
    handlePadClick,
    currentPad,
}: {
    pads: typeof padTons | null;
    handlePadClick: (pad: (typeof padTons)[0]) => void;
    currentPad: number | null;
}) {
    if (!pads || pads.length === 0) {
        return (
            <section className="w-full h-full flex justify-center items-center">
                <p>Nenhum pad encontrado</p>
            </section>
        );
    }
    return (
        <section className="grid grid-cols-3 md:grid-cols-4 gap-2">
            {pads.map((pad) => (
                <PadButton
                    key={pad.id}
                    pad={pad}
                    isClicked={pad.id === currentPad}
                    onClick={() => handlePadClick(pad)}
                />
            ))}
        </section>
    );
}
