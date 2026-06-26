"use client";

import { useEffect, useReducer } from "react";
import Link from "next/link";
import { getEvents } from "@/services/eventService";
import { getSessionsByEvent } from "@/services/sessionService";
import { getRooms } from "@/services/roomService";
import { formatTime, isLive } from "@/lib/utils";

function groupSessionsByRoomAndTime(sessions) {
  const timeSlots = [];
  const map = {};

  for (const s of sessions) {
    const key = `${s.startTime}|${s.endTime}`;
    if (!map[key]) {
      map[key] = { startTime: s.startTime, endTime: s.endTime, cells: {} };
      timeSlots.push(map[key]);
    }
    const roomId = s.room || s.roomName || "unknown";
    map[key].cells[roomId] = s;
  }

  timeSlots.sort(
    (a, b) => new Date(a.startTime) - new Date(b.startTime)
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
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Aperçu du programme</h1>
        {events.length > 0 && (
          <select
            value={selectedEventId}
            onChange={(e) => dispatch({ type: "SET_SELECTED_EVENT", id: e.target.value })}
            className="rounded border px-3 py-1.5 text-sm"
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
        <p className="mb-4 rounded bg-red-50 p-2 text-sm text-red-600">{error}</p>
      )}

      {loading && <p className="text-gray-500">Chargement...</p>}

      {!loading && timeSlots.length === 0 && selectedEventId && (
        <p className="text-gray-500">
          Aucune session pour cet événement.{" "}
          <Link
            href={`/admin/events/${selectedEventId}/sessions/new`}
            className="text-indigo-600 hover:underline"
          >
            Créer une session
          </Link>
        </p>
      )}

      {!loading && timeSlots.length > 0 && (
        <div className="overflow-x-auto rounded border bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="w-36 px-4 py-3 font-medium text-gray-600">
                  Horaire
                </th>
                {rooms.map((r) => (
                  <th
                    key={r.id}
                    className="px-4 py-3 font-medium text-gray-600"
                  >
                    {r.name}
                  </th>
                ))}
                {rooms.length === 0 && (
                  <th className="px-4 py-3 font-medium text-gray-400">
                    Aucune salle
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((slot) => {
                const startLabel = formatTime(slot.startTime);
                const endLabel = formatTime(slot.endTime);
                return (
                  <tr key={`${slot.startTime}|${slot.endTime}`} className="border-b">
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-700">
                      {startLabel} — {endLabel}
                    </td>
                    {rooms.map((r) => {
                      const session = slot.cells[r.id] || slot.cells[r.name];
                      if (!session) {
                        return (
                          <td
                            key={r.id}
                            className="px-4 py-3 text-gray-300"
                          >
                            —
                          </td>
                        );
                      }
                      const sid = session.sessionId || session.id;
                      const cellKey = `${session.startTime}|${session.endTime}|${r.id}`;
                      const speakers = speakersBySession[cellKey] || [];
                      const live = isLive(session.startTime, session.endTime);

                      return (
                        <td key={r.id} className="px-4 py-3">
                          <div className={`rounded border p-3 ${live ? "border-red-300 bg-red-50" : "border-gray-200"}`}>
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/admin/events/${selectedEventId}/sessions/${sid}`}
                                className="font-medium text-indigo-700 hover:underline"
                              >
                                {session.title}
                              </Link>
                              {live && (
                                <span className="inline-block h-2 w-2 rounded-full bg-red-500 animate-pulse" title="En direct" />
                              )}
                            </div>
                            {session.description && (
                              <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                                {session.description}
                              </p>
                            )}
                            {speakers.length > 0 && (
                              <p className="mt-1 text-xs text-gray-400">
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
            className="text-sm text-indigo-600 hover:underline"
          >
            Gérer les sessions →
          </Link>
        </div>
      )}
    </div>
  );
}
