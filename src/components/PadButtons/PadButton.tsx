import { padTons } from "@/assets/constants";
import Button from "../Button";
import { ButtonHTMLAttributes } from "react";

type PadButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    pad: (typeof padTons)[0];
    isClicked: boolean;
};

export function PadButton({ pad, isClicked, ...props }: PadButtonProps) {
    return (
        <Button variant={isClicked ? "primary" : "secondary"} {...props}>
            {pad.name}
        </Button>
    );
}
