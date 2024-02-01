import { Peer, DataConnection } from "peerjs";
import { useEffect, useState } from "react";

interface ConfigurationInterface {
    id: string;
    type: "host" | "connect";
}

// create a function to generate 6 digit random characteres
export default function usePeer(config: ConfigurationInterface) {
    const { id, type } = config;
    const [myPeer, setMyPeer] = useState<Peer | null>(null);
    const [myConnection, setMyConnection] = useState<DataConnection | null>(
        null
    );
    useEffect(() => {
        async function initializePeer() {
            if (type === "host") {
                const peerId = id;
                const peer = new Peer(peerId);
                setMyPeer(peer);
                peer.on("open", (id) => {
                    console.log("Receiver id: ", id);
                });
                peer.on("connection", (conn) => {
                    console.log("Connection incoming: ");

                    conn.on("open", () => {
                        console.log("Connection open");
                    });
                    conn.on("data", (data) => {
                        console.log("Received Data: ", data);
                    });
                });
                return;
            } else {
                const peer = new Peer();
                setMyPeer(peer);
                const connection = peer.connect(id);
                setMyConnection(connection);
                return;
            }
        }
        initializePeer();
    }, [id, type]);

    return { myPeer, myConnection };
}
