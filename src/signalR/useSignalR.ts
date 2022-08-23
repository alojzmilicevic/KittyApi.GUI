import { useEffect } from "react";
import { HttpTransportType, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

enum MessageType {
    Call = "call",
    Answer = 'answer',
    HangUp = 'hangUp',
}

interface Message {
    from: string,
    date: Date,
    type: MessageType,
}

const configuration = { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }] }

export function useSignalR() {
    const connection = new HubConnectionBuilder()
        .withUrl('https://localhost:7075/chatHub?clientType=provider', {
            transport: HttpTransportType.WebSockets,
            skipNegotiation: true,
            logger: LogLevel.Error
        })
        .withAutomaticReconnect()
        .build();

    let pc: RTCPeerConnection | null;

    useEffect(() => {
        connection.start().catch((e: any) => {
        });
    }, [])


    const onIncomingCall = async () => {
        pc = new RTCPeerConnection(configuration);

        pc.addEventListener('icecandidate', async ev => {
            if (ev.candidate) {
                await connection.invoke('SendMessageToClients', 'streamer',
                    { type: 'iceCandidate', 'candidate': ev.candidate, from: 'streamer' });
            }
        })

        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        const video: HTMLVideoElement = document.getElementById('gum-local') as HTMLVideoElement;
        video.srcObject = stream;
        stream.getTracks().forEach(track => pc?.addTrack(track, stream));

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        await connection.invoke('SendMessageToClients', 'streamer', offer);
    }

    connection.on('ReceiveMessage', async (user, message: Message) => {
        switch (message.type) {
            case MessageType.Call:
                console.log("INCOMING CALL")
                await onIncomingCall();
                break;

            case MessageType.Answer:
                console.log("ANSWER TIME:", pc?.signalingState);
                await pc?.setRemoteDescription(message as RTCSessionDescriptionInit)

                console.log("Getting answer")
                break;

            case MessageType.HangUp:
                console.log("Hang up ")
                pc?.close();
                const video: HTMLVideoElement = document.getElementById('gum-local') as HTMLVideoElement;
                video.srcObject = null;
        }
    });

}
