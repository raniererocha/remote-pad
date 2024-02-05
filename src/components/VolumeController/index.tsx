import { forwardRef } from "react";

const VolumeController = forwardRef<
    HTMLInputElement,
    React.HTMLAttributes<HTMLInputElement>
>((props, ref) => {
    return (
        <>
            <p>Volume</p>
            <div className="flex w-full gap-4">
                <input
                    ref={ref}
                    className="flex-1"
                    type="range"
                    defaultValue={50}
                    min={0}
                    {...props}
                />
            </div>
        </>
    );
});

export default VolumeController;
