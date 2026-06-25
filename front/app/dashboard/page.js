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
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Programme</h1>
          <p className="mt-1 text-gray-500">
            Consultez le planning des sessions par salle
          </p>
        </div>
        {events.length > 0 && (
          <select
            value={selectedEventId}
            onChange={(e) =>
              dispatch({ type: "SET_SELECTED_EVENT", id: e.target.value })
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none sm:w-auto"
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
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
        </div>
      )}

      {!loading && events.length === 0 && !error && (
        <div className="rounded-lg border border-dashed border-gray-300 py-16 text-center">
          <p className="text-gray-500">Aucun événement disponible.</p>
        </div>
      )}

      {!loading && timeSlots.length === 0 && selectedEventId && !error && (
        <div className="rounded-lg border border-dashed border-gray-300 py-16 text-center">
          <p className="text-gray-500">
            Aucune session programmée pour cet événement.
          </p>
        </div>
      )}

      {!loading && timeSlots.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="w-40 px-5 py-4 font-semibold text-gray-600">
                  Horaire
                </th>
                {rooms.map((r) => (
                  <th
                    key={r.id}
                    className="px-5 py-4 font-semibold text-gray-600"
                  >
                    {r.name}
                  </th>
                ))}
                {rooms.length === 0 && (
                  <th className="px-5 py-4 font-medium text-gray-400">
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
                    className="border-b border-gray-100 last:border-0"
                  >
                    <td className="whitespace-nowrap px-5 py-4 font-medium text-gray-700">
                      {startLabel}
                      <span className="mx-1 text-gray-400">—</span>
                      {endLabel}
                    </td>
                    {rooms.map((r) => {
                      const session =
                        slot.cells[r.id] || slot.cells[r.name];
                      if (!session) {
                        return (
                          <td key={r.id} className="px-5 py-4">
                            <span className="text-gray-300">—</span>
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
                            className={`block rounded-lg border p-4 transition-shadow hover:shadow-md ${
                              live
                                ? "border-red-200 bg-red-50"
                                : "border-gray-200 hover:border-indigo-200"
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <div className="min-w-0 flex-1">
                                <h3 className="font-medium text-indigo-700">
                                  {session.title}
                                </h3>
                                {session.description && (
                                  <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                                    {session.description}
                                  </p>
                                )}
                                {speakers.length > 0 && (
                                  <div className="mt-2 flex flex-wrap gap-1">
                                    {speakers.map((sp) => (
                                      <span
                                        key={sp.id}
                                        className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                                      >
                                        {sp.firstName} {sp.lastName}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              {live && (
                                <span
                                  className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-red-500 animate-pulse"
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
        <p className="mt-4 text-center text-xs text-gray-400">
          Cliquez sur une session pour voir les détails et poser vos questions
        </p>
      )}
    </div>
  );
}
