"use client";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Mic, MicOff, Video, VideoOff, PhoneOff, MoreHorizontal,
  MonitorUp, MessageSquare, Users, Loader2,
} from "lucide-react";
import { UserAvatar } from "@/components/ui/user-avatar";
import { USERS, CURRENT_USER } from "@/data/dummy-users";
import { cn } from "@/lib/utils";
import type { ChatChannel } from "@/types";
import { ScreenShareStage } from "./call/screen-share-stage";
import { CallChatPanel } from "./call/call-chat-panel";

export type CallMode = "audio" | "huddle";

interface Props {
  channel: ChatChannel | null;
  mode: CallMode | null;
  onClose: () => void;
}

type Status = "connecting" | "asking" | "joined" | "denied";

export function ChatCallModal({ channel, mode, onClose }: Props) {
  const [status, setStatus] = useState<Status>("connecting");
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(mode === "huddle");
  const [elapsed, setElapsed] = useState(0);
  const [sharing, setSharing] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!mode) return;
    setStatus(mode === "huddle" ? "asking" : "joined");
    if (mode === "huddle" && typeof navigator !== "undefined" && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          streamRef.current = stream;
          if (videoRef.current) videoRef.current.srcObject = stream;
          setStatus("joined");
        })
        .catch(() => {
          setStatus("denied");
          setCamOn(false);
          toast.error("Camera/microphone permission denied");
        });
    } else {
      const t = setTimeout(() => setStatus("joined"), 600);
      return () => clearTimeout(t);
    }
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [mode]);

  useEffect(() => {
    if (status !== "joined") return;
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [status]);

  useEffect(() => {
    if (!streamRef.current) return;
    streamRef.current.getAudioTracks().forEach((t) => (t.enabled = micOn));
  }, [micOn]);

  useEffect(() => {
    if (!streamRef.current) return;
    streamRef.current.getVideoTracks().forEach((t) => (t.enabled = camOn));
  }, [camOn]);

  if (!channel || !mode) return null;

  const otherMembers = channel.memberIds
    .filter((id) => id !== CURRENT_USER.id)
    .map((id) => USERS.find((u) => u.id === id))
    .filter((u): u is NonNullable<typeof u> => Boolean(u));

  const hh = String(Math.floor(elapsed / 3600)).padStart(2, "0");
  const mm = String(Math.floor((elapsed % 3600) / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");
  const time = elapsed >= 3600 ? `${hh}:${mm}:${ss}` : `${mm}:${ss}`;

  const handleEnd = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    onClose();
    toast(`${mode === "huddle" ? "Huddle" : "Call"} ended · ${time}`);
  };

  return (
    <Dialog.Root open onOpenChange={(v) => !v && handleEnd()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-950 text-white rounded-md shadow-2xl z-50 flex flex-col overflow-hidden"
          style={{ width: "min(720px, 96vw)", height: "min(560px, 90vh)" }}
        >
          <Dialog.Title className="sr-only">
            {mode === "huddle" ? "Huddle" : "Voice call"} with {channel.name}
          </Dialog.Title>
          <Dialog.Description className="sr-only">
            Active {mode === "huddle" ? "video huddle" : "voice call"} window with microphone, camera, and screen-share controls.
          </Dialog.Description>
          <CallHeader channel={channel} mode={mode} status={status} time={time} />

          <div className="relative flex-1 overflow-hidden bg-gradient-to-br from-gray-900 to-gray-950 flex items-center justify-center p-4">
            {sharing ? (
              <ScreenShareStage onStop={() => { setSharing(false); toast("Screen sharing stopped"); }} />
            ) : mode === "huddle" ? (
              <HuddleStage
                status={status}
                camOn={camOn}
                videoRef={videoRef}
                otherMembers={otherMembers}
              />
            ) : (
              <CallStage otherMembers={otherMembers} status={status} />
            )}
            {chatOpen && (
              <CallChatPanel
                channelName={channel.kind === "dm" ? channel.name : `#${channel.name}`}
                onClose={() => setChatOpen(false)}
              />
            )}
          </div>

          <CallControls
            mode={mode}
            micOn={micOn}
            camOn={camOn}
            sharing={sharing}
            chatOpen={chatOpen}
            setMicOn={setMicOn}
            setCamOn={setCamOn}
            setSharing={setSharing}
            setChatOpen={setChatOpen}
            onEnd={handleEnd}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function CallHeader({
  channel, mode, status, time,
}: { channel: ChatChannel; mode: CallMode; status: Status; time: string }) {
  return (
    <div className="flex items-center gap-3 px-4 h-12 border-b border-white/10 flex-shrink-0">
      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-semibold truncate">
          {mode === "huddle" ? "Huddle" : "Voice call"} · {channel.kind === "dm" ? channel.name : `#${channel.name}`}
        </div>
        <div className="text-[10.5px] text-white/50">
          {status === "asking" ? "Requesting permissions…"
            : status === "denied" ? "Permission denied — running audio-only"
            : status === "connecting" ? "Connecting…"
            : `Live · ${time}`}
        </div>
      </div>
      <button className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/10 transition-colors" title="More">
        <MoreHorizontal className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

function HuddleStage({
  status, camOn, videoRef, otherMembers,
}: {
  status: Status;
  camOn: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  otherMembers: { id: string; name: string; initials: string; color: string }[];
}) {
  if (status === "asking") {
    return (
      <div className="flex flex-col items-center gap-3 text-white/70">
        <Loader2 className="w-6 h-6 animate-spin" />
        <div className="text-[13px] font-semibold">Allow camera & microphone</div>
        <div className="text-[11px] text-white/50 max-w-xs text-center">
          Your browser is asking for access. Allow to start the huddle.
        </div>
      </div>
    );
  }
  return (
    <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-2">
      <div className="relative rounded-md overflow-hidden bg-gray-800 col-span-2 row-span-1 sm:col-span-1 sm:row-span-2">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className={cn(
            "w-full h-full object-cover bg-gray-900",
            !camOn && "opacity-0",
          )}
          style={{ transform: "scaleX(-1)" }}
        />
        {!camOn && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/60 bg-gray-800">
            <VideoOff className="w-6 h-6" />
            <span className="text-[11px]">Camera off</span>
          </div>
        )}
        <span className="absolute bottom-2 left-2 text-[10.5px] font-semibold bg-black/50 px-1.5 py-0.5 rounded">
          You
        </span>
      </div>
      {otherMembers.slice(0, 4).map((u) => (
        <div
          key={u.id}
          className="relative rounded-md bg-gray-800 flex items-center justify-center"
        >
          <UserAvatar user={u} size={48} hoverCard={false} />
          <span className="absolute bottom-2 left-2 text-[10.5px] font-semibold bg-black/50 px-1.5 py-0.5 rounded">
            {u.name.split(" ")[0]}
          </span>
        </div>
      ))}
    </div>
  );
}

function CallStage({
  otherMembers, status,
}: { otherMembers: { id: string; name: string; initials: string; color: string }[]; status: Status }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex -space-x-3">
        {otherMembers.slice(0, 4).map((u) => (
          <div key={u.id} className="rounded-full ring-4 ring-gray-950">
            <UserAvatar user={u} size={56} hoverCard={false} />
          </div>
        ))}
      </div>
      <div className="text-[13px] font-semibold">
        {otherMembers.map((u) => u.name.split(" ")[0]).slice(0, 3).join(", ")}
        {otherMembers.length > 3 && ` +${otherMembers.length - 3}`}
      </div>
      <div className="text-[11px] text-white/50">
        {status === "joined" ? "Connected — say hi 👋" : "Connecting…"}
      </div>
    </div>
  );
}

function CallControls({
  mode, micOn, camOn, sharing, chatOpen, setMicOn, setCamOn, setSharing, setChatOpen, onEnd,
}: {
  mode: CallMode;
  micOn: boolean;
  camOn: boolean;
  sharing: boolean;
  chatOpen: boolean;
  setMicOn: (v: boolean) => void;
  setCamOn: (v: boolean) => void;
  setSharing: (v: boolean) => void;
  setChatOpen: (v: boolean) => void;
  onEnd: () => void;
}) {
  return (
    <div className="flex items-center justify-center gap-2 py-3.5 px-4 border-t border-white/10 bg-black/30 flex-shrink-0">
      <ControlBtn
        title={micOn ? "Mute" : "Unmute"}
        onClick={() => setMicOn(!micOn)}
        active={!micOn}
      >
        {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
      </ControlBtn>
      {mode === "huddle" && (
        <ControlBtn
          title={camOn ? "Turn off camera" : "Turn on camera"}
          onClick={() => setCamOn(!camOn)}
          active={!camOn}
        >
          {camOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
        </ControlBtn>
      )}
      <ControlBtn
        title={sharing ? "Stop sharing" : "Share screen"}
        onClick={() => {
          setSharing(!sharing);
          toast(sharing ? "Screen sharing stopped" : "Sharing your screen");
        }}
        on={sharing}
      >
        <MonitorUp className="w-4 h-4" />
      </ControlBtn>
      <ControlBtn
        title={chatOpen ? "Hide chat" : "Show chat"}
        onClick={() => setChatOpen(!chatOpen)}
        on={chatOpen}
      >
        <MessageSquare className="w-4 h-4" />
      </ControlBtn>
      <ControlBtn title="Invite" onClick={() => toast.info("Invite link copied")}>
        <Users className="w-4 h-4" />
      </ControlBtn>
      <button
        onClick={onEnd}
        className={cn(
          "inline-flex items-center gap-1.5 h-10 px-4 rounded-full bg-rose-500 hover:bg-rose-600",
          "text-white text-[12.5px] font-semibold transition-colors",
        )}
        title="End"
      >
        <PhoneOff className="w-3.5 h-3.5" /> End
      </button>
    </div>
  );
}

function ControlBtn({
  children, title, onClick, active, on,
}: { children: React.ReactNode; title: string; onClick: () => void; active?: boolean; on?: boolean }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
        active
          ? "bg-rose-500/20 text-rose-300 hover:bg-rose-500/30"
          : on
            ? "bg-emerald-500/25 text-emerald-200 hover:bg-emerald-500/35"
            : "bg-white/10 text-white hover:bg-white/15",
      )}
    >
      {children}
    </button>
  );
}
