import { padTons } from "@/assets/constants";
import { cn } from "@/lib/utils";
import { Peer, DataConnection } from "peerjs";
import { ButtonHTMLAttributes, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ClientRoom() {
    const params = useParams();
    const { room } = params as { room: string };
    const [, setMyPeer] = useState<Peer | null>(null);
    const [myConnection, setMyConnection] = useState<DataConnection | null>(
        null
    );
    const [currentPad, setCurrentPad] = useState<number | null>(null);
    const checkIfPadIsClicked = (id: number) => {
        if (!currentPad) return false;
        return currentPad === id;
    };
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
    useEffect(() => {
        const initializePeer = async () => {
            const peer = new Peer();

            peer.on("open", (id) => {
                console.log(id);
                const connection = peer.connect(room);
                /* peer.on('connection', conn => {
                    conn.on('open', () => {
                        console.log('conexão estabelecida com a sala')
                    })
                    conn.on('data', data => {})
                }) */
                setMyConnection(connection);
                connection.on("open", () => {
                    console.log("Conexão aberta");
                });

                connection.on("data", (data: unknown) => {
                    const resp = data as {
                        type: "player.play" | "player.pause";
                        data: { id: number };
                    };
                    if (resp.type === "player.pause") {
                        setCurrentPad(() => null);
                    } else {
                        setCurrentPad(() => resp.data.id);
                    }
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
