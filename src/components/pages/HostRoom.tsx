/* eslint-disable @typescript-eslint/no-unused-vars */
import { Peer, DataConnection } from "peerjs";
import { useEffect, useRef, useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import QRCode from "react-qr-code";
import "../AudioPlayerComponent/style.css";
import H5AudioPlayer from "react-h5-audio-player";
import { useParams } from "react-router-dom";
import StatusIndicator from "../StatusIndicator";
import { padTons } from "@/assets/constants";

export default function HostRoom() {
    const playerRef = useRef<H5AudioPlayer>(null);
    const [, setMyPeer] = useState<Peer | null>(null);
    const [myConnection, setMyConnection] = useState<DataConnection | null>();
    const [pad, setPad] = useState<{
        id: number;
        name: string;
        file_id: string;
    } | null>(null);
    const [status, setStatus] = useState<{
        type: "connected" | "disconnected" | "waiting";
        message: string;
    }>({ type: "disconnected", message: "" });
    const [qrCode, setQrCode] = useState("");
    const { roomId } = useParams<{ roomId: string }>();

    useEffect(() => {
        const initializePeer = async () => {
            const peer = new Peer(roomId!); // Use the default PeerJS server

            peer.on("open", (id) => {
                setStatus({
                    type: "waiting",
                    message:
                        "Conexão aberta, aguardando conexão do controlador",
                });
                setQrCode(window.location.origin + "/connect/" + id);
            });

            // Listen for connections
            peer.on("connection", (connection: DataConnection) => {
                setStatus({
                    type: "waiting",
                    message: "Conexão encontrada, aguardando estabeler conexão",
                });
                connection.on("open", () => {
                    playerRef.current?.audio.current?.src &&
                        connection.send({
                            type: "player.play",
                            data: {
                                id: padTons.filter(
                                    (pad) =>
                                        pad.file_id ===
                                        playerRef.current?.audio.current?.src
                                )[0].id,
                            },
                        });

                    connection.send({
                        type: "player.volume",
                        data: {
                            volume:
                                Number(
                                    playerRef.current?.audio.current?.volume
                                ) * 100 || 50,
                        },
                    });

                    setStatus({
                        type: "connected",
                        message:
                            "Conexão estabelecida, aguardando envio de dados do controlador",
                    });

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
                            setStatus({
                                type: "connected",
                                message: `Pad recebido: ${resp.data?.name}`,
                            });
                            setPad(resp.data);

                            playerRef.current?.audio.current?.play();

                            setStatus({
                                type: "connected",
                                message: `Tocando o pad em ${resp.data?.name}!`,
                            });
                            break;
                        case "player":
                            playerRef.current?.audio.current?.pause();

                            break;
                        case "player.volume":
                            playerRef.current!.audio.current!.volume =
                                resp.data?.volume ||
                                playerRef.current!.audio.current!.volume;
                    }
                });
                connection.on("close", () => {
                    setStatus({
                        type: "disconnected",
                        message: "Conexão perdida!",
                    });
                });
            });
            setMyPeer(peer);
        };

        initializePeer();
    }, [roomId]);

    return (
        <main className="w-screen h-screen flex flex-col py-10">
            {status.message && <StatusIndicator status={status} />}
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
                        autoPlay={true}
                        loop={true}
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
                            setStatus(() => ({
                                type: "connected",
                                message: `Tocando pad em ${pad.name}!`,
                            }));

                            myConnection?.send({
                                type: "player.play",
                                data: { id: pad.id },
                            });
                        }}
                        onPause={() => {
                            setStatus(() => ({
                                type: "connected",
                                message: `Pad em ${pad.name} pausado!`,
                            }));

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
