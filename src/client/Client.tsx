import { useSignalR } from "../signalR/useSignalR";

const Client = () => {
        useSignalR();



    return <div>
        Client
        <video id="gum-local" autoPlay playsInline></video>
    </div>
}

export { Client };
