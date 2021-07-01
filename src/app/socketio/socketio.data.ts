export const EVENTS = {
    JOIN_ROOM: "join-room",
    LEAVE_ROOM: "leave-room",
    JOINED_ROOM: "joined-room",
    PLAY: "play",
    PAUSE: "pause",
    NEW_TRACK: "new-track",
    REQUEST_CURRENT_TIME: "request-current-time",
    CLIENT_ID: "client-id",
    MOVIE_DELETE: "movie-delete",
    TV_SHOW_DELETE: "tv-show-delete",
    NEW_USER: "new-user",
    USER_LEFT: "user-left",
    USER_JOINED: "user-joined",
    USER_DELETED: "user-deleted",
    TORRENT_UPDATE: "torrent-update",
    TORRENT_DELETE: "torrent-delete",
    TORRENT_ADD: "torrent-add",
    TORRENT_PAUSE: "torrent-pause"
};

export function torrentEvent(name: string): string {
    return `${EVENTS.TORRENT_UPDATE}/${name}`;
}