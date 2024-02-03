import { generateRandomId } from "@/assets/generateRandomId";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();
    return (
        <main className="w-screen h-screen flex flex-col justify-center items-center ">
            <section className="w-full px-6 py-12 space-y-10 text-center text-secondary-foreground">
                <h1 className="text-4xl">
                    Olá, seja bem vindo ao{" "}
                    <span className="font-semibold">Remote Pad</span>
                </h1>
                <div className="space-y-3 flex flex-col">
                    <button
                        className="bg-primary text-primary-foreground p-2 rounded font-semibold"
                        onClick={() => navigate("/host/" + generateRandomId())}
                    >
                        Crie uma sala
                    </button>
                    {/*  <button
                        className="bg-primary text-primary-foreground p-2 rounded font-semibold"
                        onClick={() => navigate("/connect")}
                    >
                        Entre em uma sala existente
                    </button> */}
                </div>
            </section>
        </main>
    );
}
