import { padTons } from "@/assets/constants";
import { Peer, DataConnection } from "peerjs";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import StatusIndicator from "../StatusIndicator";
import PadButtons from "../PadButtons";
import VolumeController from "../VolumeController";

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
    const [isLoading, setIsLoading] = useState(true);

    const inputVolumeRef = useRef<HTMLInputElement>(null);
    const handlePadClick = (pad: (typeof padTons)[0]) => {
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

            peer.on("open", () => {
                const connection = peer.connect(room);
                setMyConnection(connection);
                connection.on("open", () => {
                    setStatus({
                        type: "connected",
                        message: "Conectado a sala: " + room,
                    });
                    setIsLoading(false);
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
                            resp.data.volume!
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
    }, [room]);
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
            {!isLoading ? (
                <>
                    <PadButtons
                        pads={padTons}
                        currentPad={currentPad}
                        handlePadClick={handlePadClick}
                    />
                    <section className="flex flex-col items-center">
                        <h1>Controles do player</h1>
                        <VolumeController
                            ref={inputVolumeRef}
                            onChange={handleChangeVolume}
                        />
                    </section>
                </>
            ) : (
                <section className="w-full text-center">
                    <p className="animate-pulse font-bold text-2xl">
                        Carregando sala...
                    </p>
                </section>
            )}
        </main>
    );
}
