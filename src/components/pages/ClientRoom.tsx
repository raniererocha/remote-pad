import { padTons } from "@/assets/constants";
import { cn } from "@/lib/utils";
import { Peer, DataConnection } from "peerjs";
import { ButtonHTMLAttributes, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import StatusIndicator from "../StatusIndicator";

export default function ClientRoom() {
    const params = useParams();
    const { room } = params as { room: string };
    const [, setMyPeer] = useState<Peer | null>(null);
    const [status, setStatus] = useState<{
        type: "connected" | "disconnected" | "waiting";
        message: string;
    }>({
        type: "disconnected",
        message: "",
    });
    const [myConnection, setMyConnection] = useState<DataConnection | null>(
        null
    );
    const [currentPad, setCurrentPad] = useState<number | null>(null);
    const checkIfPadIsClicked = (id: number) => {
        if (!currentPad) return false;
        return currentPad === id;
    };
    const inputVolumeRef = useRef<HTMLInputElement>(null);
    const handlePadClick = (pad: (typeof padTons)[0]) => {
        console.log("Cliquei");
        if (currentPad === pad.id) {
            setCurrentPad(() => null);
            const payload = { type: "player", data: null } as {
                type: "pad" | "player";
                data: {
                    id: number;
                    name: string;
                    file_id: string;
                } | null;
            };
            myConnection?.send(payload);
            return;
        }
        setCurrentPad(() => pad.id);
        const payload = { type: "pad", data: pad } as {
            type: "pad" | "player";
            data: {
                id: number;
                name: string;
                file_id: string;
            } | null;
        };
        myConnection?.send(payload);
        return;
    };
    const handleChangeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
        const volume = Number(e.currentTarget.value) / 100;
        myConnection?.send({ type: "player.volume", data: { volume } });
    };
    useEffect(() => {
        const initializePeer = async () => {
            const peer = new Peer();

            peer.on("open", (id) => {
                console.log(id);
                const connection = peer.connect(room);
                setMyConnection(connection);
                connection.on("open", () => {
                    console.log("Conexão aberta");
                    setStatus({
                        type: "connected",
                        message: "Conectado a sala: " + room,
                    });
                });

                connection.on("data", (data: unknown) => {
                    const resp = data as {
                        type: "player.play" | "player.pause" | "player.volume";
                        data: { id: number; volume: number | undefined };
                    };
                    if (resp.type === "player.pause") {
                        setCurrentPad(() => null);
                    } else if (resp.type === "player.volume") {
                        inputVolumeRef.current!.value = String(
                            resp.data.volume
                        );
                    } else {
                        setCurrentPad(() => resp.data.id);
                    }
                });
                connection.on("close", () => {
                    setStatus({
                        type: "disconnected",
                        message: "Conexão perdida, reestabelecendo conexão...",
                    });
                    setInterval(() => {
                        window.location.reload();
                    }, 3000);
                });
            });
            setMyPeer(peer);
        };
        initializePeer();
    }, []);
    return (
        <main className="w-screen h-screen p-10">
            <p className="text-center p-5 font-semibold">
                Room: <span className="font-normal italic">{room}</span>
            </p>
            {status.message && (
                <p className=" pb-5 ">
                    <StatusIndicator status={status} />
                </p>
            )}
            <section className="grid grid-cols-3 md:grid-cols-4 gap-2">
                {myConnection &&
                    padTons.map((pad) => (
                        <PadButton
                            key={pad.id}
                            pad={pad}
                            isClicked={checkIfPadIsClicked(pad.id)}
                            onClick={() => handlePadClick(pad)}
                        />
                    ))}
            </section>
            <section className="flex flex-col items-center">
                <h1>Controles do player</h1>
                <p>Volume</p>
                <div className="flex w-full gap-4">
                    <input
                        ref={inputVolumeRef}
                        className="flex-1"
                        type="range"
                        defaultValue={50}
                        min={0}
                        onChange={handleChangeVolume}
                    />
                </div>
            </section>
        </main>
    );
}

type PadButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    pad: (typeof padTons)[0];
    isClicked: boolean;
};

function PadButton({ pad, isClicked, ...props }: PadButtonProps) {
    return (
        <button
            {...props}
            className={cn(
                "w-full p-2 rounded",
                isClicked ? "bg-primary" : "bg-secondary"
            )}
        >
            {pad.name}
        </button>
    );
}
