"use client";

import { useEffect, useReducer } from "react";
import Link from "next/link";
import { getEvents } from "@/services/eventService";
import { getSessionsByEvent } from "@/services/sessionService";
import { getRooms } from "@/services/roomService";
import { formatDate, formatTime, isLive } from "@/lib/utils";

function groupSessionsByRoomAndTime(sessions) {
  const timeSlots = [];
  const map = {};

  for (const s of sessions) {
    const key = `${s.date}|${s.startTime}|${s.endTime}`;
    if (!map[key]) {
      map[key] = { date: s.date, startTime: s.startTime, endTime: s.endTime, cells: {} };
      timeSlots.push(map[key]);
    }
    const roomId = s.room || s.roomName || "unknown";
    map[key].cells[roomId] = s;
  }

  timeSlots.sort(
    (a, b) => new Date(`${a.date}T${a.startTime}`) - new Date(`${b.date}T${b.startTime}`)
  );

  return timeSlots;
}

function reducer(state, action) {
  switch (action.type) {
    case "SET_EVENTS":
      return { ...state, events: action.events };
    case "SET_SELECTED_EVENT":
      return { ...state, selectedEventId: action.id };
    case "LOAD_START":
      return { ...state, loading: true, error: "" };
    case "LOAD_DONE":
      return { ...state, loading: false };
    case "LOAD_ERROR":
      return { ...state, loading: false, error: action.error };
    case "SET_GRID_DATA":
      return {
        ...state,
        loading: false,
        rooms: action.rooms,
        timeSlots: action.timeSlots,
        speakersBySession: action.speakersBySession,
      };
    case "SET_ROOMS":
      return { ...state, rooms: action.rooms };
    default:
      return state;
  }
}

const initialState = {
  events: [],
  selectedEventId: "",
  rooms: [],
  timeSlots: [],
  speakersBySession: {},
  loading: false,
  error: "",
};

export default function AdminDashboard() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { events, selectedEventId, rooms, timeSlots, speakersBySession, loading, error } = state;

  useEffect(() => {
    getEvents()
      .then((data) => {
        dispatch({ type: "SET_EVENTS", events: data });
        if (data.length > 0) {
          dispatch({ type: "SET_SELECTED_EVENT", id: data[0].id });
        }
      })
      .catch((e) => dispatch({ type: "LOAD_ERROR", error: e.message }));
    getRooms()
      .then((data) => dispatch({ type: "SET_ROOMS", rooms: data }))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedEventId) return;
    dispatch({ type: "LOAD_START" });

    Promise.all([
      getSessionsByEvent(selectedEventId),
      getRooms(),
    ])
      .then(async ([sessions, allRooms]) => {
        const ts = groupSessionsByRoomAndTime(sessions);

        const speakerMap = {};
        for (const s of sessions) {
          const sid = s.sessionId || s.id;
          try {
            const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
            const res = await fetch(`${base}/speakers/session/${sid}`, {
              cache: "no-store",
            });
            if (res.ok) {
              const speakers = await res.json();
              const roomId = s.room || s.roomName || "unknown";
              const cellKey = `${s.startTime}|${s.endTime}|${roomId}`;
              speakerMap[cellKey] = speakers;
            }
          } catch {}
        }

        dispatch({
          type: "SET_GRID_DATA",
          rooms: allRooms,
          timeSlots: ts,
          speakersBySession: speakerMap,
        });
      })
      .catch((e) => dispatch({ type: "LOAD_ERROR", error: e.message }));
  }, [selectedEventId]);

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-white">Program overview</h1>
          {events.length > 0 && (
            <select
              value={selectedEventId}
              onChange={(e) => dispatch({ type: "SET_SELECTED_EVENT", id: e.target.value })}
              className="w-full rounded-lg border-0 bg-slate-800/50 px-4 py-2 text-sm text-white shadow-lg shadow-blue-900/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 sm:w-auto"
            >
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.title}
                </option>
              ))}
            </select>
          )}
        </div>

        {error && (
          <p className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">{error}</p>
        )}

        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500/30 border-t-blue-500" />
          </div>
        )}

        {!loading && timeSlots.length === 0 && selectedEventId && (
          <div className="rounded-lg border border-dashed border-blue-800/30 py-16 text-center">
            <p className="text-blue-200/60">
              No sessions for this event.{" "}
              <Link
                href={`/admin/events/${selectedEventId}/sessions/new`}
                className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
              >
                Create a session
              </Link>
            </p>
          </div>
        )}

        {!loading && timeSlots.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-blue-800/30 bg-slate-800/50 backdrop-blur-sm shadow-xl shadow-blue-900/20">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-blue-800/30 bg-slate-900/50">
                  <th className="w-36 px-4 py-3 font-medium text-blue-200/80">
                    Schedule
                  </th>
                  {rooms.map((r) => (
                    <th
                      key={r.id}
                      className="px-4 py-3 font-medium text-blue-200/80"
                    >
                      {r.name}
                    </th>
                  ))}
                  {rooms.length === 0 && (
                    <th className="px-4 py-3 font-medium text-blue-300/40">
                      No room
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((slot) => {
                  const dateLabel = formatDate(slot.date);
                  const startLabel = formatTime(slot.startTime);
                  const endLabel = formatTime(slot.endTime);
                  return (
                    <tr key={`${slot.date}|${slot.startTime}|${slot.endTime}`} className="border-b border-blue-800/20 last:border-0">
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-blue-200/80">
                        <span className="text-xs text-blue-300/50">{dateLabel}</span>
                        <br />
                        {startLabel} — {endLabel}
                      </td>
                      {rooms.map((r) => {
                        const session = slot.cells[r.id] || slot.cells[r.name];
                        if (!session) {
                          return (
                            <td
                              key={r.id}
                              className="px-4 py-3 text-blue-400/30"
                            >
                              —
                            </td>
                          );
                        }
                        const sid = session.sessionId || session.id;
                        const cellKey = `${session.startTime}|${session.endTime}|${r.id}`;
                        const speakers = speakersBySession[cellKey] || [];
                        const live = isLive(session.startTime, session.endTime, session.date);

                        return (
                          <td key={r.id} className="px-4 py-3">
                            <div className={`rounded-lg border p-3 transition-all duration-200 ${
                              live 
                                ? "border-red-500/30 bg-red-500/10 hover:border-red-500/50" 
                                : "border-blue-800/30 bg-slate-900/30 hover:border-blue-500/50"
                            }`}>
                              <div className="flex items-center gap-2">
                                <Link
                                  href={`/admin/events/${selectedEventId}/sessions/${sid}`}
                                  className={`font-medium transition-colors duration-200 ${
                                    live ? "text-red-400 hover:text-red-300" : "text-blue-200/90 hover:text-blue-100"
                                  }`}
                                >
                                  {session.title}
                                </Link>
                                {live && (
                                  <span className="inline-block h-2 w-2 rounded-full bg-red-500 animate-pulse shadow-lg shadow-red-500/50" title="En direct" />
                                )}
                              </div>
                              {session.description && (
                                <p className="mt-1 text-xs text-blue-300/50 line-clamp-2">
                                  {session.description}
                                </p>
                              )}
                              {speakers.length > 0 && (
                                <p className="mt-1 text-xs text-blue-300/40">
                                  {speakers.map((sp) => `${sp.firstName} ${sp.lastName}`).join(", ")}
                                </p>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {!loading && events.length > 0 && timeSlots.length > 0 && (
          <div className="mt-4 text-right">
            <Link
              href={`/admin/events/${selectedEventId}/sessions`}
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors duration-200 mb-4"
            >
              Manage sessions
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                <path d="M566.6 342.6C579.1 330.1 579.1 309.8 566.6 297.3L406.6 137.3C394.1 124.8 373.8 124.8 361.3 137.3C348.8 149.8 348.8 170.1 361.3 182.6L466.7 288L96 288C78.3 288 64 302.3 64 320C64 337.7 78.3 352 96 352L466.7 352L361.3 457.4C348.8 469.9 348.8 490.2 361.3 502.7C373.8 515.2 394.1 515.2 406.6 502.7L566.6 342.7z"/>
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}