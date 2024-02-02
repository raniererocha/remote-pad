/* eslint-disable @typescript-eslint/no-unused-vars */
import { Peer, DataConnection } from "peerjs";
import { useEffect, useRef, useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import QRCode from "react-qr-code";
import { generateRandomId } from "@/assets/generateRandomId";
import "../AudioPlayerComponent/style.css";
import H5AudioPlayer from "react-h5-audio-player";

export default function HostRoom() {
    const playerRef = useRef<H5AudioPlayer>(null);
    const [, setMyPeer] = useState<Peer | null>(null);
    const [myConnection, setMyConnection] = useState<DataConnection | null>();
    const [pad, setPad] = useState<{
        id: number;
        name: string;
        file_id: string;
    } | null>(null);

    const [statusMessage, setStatusMessage] = useState("");
    const [qrCode, setQrCode] = useState("");

    useEffect(() => {
        const initializePeer = async () => {
            const id = generateRandomId();
            const peer = new Peer(id); // Use the default PeerJS server

            peer.on("open", (id) => {
                console.log("Receiver ID:", id);
                setStatusMessage(
                    "Conexão aberta, aguardando conexão do controlador"
                );
                setQrCode(window.location.origin + "/connect/" + id);
                /* setQrCode("http://192.168.0.8:5173" + "/connect/" + id); */
            });

            // Listen for connections
            peer.on("connection", (connection: DataConnection) => {
                setStatusMessage(
                    "Conexão encontrada, aguardando estabeler conexão"
                );
                connection.on("open", () => {
                    setStatusMessage(
                        "Conexão estabelecida, aguardando envio de dados do controlador:"
                    );
                    setQrCode("");
                    setMyConnection(connection);
                });

                connection.on("data", (data: unknown) => {
                    const resp = data as {
                        type: "pad" | "player" | "player.volume";
                        data: {
                            id: number;
                            name: string;
                            file_id: string;
                            volume: number | undefined;
                        } | null;
                    };
                    switch (resp.type) {
                        case "pad":
                            setStatusMessage(
                                `Pad recebido: ${resp.data?.name}`
                            );
                            setPad(resp.data);
                            playerRef.current?.audio.current?.play();

                            setStatusMessage(
                                `Tocando o pad em ${resp.data?.name}!`
                            );
                            break;
                        case "player":
                            console.log("player: ", playerRef.current);
                            playerRef.current?.audio.current?.pause();
                            break;
                        case "player.volume":
                            playerRef.current!.audio.current!.volume =
                                resp.data?.volume ||
                                playerRef.current!.audio.current!.volume;
                    }
                });
            });

            setMyPeer(peer);
        };

        initializePeer();
    }, []);

    return (
        <main className="w-screen h-screen flex flex-col py-10">
            {statusMessage && (
                <p className="text-center font-semibold">
                    Status:{" "}
                    <span className="font-normal italic">{statusMessage}</span>
                </p>
            )}
            {qrCode && (
                <>
                    <div className="bg-white p-4 w-fit m-auto">
                        <QRCode value={qrCode} />
                    </div>
                    <p className="text-center font-semibold p-2 bg-primary-foreground w-fit my-5 rounded mx-auto">
                        {qrCode}
                    </p>
                </>
            )}
            {pad && (
                <div className="px-6 py-2">
                    <AudioPlayer
                        ref={playerRef}
                        autoPlay
                        volume={0.5}
                        onVolumeChange={() => {
                            const volume =
                                playerRef.current?.audio.current?.volume;
                            myConnection?.send({
                                type: "player.volume",
                                data: { volume: Number(volume) * 100 },
                            });
                        }}
                        onPlay={() => {
                            setStatusMessage(
                                () => `Tocando pad em ${pad.name}!`
                            );
                            myConnection?.send({
                                type: "player.play",
                                data: { id: pad.id },
                            });
                        }}
                        onPause={() => {
                            setStatusMessage(
                                () => `Pad em ${pad.name} pausado!`
                            );
                            myConnection?.send({
                                type: "player.pause",
                                data: null,
                            });
                        }}
                        src={pad.file_id}
                    />
                </div>
            )}
        </main>
    );
}
