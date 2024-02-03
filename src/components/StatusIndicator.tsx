export default function StatusIndicator({
    status,
}: {
    status: { type: "connected" | "disconnected" | "waiting"; message: string };
}) {
    return (
        <div className="flex gap-2 justify-center items-center">
            <p className="text-center">{status.message}</p>
            <div
                className="size-3 bg-green-500 rounded-full m-0 p-0 data-[variant=disconnected]:bg-red-500 data-[variant=waiting]:bg-yellow-500 data-[variant=connected]:bg-green-500 data-[variant=disconnected]:"
                data-variant={status.type}
            ></div>
        </div>
    );
}
