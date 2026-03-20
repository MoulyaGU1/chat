"use client";
import { useEffect, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export const useWebRTC = (callId: any, isCaller: boolean) => {
  const pc = useRef<RTCPeerConnection | null>(null);
  const updateCall = useMutation(api.calls.updateCallSignal);
  const callData = useQuery(api.calls.getCall, { callId });

  useEffect(() => {
    pc.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    });

    if (isCaller) {
      // Caller creates offer
      pc.current.createOffer().then(offer => {
        pc.current!.setLocalDescription(offer);
        updateCall({ callId, offer: JSON.stringify(offer) });
      });
    }

    // Logic to handle Answer when it arrives in callData
    if (!isCaller && callData?.offer && !callData.answer) {
      const offer = new RTCSessionDescription(JSON.parse(callData.offer));
      pc.current.setRemoteDescription(offer).then(() => {
        pc.current!.createAnswer().then(answer => {
          pc.current!.setLocalDescription(answer);
          updateCall({ callId, answer: JSON.stringify(answer) });
        });
      });
    }
  }, [callData]);

  return { pc: pc.current };
};