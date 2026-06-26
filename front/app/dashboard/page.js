"use client";

import { useEffect, useReducer } from "react";
import Link from "next/link";
import { getEvents } from "@/services/eventService";
import { getSessionsByEvent } from "@/services/sessionService";
import { getRooms } from "@/services/roomService";
import { getSpeakersBySession } from "@/services/speakerService";
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

  timeSlots.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

  return timeSlots;
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

function reducer(state, action) {
  switch (action.type) {
    case "SET_EVENTS":
      return { ...state, events: action.events };
    case "SET_SELECTED_EVENT":
      return { ...state, selectedEventId: action.id };
    case "LOAD_START":
      return { ...state, loading: true, error: "" };
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

export default function PublicDashboard() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    events,
    selectedEventId,
    rooms,
    timeSlots,
    speakersBySession,
    loading,
    error,
  } = state;

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

    Promise.all([getSessionsByEvent(selectedEventId), getRooms()])
      .then(async ([sessions, allRooms]) => {
        const ts = groupSessionsByRoomAndTime(sessions);

        const speakerMap = {};
        for (const s of sessions) {
          const sid = s.sessionId || s.id;
          try {
            const speakers = await getSpeakersBySession(sid);
            const roomId = s.room || s.roomName || "unknown";
            const cellKey = `${s.startTime}|${s.endTime}|${roomId}`;
            speakerMap[cellKey] = speakers;
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
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Programme</h1>
            <p className="mt-1 text-blue-200/60">
              Consultez le planning des sessions par salle
            </p>
          </div>
          {events.length > 0 && (
            <select
              value={selectedEventId}
              onChange={(e) =>
                dispatch({ type: "SET_SELECTED_EVENT", id: e.target.value })
              }
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
          <div className="mb-6 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500/30 border-t-blue-500" />
          </div>
        )}

        {!loading && events.length === 0 && !error && (
          <div className="rounded-lg border border-dashed border-blue-800/30 py-16 text-center">
            <p className="text-blue-200/60">Aucun événement disponible.</p>
          </div>
        )}

        {!loading && timeSlots.length === 0 && selectedEventId && !error && (
          <div className="rounded-lg border border-dashed border-blue-800/30 py-16 text-center">
            <p className="text-blue-200/60">
              Aucune session programmée pour cet événement.
            </p>
          </div>
        )}

        {!loading && timeSlots.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-blue-800/30 bg-slate-800/50 backdrop-blur-sm shadow-xl shadow-blue-900/20">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-blue-800/30 bg-slate-900/50">
                  <th className="w-40 px-5 py-4 font-semibold text-blue-200/80">
                    Horaire
                  </th>
                  {rooms.map((r) => (
                    <th
                      key={r.id}
                      className="px-5 py-4 font-semibold text-blue-200/80"
                    >
                      {r.name}
                    </th>
                  ))}
                  {rooms.length === 0 && (
                    <th className="px-5 py-4 font-medium text-blue-300/40">
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
                    <tr
                      key={`${slot.startTime}|${slot.endTime}`}
                      className="border-b border-blue-800/20 last:border-0"
                    >
                      <td className="whitespace-nowrap px-5 py-4 font-medium text-blue-200/80">
                        {startLabel}
                        <span className="mx-1 text-blue-400/40">—</span>
                        {endLabel}
                      </td>
                      {rooms.map((r) => {
                        const session =
                          slot.cells[r.id] || slot.cells[r.name];
                        if (!session) {
                          return (
                            <td key={r.id} className="px-5 py-4">
                              <span className="text-blue-400/30">—</span>
                            </td>
                          );
                        }
                        const sid = session.sessionId || session.id;
                        const cellKey = `${session.startTime}|${session.endTime}|${r.id}`;
                        const speakers = speakersBySession[cellKey] || [];
                        const live = isLive(session.startTime, session.endTime);

                        return (
                          <td key={r.id} className="px-5 py-4">
                            <Link
                              href={`/sessions/${sid}`}
                              className={`block rounded-lg border p-4 transition-all duration-200 hover:shadow-lg ${
                                live
                                  ? "border-red-500/30 bg-red-500/10 hover:shadow-red-500/10"
                                  : "border-blue-800/30 bg-slate-900/30 hover:border-blue-500/50 hover:shadow-blue-500/10"
                              }`}
                            >
                              <div className="flex items-start gap-2">
                                <div className="min-w-0 flex-1">
                                  <h3 className={`font-medium ${
                                    live ? "text-red-400" : "text-blue-200/90"
                                  }`}>
                                    {session.title}
                                  </h3>
                                  {session.description && (
                                    <p className="mt-1 text-xs text-blue-300/50 line-clamp-2">
                                      {session.description}
                                    </p>
                                  )}
                                  {speakers.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-1">
                                      {speakers.map((sp) => (
                                        <span
                                          key={sp.id}
                                          className="rounded-full bg-slate-800/50 px-2 py-0.5 text-xs text-blue-300/60"
                                        >
                                          {sp.firstName} {sp.lastName}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                {live && (
                                  <span
                                    className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-red-500 animate-pulse shadow-lg shadow-red-500/50"
                                    title="En direct"
                                  />
                                )}
                              </div>
                            </Link>
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

        {!loading && timeSlots.length > 0 && (
          <p className="mt-4 text-center text-xs text-blue-300/40">
            Cliquez sur une session pour voir les détails et poser vos questions
          </p>
        )}
      </div>
    </div>
  );
}