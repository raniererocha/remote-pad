import { generateRandomId } from "@/assets/generateRandomId";
import { useNavigate } from "react-router-dom";
import Button from "../Button";

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
                    <Button
                        onClick={() => navigate("/host/" + generateRandomId())}
                    >
                        Crie uma sala
                    </Button>
                </div>
            </section>
        </main>
    );
}
